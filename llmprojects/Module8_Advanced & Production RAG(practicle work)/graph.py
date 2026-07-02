# # # from langgraph.graph import StateGraph, START, END
# # # from state import State
# # # from nodes import call_llm_node

# # # graph = StateGraph(State)
# # # graph.add_node("call_llm", call_llm_node)
# # # graph.add_edge(START, "call_llm")
# # # graph.add_edge("call_llm", END)
# # # app = graph.compile()

# # from langgraph.graph import StateGraph, START, END
# # from state import State
# # from nodes import retriever_node, call_llm_node, reranker_node

# # graph = StateGraph(State)
# # # graph.add_node("retriever", retriever_node)
# # # graph.add_node("call_llm", call_llm_node)
# # # graph.add_edge(START, "retriever")
# # # graph.add_edge("retriever", "call_llm")
# # # graph.add_edge("call_llm", END)
# # # app = graph.compile()

# # # After adding retriever node, add reranker node
# # graph.add_node("retriever", retriever_node)
# # graph.add_node("reranker", reranker_node)   # NEW
# # graph.add_node("call_llm", call_llm_node)

# # # Edges: START -> retriever -> reranker -> call_llm -> END
# # graph.add_edge(START, "retriever")
# # graph.add_edge("retriever", "reranker")
# # graph.add_edge("reranker", "call_llm")
# # graph.add_edge("call_llm", END)
# # app = graph.compile()


# from langgraph.graph import StateGraph, START, END
# from state import State
# from nodes import retriever_node, reranker_node, compressor_node, call_llm_node

# graph = StateGraph(State)

# graph.add_node("retriever", retriever_node)
# graph.add_node("reranker", reranker_node)
# graph.add_node("compressor", compressor_node)   # NEW
# graph.add_node("call_llm", call_llm_node)

# graph.add_edge(START, "retriever")
# graph.add_edge("retriever", "reranker")
# graph.add_edge("reranker", "compressor")
# graph.add_edge("compressor", "call_llm")
# graph.add_edge("call_llm", END)

# app = graph.compile()

from langgraph.graph import StateGraph, START, END
from state import State
from nodes import (
    retriever_node,
    reranker_node,
    compressor_node,
    call_llm_node,
    verifier_node
)

graph = StateGraph(State)

# Add all nodes
graph.add_node("retriever", retriever_node)
graph.add_node("reranker", reranker_node)
graph.add_node("compressor", compressor_node)
graph.add_node("call_llm", call_llm_node)
graph.add_node("verifier", verifier_node)

# Define edges
graph.add_edge(START, "retriever")
graph.add_edge("retriever", "reranker")
graph.add_edge("reranker", "compressor")
graph.add_edge("compressor", "call_llm")
graph.add_edge("call_llm", "verifier")
graph.add_edge("verifier", END)

# Compile the graph (no checkpointer for simplicity)
app = graph.compile()