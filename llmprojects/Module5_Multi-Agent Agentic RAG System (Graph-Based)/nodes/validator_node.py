from state import State

def validator_node(state: State) -> dict:
    """Check if the last answer is grounded in the context (if retrieval was used)."""
    last_message = state["messages"][-1]
    answer = last_message.content
    context = state.get("context", "")
    
    # Simple validation: if retrieval was used, answer must contain a keyword from context
    if state.get("need_retrieval") and context:
        # Extract first few words of context as a rough check
        context_words = set(context.lower().split()[:10])
        answer_words = set(answer.lower().split())
        if not context_words.intersection(answer_words):
            return {"validation_status": "failed"}
    return {"validation_status": "passed"}