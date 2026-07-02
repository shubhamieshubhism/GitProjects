import os

from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from config.settings import settings

try:
    from langchain.document_loaders import PyPDFLoader
except ImportError:  # pragma: no cover
    PyPDFLoader = None


def _split_documents(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap
    )
    return splitter.split_documents(docs)


def load_pdf_and_split_documents(file_path: str):
    if PyPDFLoader is None:
        raise ImportError(
            "PyPDFLoader is not installed. Install a PDF loader dependency such as `pypdf` and retry."
        )
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    return _split_documents(docs)


def load_and_split_documents(file_path: str):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".txt":
        loader = TextLoader(file_path)
        docs = loader.load()
        return _split_documents(docs)
    if ext == ".pdf":
        return load_pdf_and_split_documents(file_path)
    raise ValueError(
        f"Unsupported file type '{ext}'. Supported extensions: .txt, .pdf"
    )