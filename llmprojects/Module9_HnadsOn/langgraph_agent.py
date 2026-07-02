# from langgraph.graph import StateGraph, END
# from langgraph.prebuilt import ToolExecutor
# from langchain_ollama import ChatOllama
# from langchain_core.messages import HumanMessage, AIMessage
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from mcp_tools import add_todo, list_todos, delete_todo
# from typing import TypedDict, List, Union

# # Define state
# class AgentState(TypedDict):
#     messages: List[Union[HumanMessage, AIMessage]]

# tools = [add_todo, list_todos, delete_todo]
# tool_executor = ToolExecutor(tools)
# llm = ChatOllama(model="llama3.1", temperature=0).bind_tools(tools)

# # Prompt with chat history
# prompt = ChatPromptTemplate.from_messages([
#     ("system", "You are a helpful TODO manager assistant. Use the available tools to manage tasks."),
#     MessagesPlaceholder(variable_name="chat_history"),
#     ("human", "{input}"),
#     MessagesPlaceholder(variable_name="agent_scratchpad")
# ])

# def should_continue(state: AgentState) -> str:
#     last_message = state["messages"][-1]
#     if hasattr(last_message, "tool_calls") and last_message.tool_calls:
#         return "action"
#     else:
#         return "end"

# def call_model(state: AgentState):
#     messages = state["messages"]
#     # The agent_scratchpad is empty for now; we can build it
#     response = llm.invoke(prompt.format_messages(chat_history=messages[:-1], input=messages[-1].content, agent_scratchpad=[]))
#     return {"messages": [response]}

# def call_tool(state: AgentState):
#     last_message = state["messages"][-1]
#     tool_calls = last_message.tool_calls
#     results = []
#     for tc in tool_calls:
#         result = tool_executor.invoke(tc)
#         results.append(result)
#     return {"messages": results}

# # Build graph
# workflow = StateGraph(AgentState)
# workflow.add_node("agent", call_model)
# workflow.add_node("action", call_tool)
# workflow.set_entry_point("agent")
# workflow.add_conditional_edges("agent", should_continue, {"action": "action", "end": END})
# workflow.add_edge("action", "agent")
# app = workflow.compile()

from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from Module9_HnadsOn.langgraph_agent.mcp_tools import add_todo, list_todos, delete_todo
from typing import TypedDict, List, Union

# Define state
class AgentState(TypedDict):
    messages: List[Union[HumanMessage, AIMessage]]

tools = [add_todo, list_todos, delete_todo]
# Use ToolNode (replaces ToolExecutor)
tool_node = ToolNode(tools)

llm = ChatOllama(model="llama3.1", temperature=0).bind_tools(tools)

# Prompt with chat history
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful TODO manager assistant. Use the available tools to manage tasks."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])

def call_model(state: AgentState):
    messages = state["messages"]
    # Build chat history and current input
    chat_history = messages[:-1]
    current_input = messages[-1].content
    response = llm.invoke(
        prompt.format_messages(
            chat_history=chat_history,
            input=current_input,
            agent_scratchpad=[]
        )
    )
    return {"messages": [response]}

# Build graph
workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", tools_condition)
workflow.add_edge("tools", "agent")
app = workflow.compile()