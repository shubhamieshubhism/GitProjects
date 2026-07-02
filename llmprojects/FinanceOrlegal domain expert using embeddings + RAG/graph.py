# from langgraph.graph import StateGraph, START, END
# from state import State
# from nodes import llm_node

# graph = StateGraph(State)
# graph.add_node("llm", llm_node)
# graph.add_edge(START, "llm")
# graph.add_edge("llm", END)
# app = graph.compile()

"""modify – add tool node and conditional edge"""
from langgraph.graph import StateGraph, START, END
from state import State
from nodes import llm_node, tool_node, router

graph = StateGraph(State)

# Add nodes
graph.add_node("llm", llm_node)
graph.add_node("tool", tool_node)

# Edges
graph.add_edge(START, "llm")
graph.add_conditional_edges("llm", router, {
    "call_tool": "tool",
    "end": END
})
# After tool execution, always go back to the LLM to produce final answer
graph.add_edge("tool", "llm")

# Compile
app = graph.compile()