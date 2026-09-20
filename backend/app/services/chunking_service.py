"""
chunking_service.py
-------------------
Text chunking with full page provenance preservation.
Splits document pages into overlapping chunks for embedding and RAG retrieval.

Every chunk retains:
  - document_id, application_id, tender_id, bidder_id
  - page_number, chunk_index
  - source_filename, doc_type
"""
import re
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("uvicorn.error")

DEFAULT_CHUNK_SIZE = 500   # characters
DEFAULT_OVERLAP = 100      # character overlap between consecutive chunks
MIN_CHUNK_LENGTH = 40      # discard chunks shorter than this


def clean_text(text: str) -> str:
    """
    Clean extracted document text.
    - Remove null bytes and control characters
    - Collapse excessive whitespace
    - Normalize line endings
    """
    if not text:
        return ""
    # Remove null bytes
    text = text.replace("\x00", "")
    # Normalize line endings
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Remove non-printable control chars except newline/tab
    text = re.sub(r"[\x01-\x08\x0b\x0c\x0e-\x1f\x7f]", " ", text)
    # Collapse multiple spaces (but preserve single newlines)
    text = re.sub(r"[ \t]+", " ", text)
    # Collapse more than 2 consecutive newlines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_text_into_chunks(text: str, chunk_size: int = DEFAULT_CHUNK_SIZE, overlap: int = DEFAULT_OVERLAP) -> List[str]:
    """
    Split text into overlapping chunks at sentence boundaries where possible.
    Returns list of chunk strings.
    """
    text = text.strip()
    if not text:
        return []

    # Try sentence-boundary splitting first
    sentence_endings = re.compile(r"(?<=[.!?।])\s+")
    sentences = sentence_endings.split(text)

    chunks = []
    current_chunk = ""

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        # If adding this sentence exceeds chunk_size, flush current chunk
        if len(current_chunk) + len(sentence) + 1 > chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            # Keep overlap from end of current chunk
            overlap_text = current_chunk[-overlap:] if len(current_chunk) > overlap else current_chunk
            current_chunk = overlap_text + " " + sentence
        else:
            current_chunk = (current_chunk + " " + sentence).strip()

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    # If no sentence boundaries found (e.g., scanned OCR output), fall back to character chunking
    if not chunks:
        chunks = _character_chunks(text, chunk_size, overlap)

    return [c for c in chunks if len(c) >= MIN_CHUNK_LENGTH]


def _character_chunks(text: str, chunk_size: int, overlap: int) -> List[str]:
    """Fallback: pure character-level chunking."""
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunk = text[start:end].strip()
        if len(chunk) >= MIN_CHUNK_LENGTH:
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


def chunk_document_pages(
    pages_data: List[Dict[str, Any]],
    document_id: int,
    application_id: Optional[int] = None,
    tender_id: Optional[int] = None,
    bidder_id: Optional[int] = None,
    source_filename: str = "",
    doc_type: str = "",
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_OVERLAP,
) -> List[Dict[str, Any]]:
    """
    Chunk all pages of a document into embedding-ready records.
    
    Args:
        pages_data: List of {page_number, text, image_count} from process_pdf_document()
        document_id: FK to documents table
        application_id: FK to applications table (if bidder doc)
        tender_id: FK to tenders table (if tender doc)
        bidder_id: FK to bidder_profiles table
        source_filename: Original filename for provenance
        doc_type: Document type (GST_CERTIFICATE, etc.)
        chunk_size: Max characters per chunk
        overlap: Overlap characters between chunks
    
    Returns:
        List of chunk dicts ready for DB insertion and embedding.
    """
    all_chunks = []
    global_chunk_index = 0

    for page_info in pages_data:
        page_num = page_info.get("page_number", 1)
        raw_text = page_info.get("text", "")
        cleaned = clean_text(raw_text)

        if not cleaned:
            logger.debug(f"[Chunking] Skipping empty page {page_num} in {source_filename}")
            continue

        page_chunks = split_text_into_chunks(cleaned, chunk_size, overlap)

        for local_idx, chunk_text in enumerate(page_chunks):
            metadata = {
                "doc_type": doc_type,
                "source_filename": source_filename,
                "page_number": page_num,
                "local_chunk_index": local_idx,
                "application_id": application_id,
                "tender_id": tender_id,
            }

            all_chunks.append({
                "document_id": document_id,
                "application_id": application_id,
                "tender_id": tender_id,
                "bidder_id": bidder_id,
                "chunk_text": chunk_text,
                "page_number": page_num,
                "chunk_index": global_chunk_index,
                "source_filename": source_filename,
                "doc_type": doc_type,
                "chunk_metadata": json.dumps(metadata),
            })
            global_chunk_index += 1

    logger.info(f"[Chunking] {source_filename}: {len(pages_data)} pages → {len(all_chunks)} chunks")
    return all_chunks


def chunk_full_text(
    full_text: str,
    document_id: int,
    application_id: Optional[int] = None,
    tender_id: Optional[int] = None,
    bidder_id: Optional[int] = None,
    source_filename: str = "",
    doc_type: str = "",
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_OVERLAP,
) -> List[Dict[str, Any]]:
    """
    Chunk a full text string (without page info) into embedding-ready records.
    Used when page-level data is unavailable.
    """
    cleaned = clean_text(full_text)
    text_chunks = split_text_into_chunks(cleaned, chunk_size, overlap)

    result = []
    for idx, chunk_text in enumerate(text_chunks):
        metadata = {
            "doc_type": doc_type,
            "source_filename": source_filename,
            "chunk_index": idx,
            "application_id": application_id,
            "tender_id": tender_id,
        }
        result.append({
            "document_id": document_id,
            "application_id": application_id,
            "tender_id": tender_id,
            "bidder_id": bidder_id,
            "chunk_text": chunk_text,
            "page_number": 1,
            "chunk_index": idx,
            "source_filename": source_filename,
            "doc_type": doc_type,
            "chunk_metadata": json.dumps(metadata),
        })
    return result
