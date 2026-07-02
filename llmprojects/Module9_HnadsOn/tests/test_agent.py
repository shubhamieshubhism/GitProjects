from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from Module9_HnadsOn.langgraph_agent.tools_simple import add_todo_tool, list_todos_tool, delete_todo_tool
from typing import TypedDict, List, Union

class AgentState(TypedDict):
    messages: List[Union[HumanMessage, AIMessage]]

tools = [add_todo_tool, list_todos_tool, delete_todo_tool]
tool_node = ToolNode(tools)

llm = ChatOllama(model="llama3.1", temperature=0).bind_tools(tools)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful TODO manager. Use the tools to manage tasks."),
    ("human", "{input}"),
])

def call_model(state: AgentState):
    messages = state["messages"]
    current_input = messages[-1].content
    print(f"[DEBUG] Sending prompt: {prompt.format_messages(input=current_input)}")
    response = llm.invoke(prompt.format_messages(input=current_input))
    print(f"[DEBUG] LLM response: {response}")
    print(f"[DEBUG] Tool calls: {response.tool_calls}")
    return {"messages": [response]}

workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", tools_condition)
workflow.add_edge("tools", "agent")
app = workflow.compile()

# Simple test
state = {"messages": [HumanMessage(content="Add a task: Buy milk")]}
result = app.invoke(state)
print("Final answer:", result["messages"][-1].content)