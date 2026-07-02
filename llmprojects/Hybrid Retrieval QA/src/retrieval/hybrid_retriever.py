from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever
from config.settings import settings
from src.ingestion.document_loader import load_and_split_documents

def build_hybrid_retriever(docs_path: str):
    chunks = load_and_split_documents(docs_path)

    # Dense retriever (FAISS + local embeddings)
    embeddings = HuggingFaceEmbeddings(model_name=settings.embedding_model)
    vectorstore = FAISS.from_documents(chunks, embeddings)
    dense_retriever = vectorstore.as_retriever(search_kwargs={"k": settings.retrieval_k})

    # BM25 retriever
    bm25_retriever = BM25Retriever.from_documents(chunks, k=settings.retrieval_k)

    # Ensemble
    ensemble = EnsembleRetriever(
        retrievers=[dense_retriever, bm25_retriever],
        weights=[settings.dense_weight, settings.bm25_weight]
    )
    return ensemble