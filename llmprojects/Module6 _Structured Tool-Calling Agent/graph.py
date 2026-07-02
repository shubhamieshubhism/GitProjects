# # # # from langgraph.graph import StateGraph, START, END
# # # # from state import State
# # # # from nodes import llm_node

# # # # graph = StateGraph(State)
# # # # graph.add_node("llm", llm_node)
# # # # graph.add_edge(START, "llm")
# # # # graph.add_edge("llm", END)
# # # # app = graph.compile()

# # # from langgraph.graph import StateGraph, START, END
# # # from state import State
# # # from nodes import llm_node, tool_node, router

# # # graph = StateGraph(State)

# # # graph.add_node("llm", llm_node)
# # # graph.add_node("tool", tool_node)

# # # graph.add_edge(START, "llm")
# # # graph.add_conditional_edges("llm", router, {
# # #     "call_tool": "tool",
# # #     "end": END
# # # })
# # # graph.add_edge("tool", END)

# # # app = graph.compile()

# # from langgraph.graph import StateGraph, START, END
# # from state import State
# # from nodes import llm_node, tool_node, router

# # graph = StateGraph(State)

# # graph.add_node("llm", llm_node)
# # graph.add_node("tool", tool_node)

# # graph.add_edge(START, "llm")
# # graph.add_conditional_edges("llm", router, {
# #     "call_tool": "tool",
# #     "end": END
# # })
# # # AFTER TOOL, GO BACK TO LLM (LOOP)
# # graph.add_edge("tool", "llm")   # <--- CHANGE THIS

# # app = graph.compile()

# from langgraph.graph import StateGraph, START, END
# from state import State
# from nodes import llm_node, tool_node, router

# # Build the graph
# graph = StateGraph(State)

# # Add nodes
# graph.add_node("llm", llm_node)
# graph.add_node("tool", tool_node)

# # Edges
# graph.add_edge(START, "llm")
# graph.add_conditional_edges("llm", router, {
#     "call_tool": "tool",
#     "end": END
# })
# # After tool, always go back to LLM (to process tool result)
# graph.add_edge("tool", "llm")a

# # Compile
# app = graph.compile()

from langgraph.graph import StateGraph, START, END
from state import State
from nodes import llm_node, tool_node, router

graph = StateGraph(State)

graph.add_node("llm", llm_node)
graph.add_node("tool", tool_node)

graph.add_edge(START, "llm")
graph.add_conditional_edges("llm", router, {
    "call_tool": "tool",
    "end": END
})
graph.add_edge("tool", "llm")  # after tool, go back to llm

app = graph.compile()