# from langchain_core.messages import AIMessage
# from state import State

# def mock_tool_node(state: State) -> dict:
#     """Simulate a tool call – returns a message that the tool was executed."""
#     tool_message = AIMessage(content="[Mock Tool] I would search for that, but this is a simulation.")
#     return {"messages": state["messages"] + [tool_message]}

# from langchain_core.messages import AIMessage
# from state import State

# def mock_tool_node(state: State) -> dict:
#     if not state.get("approved", False):
#         tool_message = AIMessage(content="[Tool not executed because user did not approve.]")
#     else:
#         tool_message = AIMessage(content="[Mock Tool] Searching... (simulated)")
#     return {"messages": state["messages"] + [tool_message]}

from langchain_core.messages import AIMessage
from state import State

def mock_tool_node(state: State) -> dict:
    if not state.get("approved", False):
        tool_message = AIMessage(content="[Tool not executed because user did not approve.]")
    else:
        tool_message = AIMessage(content="[Mock Tool] Searching... (simulated)")
    return {"messages": state["messages"] + [tool_message]}