from langchain_ollama import OllamaEmbeddings

# def get_embeddings():
#     return OllamaEmbeddings(model="nomic-embed-text")

from langchain.embeddings import CacheBackedEmbeddings
from langchain.storage import LocalFileStore

def get_embeddings():
    core_embeddings = OllamaEmbeddings(model="nomic-embed-text")
    fs = LocalFileStore("./embedding_cache")
    cached_embedder = CacheBackedEmbeddings.from_bytes_store(
        core_embeddings, fs, namespace="nomic"
    )
    return cached_embedder