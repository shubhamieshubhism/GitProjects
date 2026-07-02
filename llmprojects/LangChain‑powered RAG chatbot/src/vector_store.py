# src/vector_store.py (updated full version)
import os
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_chroma import Chroma
from .config import MODEL_NAME
# src/vector_store.py (updated section)
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_community.document_loaders import TextLoader
import json
import shutil
from glob import glob

def get_data_file_list(data_path="data"):
    patterns = ["**/*.txt", "**/*.pdf"]
    files = []
    for pattern in patterns:
        files.extend(glob(os.path.join(data_path, pattern), recursive=True))
    return sorted(os.path.normpath(path) for path in files)


def read_source_metadata(persist_directory):
    metadata_path = os.path.join(persist_directory, "source_files.json")
    if not os.path.exists(metadata_path):
        return None
    with open(metadata_path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_source_metadata(persist_directory, file_list):
    os.makedirs(persist_directory, exist_ok=True)
    metadata_path = os.path.join(persist_directory, "source_files.json")
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(file_list, f, indent=2)


def load_and_split_documents(data_path="data"):
    """Load documents from a folder (supports .txt and .pdf)."""
    # For .txt files
    txt_loader = DirectoryLoader(
        data_path, 
        glob="**/*.txt", 
        loader_cls=TextLoader
    )
    txt_docs = txt_loader.load()
    
    # For .pdf files
    pdf_loader = DirectoryLoader(
        data_path,
        glob="**/*.pdf",
        loader_cls=PyPDFLoader
    )
    pdf_docs = pdf_loader.load()
    
    # Combine
    documents = txt_docs + pdf_docs
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = text_splitter.split_documents(documents)
    return chunks

# def load_and_split_documents(data_path="data"):
#     """Load documents from a folder and split them into chunks."""
#     loader = DirectoryLoader(data_path, glob="**/*.txt")
#     documents = loader.load()
#     text_splitter = RecursiveCharacterTextSplitter(
#         chunk_size=500,
#         chunk_overlap=50
#     )
#     chunks = text_splitter.split_documents(documents)
#     return chunks

def create_vector_store(chunks, persist_directory="./chroma_db"):
    """Create a Chroma vector store from document chunks."""
    embeddings = OllamaEmbeddings(model=MODEL_NAME)
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_directory
    )
    return vectorstore

def get_or_create_vector_store(data_path="data", persist_directory="./chroma_db"):
    """Load existing vector store from disk if it exists, otherwise create it."""
    embeddings = OllamaEmbeddings(model=MODEL_NAME)
    data_files = get_data_file_list(data_path)
    saved_files = read_source_metadata(persist_directory)

    if os.path.exists(persist_directory) and os.listdir(persist_directory) and saved_files == data_files:
        print(f"Loading existing vector store from {persist_directory}...")
        return Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings
        )

    if os.path.exists(persist_directory) and os.listdir(persist_directory):
        print("Source documents changed, rebuilding vector store...")
        shutil.rmtree(persist_directory)

    print("Creating new vector store (this may take a moment)...")
    chunks = load_and_split_documents(data_path)
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_directory
    )
    write_source_metadata(persist_directory, data_files)
    return vectorstore

"""if __name__ == "__main__":
    chunks = load_and_split_documents()
    print(f"Number of chunks: {len(chunks)}")
    for i, chunk in enumerate(chunks[:3]):
        print(f"\n--- Chunk {i+1} ---")
        print(chunk.page_content)"""
        
if __name__ == "__main__":
    # Load and split
    chunks = load_and_split_documents()
    print(f"Loaded {len(chunks)} chunks")
    
    # Create vector store
    vectorstore = create_vector_store(chunks)
    print(f"Vector store created at ./chroma_db")
    
    # Optional: test a similarity search
    results = vectorstore.similarity_search("What is RAG?", k=2)
    for i, doc in enumerate(results):
        print(f"\nResult {i+1}:\n{doc.page_content}")