# from langchain_core.messages import AIMessage
# from state import State

# def fallback_node(state: State) -> dict:
#     error_msg = state.get("error_message", "Unknown error")
#     safe_reply = AIMessage(content=f"⚠️ I'm having trouble right now. Error: {error_msg}. Please try again later.")
#     return {"messages": state["messages"] + [safe_reply]}

from langchain_core.messages import AIMessage
from state import State

def fallback_node(state: State) -> dict:
    error_msg = state.get("error_message", "Unknown error")
    safe_reply = AIMessage(content=f"⚠️ I'm having trouble right now. Error: {error_msg}. Please try again later.")
    return {"messages": state["messages"] + [safe_reply]}