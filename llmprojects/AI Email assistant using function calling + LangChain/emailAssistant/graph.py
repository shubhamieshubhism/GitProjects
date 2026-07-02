# from langgraph.graph import StateGraph, START, END
# from langchain_community.chat_models import ChatOllama
# from state import State

# # Initialize Ollama LLM (make sure Ollama is running)
# llm = ChatOllama(model="llama3", temperature=0)  # or "mistral", "phi3", etc.

# # Node function
# def call_llm(state: State) -> dict:
#     response = llm.invoke(state["messages"])
#     # Return updated messages list (old + new AI message)
#     return {"messages": state["messages"] + [response]}

# # Build graph
# graph = StateGraph(State)
# graph.add_node("call_llm", call_llm)
# graph.add_edge(START, "call_llm")
# graph.add_edge("call_llm", END)
# app = graph.compile()

# from langgraph.graph import StateGraph, START, END
# from state import State
# from nodes import call_llm_node, tool_node, router_node

# graph = StateGraph(State)

# # Add nodes
# graph.add_node("call_llm", call_llm_node)
# graph.add_node("tool_node", tool_node)

# # Add edges
# graph.add_edge(START, "call_llm")

# # Conditional edge: after call_llm, decide next
# graph.add_conditional_edges(
#     "call_llm",
#     router_node,
#     {
#         "tool_node": "tool_node",
#         END: END
#     }
# )

# # After tool_node, always go back to call_llm (so LLM can process tool result)
# graph.add_edge("tool_node", "call_llm")

# app = graph.compile()


from langgraph.graph import StateGraph, START, END
import sqlite3
import os
from langgraph.checkpoint.sqlite import SqliteSaver
from state import State
from nodes import call_llm_node, tool_node, router_node

# Create a SQLite checkpointer (persists to disk)
os.makedirs("checkpoints", exist_ok=True)
conn = sqlite3.connect("checkpoints/checkpoints.db", check_same_thread=False)
checkpointer = SqliteSaver(conn)

# Build graph
graph = StateGraph(State)

# Add nodes
graph.add_node("call_llm", call_llm_node)
graph.add_node("tool_node", tool_node)

# Add edges
graph.add_edge(START, "call_llm")

# Conditional edge
graph.add_conditional_edges(
    "call_llm",
    router_node,
    {
        "tool_node": "tool_node",
        END: END
    }
)

# After tool_node, back to call_llm
graph.add_edge("tool_node", "call_llm")

# Compile the graph WITH the checkpointer
app = graph.compile(checkpointer=checkpointer)