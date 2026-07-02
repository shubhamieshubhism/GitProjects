# from langgraph.graph import StateGraph, START, END
# from state import State
# from nodes import call_llm_node

# # Create the graph
# graph = StateGraph(State)

# # Add the node
# graph.add_node("call_llm", call_llm_node)

# # Add edges: START -> call_llm -> END
# graph.add_edge(START, "call_llm")
# graph.add_edge("call_llm", END)

# # Compile into a runnable app
# app = graph.compile()

# from langgraph.graph import StateGraph, START, END
# from state import State
# from nodes import retriever_node, call_llm_node

# graph = StateGraph(State)
# graph.add_node("retriever", retriever_node)
# graph.add_node("call_llm", call_llm_node)
# graph.add_edge(START, "retriever")
# graph.add_edge("retriever", "call_llm")
# graph.add_edge("call_llm", END)
# app = graph.compile()

# from langgraph.graph import StateGraph, START, END
# from state import State
# from nodes import agent_node, tools_node, router_node

# graph = StateGraph(State)
# graph.add_node("agent", agent_node)
# graph.add_node("tools", tools_node)

# graph.add_edge(START, "agent")
# graph.add_conditional_edges("agent", router_node, {
#     "tools_node": "tools",
#     END: END
# })
# graph.add_edge("tools", "agent")  # after tool, go back to agent

# app = graph.compile()

# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.sqlite import SqliteSaver
# from state import State
# from nodes import agent_node, tools_node, router_node

# # Create SQLite checkpointer (persists to disk)
# checkpointer = SqliteSaver.from_conn_string("checkpoints.db")

# graph = StateGraph(State)
# graph.add_node("agent", agent_node)
# graph.add_node("tools", tools_node)
# graph.add_edge(START, "agent")
# graph.add_conditional_edges("agent", router_node, {
#     "tools_node": "tools",
#     END: END
# })
# graph.add_edge("tools", "agent")

# # Compile with checkpointer
# app = graph.compile(checkpointer=checkpointer)

# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.memory import MemorySaver  # instead of SqliteSaver
# from state import State
# from nodes import agent_node, tools_node, router_node

# # In‑memory checkpointer (no disk persistence, but no errors)
# checkpointer = MemorySaver()

# graph = StateGraph(State)
# graph.add_node("agent", agent_node)
# graph.add_node("tools", tools_node)
# graph.add_edge(START, "agent")
# graph.add_conditional_edges("agent", router_node, {
#     "tools_node": "tools",
#     END: END
# })
# graph.add_edge("tools", "agent")

# app = graph.compile(checkpointer=checkpointer)

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from state import State
from nodes import agent_node, tools_node, router_node

checkpointer = MemorySaver()
graph = StateGraph(State)
graph.add_node("agent", agent_node)
graph.add_node("tools", tools_node)
graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", router_node, {"tools_node": "tools", END: END})
graph.add_edge("tools", "agent")
app = graph.compile(checkpointer=checkpointer)