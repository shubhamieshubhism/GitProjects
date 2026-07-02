# # from langgraph.graph import StateGraph, START, END
# # from state import State
# # from nodes import llm_node

# # graph = StateGraph(State)
# # graph.add_node("llm", llm_node)
# # graph.add_edge(START, "llm")
# # graph.add_edge("llm", END)
# # app = graph.compile()

# from langgraph.graph import StateGraph, START, END
# from state import State
# from nodes import llm_node, tool_node, router

# graph = StateGraph(State)
# graph.add_node("llm", llm_node)
# graph.add_node("tool", tool_node)

# graph.add_edge(START, "llm")
# graph.add_conditional_edges("llm", router, {
#     "call_tool": "tool",
#     "end": END
# })
# graph.add_edge("tool", "llm")   # after tool, go back to LLM to produce final answer

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
graph.add_edge("tool", "llm")

app = graph.compile()