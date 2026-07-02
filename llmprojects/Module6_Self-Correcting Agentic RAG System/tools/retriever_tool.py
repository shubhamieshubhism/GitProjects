from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.tools import tool

# Global vectorstore (loaded once)
_vectorstore = None

def load_vectorstore():
    global _vectorstore
    if _vectorstore is None:
        loader = TextLoader("data/handbook.txt")
        docs = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
        chunks = splitter.split_documents(docs)
        embeddings = OllamaEmbeddings(model="nomic-embed-text")
        _vectorstore = Chroma.from_documents(chunks, embeddings)
    return _vectorstore

@tool
def get_handbook_info(query: str) -> str:
    """Search the company handbook for policies (vacation, VPN, etc.)."""
    vectorstore = load_vectorstore()
    docs = vectorstore.similarity_search(query, k=2)
    if not docs:
        return "No relevant information found."
    return "\n\n".join([doc.page_content for doc in docs])