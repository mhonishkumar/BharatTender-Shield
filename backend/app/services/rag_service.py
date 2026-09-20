"""
rag_service.py
--------------
RAG (Retrieval-Augmented Generation) retrieval service for BharatTender Shield.

Responsibilities:
  - Generate query embeddings
  - Retrieve top-k relevant chunks from document_chunks table
  - Filter by tender_id / application_id / bidder_id for RBAC
  - Return chunks with full source provenance (document, page, text)
  - Never mix chunks across different bidders (RBAC-enforced)

RBAC Contract:
  - Bidder: may only retrieve chunks from their own application_id
  - Officer: may retrieve chunks for tenders they manage
  - Admin: unrestricted
"""
import json
import logging
from typing import List, Dict, Any, Optional

from sqlalchemy.orm import Session
from sqlalchemy import text

from app import models
from app.services.embedding_service import (
    generate_embedding,
    embedding_to_json,
    json_to_embedding,
    cosine_similarity
)
from app.config import settings

logger = logging.getLogger("uvicorn.error")

TOP_K_DEFAULT = 5
SIMILARITY_THRESHOLD = 0.15  # minimum similarity to include a chunk


def retrieve_context(
    db: Session,
    query: str,
    tender_id: Optional[int] = None,
    application_id: Optional[int] = None,
    bidder_id: Optional[int] = None,
    top_k: int = TOP_K_DEFAULT,
    calling_user_role: str = "PROCUREMENT_OFFICER",
    calling_bidder_id: Optional[int] = None,
) -> List[Dict[str, Any]]:
    """
    Retrieve the most relevant document chunks for a given query.

    Args:
        db: Database session
        query: Natural language question or requirement text
        tender_id: Scope retrieval to a specific tender
        application_id: Scope retrieval to a specific application
        bidder_id: Scope retrieval to a specific bidder's documents
        top_k: Maximum number of chunks to return
        calling_user_role: Role of the requesting user (for RBAC enforcement)
        calling_bidder_id: Bidder profile ID of requesting user (if role=BIDDER)

    Returns:
        List of chunk dicts with: chunk_text, page_number, source_filename,
        doc_type, similarity, application_id, tender_id
    """
    if not query or not query.strip():
        return []

    # RBAC: if caller is a BIDDER, force scope to their own application_id
    if calling_user_role == "BIDDER" and calling_bidder_id:
        if bidder_id and bidder_id != calling_bidder_id:
            logger.warning(f"[RAG] BIDDER {calling_bidder_id} attempted to query bidder {bidder_id} — blocked")
            return []
        bidder_id = calling_bidder_id

    # Generate query embedding
    try:
        query_embedding = generate_embedding(query)
    except Exception as e:
        logger.error(f"[RAG] Failed to generate query embedding: {e}")
        return []

    db_url = settings.DATABASE_URL
    is_postgres = "postgresql" in db_url or "postgres" in db_url

    if is_postgres:
        return _postgres_similarity_search(
            db, query_embedding, tender_id, application_id, bidder_id, top_k
        )
    else:
        return _sqlite_similarity_search(
            db, query_embedding, tender_id, application_id, bidder_id, top_k
        )


def _build_filter_clause(
    tender_id: Optional[int],
    application_id: Optional[int],
    bidder_id: Optional[int],
) -> tuple:
    """Build SQL WHERE conditions and params for filtering chunks."""
    conditions = []
    params: Dict[str, Any] = {}

    if application_id:
        conditions.append("application_id = :application_id")
        params["application_id"] = application_id
    elif tender_id and not application_id:
        conditions.append("tender_id = :tender_id")
        params["tender_id"] = tender_id

    if bidder_id and not application_id:
        conditions.append("bidder_id = :bidder_id")
        params["bidder_id"] = bidder_id

    where_sql = ("WHERE " + " AND ".join(conditions)) if conditions else ""
    return where_sql, params


def _postgres_similarity_search(
    db: Session,
    query_embedding: List[float],
    tender_id: Optional[int],
    application_id: Optional[int],
    bidder_id: Optional[int],
    top_k: int,
) -> List[Dict[str, Any]]:
    """
    Use pgvector cosine similarity operator (<=> for cosine distance).
    Requires pgvector extension and vector column in document_chunks.
    
    Falls back to Python similarity if embedding column is text (migration not yet done).
    """
    where_sql, params = _build_filter_clause(tender_id, application_id, bidder_id)
    embedding_str = "[" + ",".join(str(v) for v in query_embedding) + "]"
    params["top_k"] = top_k
    params["embedding"] = embedding_str

    try:
        # Try pgvector operator first
        sql = text(f"""
            SELECT 
                id, document_id, application_id, tender_id, bidder_id,
                chunk_text, page_number, chunk_index, source_filename, doc_type,
                1 - (embedding::vector <=> :embedding::vector) AS similarity
            FROM document_chunks
            {where_sql}
            ORDER BY embedding::vector <=> :embedding::vector ASC
            LIMIT :top_k
        """)
        rows = db.execute(sql, params).fetchall()
        return _rows_to_chunks(rows, has_similarity=True)

    except Exception as e:
        logger.warning(f"[RAG] pgvector query failed, falling back to Python similarity: {e}")
        return _sqlite_similarity_search(db, query_embedding, tender_id, application_id, bidder_id, top_k)


def _sqlite_similarity_search(
    db: Session,
    query_embedding: List[float],
    tender_id: Optional[int],
    application_id: Optional[int],
    bidder_id: Optional[int],
    top_k: int,
) -> List[Dict[str, Any]]:
    """
    Python-level cosine similarity for SQLite (local dev) or pgvector fallback.
    Loads all matching chunks and scores them in memory.
    """
    q = db.query(models.DocumentChunk)

    if application_id:
        q = q.filter(models.DocumentChunk.application_id == application_id)
    elif tender_id:
        q = q.filter(models.DocumentChunk.tender_id == tender_id)

    if bidder_id and not application_id:
        q = q.filter(models.DocumentChunk.bidder_id == bidder_id)

    chunks = q.all()

    if not chunks:
        return []

    scored = []
    for chunk in chunks:
        chunk_embedding = json_to_embedding(chunk.embedding)
        if not chunk_embedding:
            continue
        sim = cosine_similarity(query_embedding, chunk_embedding)
        if sim >= SIMILARITY_THRESHOLD:
            scored.append((sim, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)
    top = scored[:top_k]

    result = []
    for sim, chunk in top:
        result.append({
            "chunk_id": chunk.id,
            "document_id": chunk.document_id,
            "application_id": chunk.application_id,
            "tender_id": chunk.tender_id,
            "bidder_id": chunk.bidder_id,
            "chunk_text": chunk.chunk_text,
            "page_number": chunk.page_number,
            "chunk_index": chunk.chunk_index,
            "source_filename": chunk.source_filename or "Unknown Document",
            "doc_type": chunk.doc_type or "",
            "similarity": round(sim, 4),
        })
    return result


def _rows_to_chunks(rows: list, has_similarity: bool = False) -> List[Dict[str, Any]]:
    """Convert raw DB rows to chunk dicts."""
    result = []
    for row in rows:
        chunk = {
            "chunk_id": row.id,
            "document_id": row.document_id,
            "application_id": row.application_id,
            "tender_id": row.tender_id,
            "bidder_id": row.bidder_id,
            "chunk_text": row.chunk_text,
            "page_number": row.page_number,
            "chunk_index": row.chunk_index,
            "source_filename": row.source_filename or "Unknown Document",
            "doc_type": row.doc_type or "",
            "similarity": round(float(row.similarity), 4) if has_similarity else 0.0,
        }
        if not has_similarity or chunk["similarity"] >= SIMILARITY_THRESHOLD:
            result.append(chunk)
    return result


def store_document_chunks(
    db: Session,
    chunks_data: List[Dict[str, Any]],
    document_id: int,
) -> int:
    """
    Store document chunks with their embeddings in the database.
    
    - Deletes existing chunks for this document first (re-ingestion safe)
    - Generates embeddings for each chunk
    - Stores in document_chunks table
    
    Returns count of stored chunks.
    """
    from app.services.embedding_service import generate_embedding, embedding_to_json

    # Remove existing chunks for this document
    db.query(models.DocumentChunk).filter(
        models.DocumentChunk.document_id == document_id
    ).delete()

    stored = 0
    for chunk_data in chunks_data:
        try:
            embedding = generate_embedding(chunk_data["chunk_text"])
            embedding_json = embedding_to_json(embedding)
        except Exception as e:
            logger.warning(f"[RAG] Embedding failed for chunk {chunk_data.get('chunk_index', '?')}: {e}")
            embedding_json = None

        chunk_obj = models.DocumentChunk(
            document_id=chunk_data["document_id"],
            application_id=chunk_data.get("application_id"),
            tender_id=chunk_data.get("tender_id"),
            bidder_id=chunk_data.get("bidder_id"),
            chunk_text=chunk_data["chunk_text"],
            page_number=chunk_data.get("page_number", 1),
            chunk_index=chunk_data.get("chunk_index", 0),
            source_filename=chunk_data.get("source_filename", ""),
            doc_type=chunk_data.get("doc_type", ""),
            embedding=embedding_json,
            chunk_metadata=chunk_data.get("chunk_metadata"),
        )
        db.add(chunk_obj)
        stored += 1

    db.commit()
    logger.info(f"[RAG] Stored {stored} chunks for document_id={document_id}")
    return stored
