"""
embedding_service.py
--------------------
Reusable embedding generation service for BharatTender Shield RAG pipeline.

Uses Google Gemini text-embedding-004 (768 dimensions).
Falls back to a deterministic hash-based pseudo-embedding if API is unavailable.
Model is configurable via GEMINI_EMBEDDING_MODEL environment variable.
"""
import json
import hashlib
import logging
from typing import List, Optional
from app.config import settings

logger = logging.getLogger("uvicorn.error")


def generate_embedding(text: str) -> List[float]:
    """
    Generate a 768-dimensional embedding vector for the given text.
    
    Primary: Gemini text-embedding-004 via google.generativeai SDK.
    Fallback: Deterministic pseudo-embedding (hash-based, no API required).
    
    Returns a list of 768 floats.
    """
    if not text or not text.strip():
        return _zero_embedding()

    # Truncate to safe limit for embedding API (8192 tokens ≈ ~32000 chars)
    text_truncated = text[:32000].strip()

    if settings.GEMINI_API_KEY:
        try:
            return _gemini_embedding(text_truncated)
        except Exception as e:
            logger.warning(f"[EmbeddingService] Gemini embedding failed, using fallback: {e}")

    return _deterministic_embedding(text_truncated)


def _gemini_embedding(text: str) -> List[float]:
    """Call Gemini embedding API."""
    import google.generativeai as genai
    genai.configure(api_key=settings.GEMINI_API_KEY)
    result = genai.embed_content(
        model=settings.GEMINI_EMBEDDING_MODEL,
        content=text,
        task_type="RETRIEVAL_DOCUMENT"
    )
    embedding = result["embedding"]
    if not isinstance(embedding, list):
        embedding = list(embedding)
    return embedding


def _deterministic_embedding(text: str) -> List[float]:
    """
    Deterministic pseudo-embedding for offline/fallback mode.
    Produces a reproducible 768-dim vector based on text content.
    Not semantically meaningful but consistent for same inputs.
    """
    import numpy as np

    dim = settings.EMBEDDING_DIM  # 768
    seed_bytes = hashlib.sha256(text.encode("utf-8")).digest()
    # Use sha256 bytes as seed for reproducible random state
    rng = np.random.RandomState(list(seed_bytes[:4]))
    vec = rng.randn(dim).astype(float)
    # Normalize to unit vector
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.tolist()


def _zero_embedding() -> List[float]:
    """Return a zero vector for empty text."""
    return [0.0] * settings.EMBEDDING_DIM


def embedding_to_json(embedding: List[float]) -> str:
    """Serialize embedding to JSON string for storage."""
    return json.dumps(embedding)


def json_to_embedding(json_str: str) -> Optional[List[float]]:
    """Deserialize embedding from JSON string."""
    if not json_str:
        return None
    try:
        return json.loads(json_str)
    except Exception:
        return None


def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """
    Compute cosine similarity between two vectors.
    Used for SQLite fallback similarity search.
    """
    try:
        import numpy as np
        a = np.array(vec_a, dtype=float)
        b = np.array(vec_b, dtype=float)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))
    except Exception:
        return 0.0
