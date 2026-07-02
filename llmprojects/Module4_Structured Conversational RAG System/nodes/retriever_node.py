from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from state import State

# Global vectorstore (created once)
_vectorstore = None

def get_vectorstore():
    global _vectorstore
    if _vectorstore is None:
        # Load and split the handbook
        loader = TextLoader("data/handbook.txt")
        docs = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
        chunks = splitter.split_documents(docs)
        # Create embeddings and vectorstore
        embeddings = OllamaEmbeddings(model="nomic-embed-text")
        _vectorstore = Chroma.from_documents(chunks, embeddings)
    return _vectorstore

def retriever_node(state: State) -> dict:
    """Retrieve relevant chunks based on the latest user message."""
    last_message = state["messages"][-1]
    query = last_message.content
    vectorstore = get_vectorstore()
    docs = vectorstore.similarity_search(query, k=2)
    
    print(f"\n[DEBUG] Query: {query}")
    print(f"[DEBUG] Retrieved {len(docs)} chunks:")
    for i, doc in enumerate(docs):
        print(f"  Chunk {i+1}: {doc.page_content[:100]}...")

    return {"context": docs}