from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

_vectorstore = None

def get_retriever():
    global _vectorstore
    if _vectorstore is None:
        loader = TextLoader("data/knowledge_base.txt")
        docs = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
        chunks = splitter.split_documents(docs)
        embeddings = OllamaEmbeddings(model="nomic-embed-text")
        _vectorstore = Chroma.from_documents(chunks, embeddings)
    return _vectorstore.as_retriever(search_kwargs={"k": 2})