# from state import State

# def planner_node(state: State) -> dict:
#     """Decide if retrieval is needed based on the last user message."""
#     last_message = state["messages"][-1]
#     query = last_message.content.lower()
#     # Simple keyword check – replace with LLM later
#     retrieval_keywords = ["policy", "handbook", "vacation", "vpn", "expense"]
#     need_retrieval = any(keyword in query for keyword in retrieval_keywords)
#     return {"need_retrieval": need_retrieval}

from state import State

def planner_node(state: State) -> dict:
    """Decide if retrieval is needed based on the last user message."""
    last_message = state["messages"][-1]
    query = last_message.content.lower()
    # Simple keyword matching – replace with LLM later
    retrieval_keywords = [
        "points", "gryffindor", "slytherin", "ravenclaw", "hufflepuff",
        "spell", "levitation", "wingardium", "hippogriff", "polyjuice",
        "chamber", "basilisk", "parseltongue"
    ]
    need_retrieval = any(keyword in query for keyword in retrieval_keywords)
    return {"need_retrieval": need_retrieval}