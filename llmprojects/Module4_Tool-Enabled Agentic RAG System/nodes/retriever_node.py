from state import State
from tools import handbook_tool

def retriever_node(state: State) -> dict:
    """Run the handbook search tool based on the last user message."""
    last_message = state["messages"][-1]
    query = last_message.content
    result = handbook_tool.invoke(query)
    return {"context": result}