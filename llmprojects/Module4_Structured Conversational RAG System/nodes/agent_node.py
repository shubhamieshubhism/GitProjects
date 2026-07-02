from langchain_core.messages import AIMessage
from state import State
from utils.config import get_llm
from tools import web_search, handbook_tool

llm = get_llm()
# Bind both tools
llm_with_tools = llm.bind_tools([handbook_tool, web_search])

def agent_node(state: State) -> dict:
    conversation = state["messages"]
    # Invoke the LLM with the conversation
    response = llm_with_tools.invoke(conversation)
    # Check if the response contains tool calls
    if hasattr(response, "tool_calls") and response.tool_calls:
        # We need to store the tool calls in state
        return {
            "messages": [response],
            "next_action": "call_tool",
            "tool_calls": response.tool_calls
        }
    else:
        return {
            "messages": [response],
            "next_action": "end",
            "final_answer": response.content
        }