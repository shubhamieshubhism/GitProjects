from langchain_core.messages import AIMessage
from state import State

def reject_node(state: State) -> dict:
    msg = AIMessage(content="Action not approved by user. Exiting.")
    return {"messages": state["messages"] + [msg]}