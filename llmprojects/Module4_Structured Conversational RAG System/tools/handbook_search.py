from langchain.tools.retriever import create_retriever_tool
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from utils.config import get_embeddings

# Global vectorstore (same as before)
_vectorstore = None

def get_vectorstore():
    global _vectorstore
    if _vectorstore is None:
        loader = TextLoader("data/handbook.txt")
        docs = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
        chunks = splitter.split_documents(docs)
        embeddings = get_embeddings()
        _vectorstore = Chroma.from_documents(chunks, embeddings)
    return _vectorstore

retriever = get_vectorstore().as_retriever(search_kwargs={"k": 2})

handbook_tool = create_retriever_tool(
    retriever=retriever,
    name="handbook_search",
    description="Search the company handbook for policies on vacation, VPN, expenses, etc. Use this for internal company questions."
)