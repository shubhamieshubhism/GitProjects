import pytest
from unittest.mock import Mock, patch
from src.retrieval.hybrid_retriever import build_hybrid_retriever
from src.ingestion.document_loader import load_and_split_documents

@pytest.fixture
def sample_docs_path(tmp_path):
    doc = tmp_path / "test.txt"
    doc.write_text("LangChain memory can be short-term or long-term.\nFAISS is a vector store.")
    return str(doc)

def test_load_and_split(sample_docs_path):
    chunks = load_and_split_documents(sample_docs_path)
    assert len(chunks) > 0
    assert chunks[0].page_content is not None

@patch("src.retrieval.hybrid_retriever.FAISS")
@patch("src.retrieval.hybrid_retriever.HuggingFaceEmbeddings")
def test_build_hybrid_retriever(mock_embeddings, mock_faiss, sample_docs_path):
    # Mock the FAISS.from_documents return value
    mock_vectorstore = Mock()
    mock_faiss.from_documents.return_value = mock_vectorstore
    mock_retriever = Mock()
    mock_vectorstore.as_retriever.return_value = mock_retriever

    retriever = build_hybrid_retriever(sample_docs_path)
    # The ensemble retriever is returned; we just check it's not None
    assert retriever is not None