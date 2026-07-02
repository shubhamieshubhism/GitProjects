# # from state import State
# # from langchain_core.messages import AIMessage

# # def retriever_node(state: State) -> dict:
# #     """Mock retrieval – returns a fake context."""
# #     last_message = state["messages"][-1]
# #     query = last_message.content
# #     mock_context = f"[MOCK RETRIEVAL] Relevant information for '{query}':\nEmployees get 20 days of paid leave per year. Unused days roll over up to 30 days."
# #     return {"context": mock_context}

# from langchain_community.document_loaders import TextLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_chroma import Chroma
# from state import State
# from utils.embeddings import get_embeddings

# # Global vectorstore (loaded once)
# _vectorstore = None

# def get_vectorstore():
#     global _vectorstore
#     if _vectorstore is None:
#         loader = TextLoader("data/handbook.txt")
#         docs = loader.load()
#         splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
#         chunks = splitter.split_documents(docs)
#         embeddings = get_embeddings()
#         _vectorstore = Chroma.from_documents(chunks, embeddings)
#     return _vectorstore

# def retriever_node(state: State) -> dict:
#     """Retrieve relevant chunks based on the last user message."""
#     last_msg = state["messages"][-1]
#     query = last_msg.content
#     vectorstore = get_vectorstore()
#     docs = vectorstore.similarity_search(query, k=2)
#     context = "\n\n".join([doc.page_content for doc in docs])
#     return {"context": context}

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from state import State
from utils.embeddings import get_embeddings

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

def handbook_retriever_node(state: State) -> dict:
    last_msg = state["messages"][-1]
    query = last_msg.content
    vectorstore = get_vectorstore()
    docs = vectorstore.similarity_search(query, k=2)
    context = "\n\n".join([doc.page_content for doc in docs])
    print(f"\n[DEBUG] Handbook context:\n{context}\n")
    return {"handbook_context": context}