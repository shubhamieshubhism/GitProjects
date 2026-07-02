from state import State

def web_retriever_node(state: State) -> dict:
    last_msg = state["messages"][-1]
    query = last_msg.content
    # Mock web search – in reality, call a search API
    mock_web_context = f"[MOCK WEB] Results for '{query}': Harry Potter is a series of fantasy novels by J.K. Rowling."
    print(f"\n[DEBUG] Web context:\n{mock_web_context}\n")
    return {"web_context": mock_web_context}