from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Embeddings
    embedding_model: str = "BAAI/bge-base-en-v1.5"
    chunk_size: int = 500
    chunk_overlap: int = 50
    retrieval_k: int = 3

    # Hybrid weights
    dense_weight: float = 0.5
    bm25_weight: float = 0.5

    # LLM
    ollama_model: str = "llama2:7b"
    ollama_base_url: str = "http://localhost:11434"
    openai_model: str = "gpt-3.5-turbo"
    openai_api_key: Optional[str] = None
    temperature: float = 0.0

    class Config:
        env_file = ".env"

settings = Settings()