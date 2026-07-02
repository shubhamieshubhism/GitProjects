# from state import State
# from tools import get_retriever

# def retriever_node(state: State) -> dict:
#     retriever = get_retriever()
#     query = state["messages"][-1].content
#     docs = retriever.invoke(query)
#     retrieved_docs = [doc.page_content for doc in docs]
#     return {"retrieved_docs": retrieved_docs}

from state import State
from tools import get_retriever

def retriever_node(state: State) -> dict:
    print("\n[DEBUG] retriever_node called")
    retriever = get_retriever()
    query = state["messages"][-1].content
    print(f"[DEBUG] Query: {query}")
    docs = retriever.invoke(query)
    print(f"[DEBUG] Retrieved {len(docs)} docs")
    retrieved_docs = [doc.page_content for doc in docs]
    for i, doc in enumerate(retrieved_docs):
        print(f"[DEBUG] Doc {i}: {doc[:150]}...")
    return {"retrieved_docs": retrieved_docs}