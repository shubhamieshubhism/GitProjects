# # # # # from langgraph.graph import StateGraph, START, END
# # # # # from state import State
# # # # # from nodes import call_llm_node

# # # # # graph = StateGraph(State)
# # # # # graph.add_node("call_llm", call_llm_node)
# # # # # graph.add_edge(START, "call_llm")
# # # # # graph.add_edge("call_llm", END)
# # # # # app = graph.compile()


# # # # from langgraph.graph import StateGraph, START, END
# # # # from state import State
# # # # from nodes import call_llm_node, mock_tool_node, router

# # # # graph = StateGraph(State)
# # # # graph.add_node("call_llm", call_llm_node)
# # # # graph.add_node("mock_tool", mock_tool_node)

# # # # graph.add_edge(START, "call_llm")
# # # # # Conditional edge: after call_llm, use router to decide next node
# # # # graph.add_conditional_edges("call_llm", router, {
# # # #     "mock_tool": "mock_tool",
# # # #     "end": END
# # # # })
# # # # graph.add_edge("mock_tool", END)

# # # # app = graph.compile()

# # # from langgraph.graph import StateGraph, START, END
# # # from langgraph.checkpoint.sqlite import SqliteSaver
# # # from state import State
# # # from nodes import call_llm_node, mock_tool_node, router

# # # # Create SQLite checkpointer
# # # checkpointer = SqliteSaver.from_conn_string("checkpoints.db")

# # # graph = StateGraph(State)
# # # graph.add_node("call_llm", call_llm_node)
# # # graph.add_node("mock_tool", mock_tool_node)

# # # graph.add_edge(START, "call_llm")
# # # graph.add_conditional_edges("call_llm", router, {
# # #     "mock_tool": "mock_tool",
# # #     "end": END
# # # })
# # # graph.add_edge("mock_tool", END)

# # # # Compile with checkpointer
# # # app = graph.compile(checkpointer=checkpointer)

# # from langgraph.graph import StateGraph, START, END
# # from langgraph.checkpoint.memory import MemorySaver  # use MemorySaver instead of SqliteSaver
# # from state import State
# # from nodes import call_llm_node, mock_tool_node, router

# # checkpointer = MemorySaver()  # no disk persistence, but works reliably

# # graph = StateGraph(State)
# # graph.add_node("call_llm", call_llm_node)
# # graph.add_node("mock_tool", mock_tool_node)
# # graph.add_edge(START, "call_llm")
# # graph.add_conditional_edges("call_llm", router, {
# #     "mock_tool": "mock_tool",
# #     "end": END
# # })
# # graph.add_edge("mock_tool", END)

# # app = graph.compile(checkpointer=checkpointer)

# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.memory import MemorySaver
# from state import State
# from nodes import call_llm_node, mock_tool_node, fallback_node, router

# checkpointer = MemorySaver()
# graph = StateGraph(State)

# graph.add_node("call_llm", call_llm_node)
# graph.add_node("mock_tool", mock_tool_node)
# graph.add_node("fallback", fallback_node)

# graph.add_edge(START, "call_llm")
# graph.add_conditional_edges("call_llm", router, {
#     "mock_tool": "mock_tool",
#     "fallback": "fallback",
#     "end": END
# })
# graph.add_edge("mock_tool", END)
# graph.add_edge("fallback", END)

# app = graph.compile(checkpointer=checkpointer)

# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.memory import MemorySaver
# from state import State
# from nodes import call_llm_node, mock_tool_node, fallback_node, approval_node, router

# checkpointer = MemorySaver()
# graph = StateGraph(State)

# graph.add_node("call_llm", call_llm_node)
# graph.add_node("approval", approval_node)
# graph.add_node("mock_tool", mock_tool_node)
# graph.add_node("fallback", fallback_node)

# graph.add_edge(START, "call_llm")
# graph.add_conditional_edges("call_llm", router, {
#     "await_approval": "approval",
#     "mock_tool": "mock_tool",
#     "fallback": "fallback",
#     "end": END
# })
# graph.add_conditional_edges("approval", router, {
#     "mock_tool": "mock_tool",
#     "end": END
# })
# graph.add_edge("mock_tool", END)
# graph.add_edge("fallback", END)

# app = graph.compile(checkpointer=checkpointer)

# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.memory import MemorySaver
# from state import State
# from nodes import call_llm_node, mock_tool_node, fallback_node, approval_node, router

# checkpointer = MemorySaver()
# graph = StateGraph(State)

# graph.add_node("call_llm", call_llm_node)
# graph.add_node("approval", approval_node)          # approval node
# graph.add_node("mock_tool", mock_tool_node)
# graph.add_node("fallback", fallback_node)

# graph.add_edge(START, "call_llm")

# # Conditional edge from call_llm
# graph.add_conditional_edges(
#     "call_llm",
#     router,
#     {
#         "await_approval": "approval",
#         "mock_tool": "mock_tool",
#         "fallback": "fallback",
#         "end": END
#     }
# )

# # Conditional edge from approval node
# graph.add_conditional_edges(
#     "approval",
#     router,
#     {
#         "mock_tool": "mock_tool",
#         "end": END
#     }
# )

# graph.add_edge("mock_tool", END)
# graph.add_edge("fallback", END)

# app = graph.compile(checkpointer=checkpointer)

# from langgraph.graph import StateGraph, START, END
# from langgraph.checkpoint.memory import MemorySaver
# from state import State
# from nodes import call_llm_node, mock_tool_node, fallback_node, approval_node, router

# checkpointer = MemorySaver()
# graph = StateGraph(State)

# graph.add_node("call_llm", call_llm_node)
# graph.add_node("approval", approval_node)
# graph.add_node("mock_tool", mock_tool_node)
# graph.add_node("fallback", fallback_node)

# graph.add_edge(START, "call_llm")

# # FORCE go to approval node (comment out conditional edge for now)
# graph.add_edge("call_llm", "approval")
# # graph.add_conditional_edges("call_llm", router, {...})   # TEMPORARILY DISABLED

# graph.add_conditional_edges(
#     "approval",
#     router,
#     {
#         "mock_tool": "mock_tool",
#         "end": END
#     }
# )

# graph.add_edge("mock_tool", END)
# graph.add_edge("fallback", END)

# app = graph.compile(checkpointer=checkpointer)

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from state import State
from nodes import approval_node, call_llm_node, reject_node, fallback_node

checkpointer = MemorySaver()
graph = StateGraph(State)

graph.add_node("approval", approval_node)
graph.add_node("call_llm", call_llm_node)
graph.add_node("reject", reject_node)
graph.add_node("fallback", fallback_node)  # optional

graph.add_edge(START, "approval")
graph.add_conditional_edges(
    "approval",
    lambda state: "call_llm" if state.get("approved") else "reject",
    {
        "call_llm": "call_llm",
        "reject": "reject"
    }
)
graph.add_edge("call_llm", END)
graph.add_edge("reject", END)

app = graph.compile(checkpointer=checkpointer)