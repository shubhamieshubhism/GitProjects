# # # # # # # # # from langgraph.graph import StateGraph, START, END
# # # # # # # # # from state import State
# # # # # # # # # from nodes import call_llm_node

# # # # # # # # # graph = StateGraph(State)
# # # # # # # # # graph.add_node("call_llm", call_llm_node)
# # # # # # # # # graph.add_edge(START, "call_llm")
# # # # # # # # # graph.add_edge("call_llm", END)
# # # # # # # # # app = graph.compile()

# # # # # # # # from langgraph.graph import StateGraph, START, END
# # # # # # # # from state import State
# # # # # # # # from nodes import planner_node, retriever_node, llm_direct_node

# # # # # # # # graph = StateGraph(State)

# # # # # # # # graph.add_node("planner", planner_node)
# # # # # # # # graph.add_node("retriever", retriever_node)
# # # # # # # # graph.add_node("llm_direct", llm_direct_node)

# # # # # # # # graph.add_edge(START, "planner")

# # # # # # # # # Conditional edge: if need_retrieval, go to retriever; else go to llm_direct
# # # # # # # # def route_after_planner(state: State) -> str:
# # # # # # # #     return "retriever" if state.get("need_retrieval") else "llm_direct"

# # # # # # # # graph.add_conditional_edges("planner", route_after_planner, {
# # # # # # # #     "retriever": "retriever",
# # # # # # # #     "llm_direct": "llm_direct"
# # # # # # # # })

# # # # # # # # # After retriever, go to llm_direct (which will use context later)
# # # # # # # # graph.add_edge("retriever", "llm_direct")
# # # # # # # # graph.add_edge("llm_direct", END)

# # # # # # # # app = graph.compile()

# # # # # # # from langgraph.graph import StateGraph, START, END
# # # # # # # from state import State
# # # # # # # from nodes import retriever_node, llm_node

# # # # # # # graph = StateGraph(State)
# # # # # # # graph.add_node("retriever", retriever_node)
# # # # # # # graph.add_node("llm", llm_node)
# # # # # # # graph.add_edge(START, "retriever")
# # # # # # # graph.add_edge("retriever", "llm")
# # # # # # # graph.add_edge("llm", END)
# # # # # # # app = graph.compile()

# # # # # # from langgraph.graph import StateGraph, START, END
# # # # # # from state import State
# # # # # # from nodes import planner_node, retriever_node, llm_node

# # # # # # graph = StateGraph(State)

# # # # # # graph.add_node("planner", planner_node)
# # # # # # graph.add_node("retriever", retriever_node)
# # # # # # graph.add_node("llm", llm_node)

# # # # # # graph.add_edge(START, "planner")

# # # # # # # Conditional edge: if need_retrieval, go to retriever; else go directly to llm
# # # # # # def route_after_planner(state: State) -> str:
# # # # # #     return "retriever" if state.get("need_retrieval", False) else "llm"

# # # # # # graph.add_conditional_edges("planner", route_after_planner, {
# # # # # #     "retriever": "retriever",
# # # # # #     "llm": "llm"
# # # # # # })

# # # # # # # After retriever, always go to llm
# # # # # # graph.add_edge("retriever", "llm")
# # # # # # graph.add_edge("llm", END)

# # # # # # app = graph.compile()

# # # # # from langgraph.graph import StateGraph, START, END
# # # # # from state import State
# # # # # from nodes import planner_node, retriever_node, llm_node, validator_node, human_approval_node

# # # # # graph = StateGraph(State)

# # # # # # Add all nodes
# # # # # graph.add_node("planner", planner_node)
# # # # # graph.add_node("retriever", retriever_node)
# # # # # graph.add_node("llm", llm_node)
# # # # # graph.add_node("validator", validator_node)
# # # # # graph.add_node("human_approval", human_approval_node)

# # # # # # Edges
# # # # # graph.add_edge(START, "planner")

# # # # # # Conditional after planner
# # # # # def route_after_planner(state: State) -> str:
# # # # #     return "retriever" if state.get("need_retrieval", False) else "llm"

# # # # # graph.add_conditional_edges("planner", route_after_planner, {
# # # # #     "retriever": "retriever",
# # # # #     "llm": "llm"
# # # # # })
# # # # # graph.add_edge("retriever", "llm")
# # # # # graph.add_edge("llm", "validator")

# # # # # # Conditional after validator
# # # # # def route_after_validator(state: State) -> str:
# # # # #     if state.get("validation_status") == "failed":
# # # # #         return "human_approval"
# # # # #     else:
# # # # #         return END

# # # # # graph.add_conditional_edges("validator", route_after_validator, {
# # # # #     "human_approval": "human_approval",
# # # # #     END: END
# # # # # })

# # # # # # After human approval, end (or you could loop back to llm for revision)
# # # # # graph.add_edge("human_approval", END)

# # # # # app = graph.compile()

# # # # from langgraph.graph import StateGraph, START, END
# # # # from state import State
# # # # from nodes import (
# # # #     planner_node,
# # # #     retriever_node,
# # # #     llm_node,
# # # #     validator_node,
# # # #     human_approval_node,
# # # #     fallback_node   # <-- IMPORT THE FALLBACK NODE
# # # # )

# # # # graph = StateGraph(State)

# # # # # Add all nodes
# # # # graph.add_node("planner", planner_node)
# # # # graph.add_node("retriever", retriever_node)
# # # # graph.add_node("llm", llm_node)
# # # # graph.add_node("validator", validator_node)
# # # # graph.add_node("human_approval", human_approval_node)
# # # # graph.add_node("fallback", fallback_node)   # <-- ADD FALLBACK NODE

# # # # # Edges from START to planner
# # # # graph.add_edge(START, "planner")

# # # # # Conditional after planner
# # # # def route_after_planner(state: State) -> str:
# # # #     return "retriever" if state.get("need_retrieval", False) else "llm"

# # # # graph.add_conditional_edges("planner", route_after_planner, {
# # # #     "retriever": "retriever",
# # # #     "llm": "llm"
# # # # })

# # # # # After retriever, always go to llm
# # # # graph.add_edge("retriever", "llm")

# # # # # Conditional after llm: check if we need to go to fallback
# # # # def route_after_llm(state: State) -> str:
# # # #     # If the llm_node set 'next_node' to 'fallback', go to fallback
# # # #     if state.get("next_node") == "fallback":
# # # #         return "fallback"
# # # #     else:
# # # #         return "validator"

# # # # graph.add_conditional_edges("llm", route_after_llm, {
# # # #     "fallback": "fallback",
# # # #     "validator": "validator"
# # # # })

# # # # # After fallback, end
# # # # graph.add_edge("fallback", END)

# # # # # Conditional after validator
# # # # def route_after_validator(state: State) -> str:
# # # #     if state.get("validation_status") == "failed":
# # # #         return "human_approval"
# # # #     else:
# # # #         return END

# # # # graph.add_conditional_edges("validator", route_after_validator, {
# # # #     "human_approval": "human_approval",
# # # #     END: END
# # # # })

# # # # graph.add_edge("human_approval", END)

# # # # app = graph.compile()

# # # from langgraph.graph import StateGraph, START, END
# # # from langgraph.checkpoint.sqlite import SqliteSaver
# # # from state import State
# # # from nodes import (
# # #     planner_node,
# # #     retriever_node,
# # #     llm_node,
# # #     validator_node,
# # #     human_approval_node,
# # #     fallback_node
# # # )

# # # # ========== 1. Create checkpointer (persistent state) ==========
# # # checkpointer = SqliteSaver.from_conn_string("checkpoints.db")

# # # # ========== 2. Build the graph ==========
# # # graph = StateGraph(State)

# # # # Add nodes
# # # graph.add_node("planner", planner_node)
# # # graph.add_node("retriever", retriever_node)
# # # graph.add_node("llm", llm_node)
# # # graph.add_node("validator", validator_node)
# # # graph.add_node("human_approval", human_approval_node)
# # # graph.add_node("fallback", fallback_node)

# # # # Start edge
# # # graph.add_edge(START, "planner")

# # # # Conditional after planner: decide to retrieve or answer directly
# # # def route_after_planner(state: State) -> str:
# # #     return "retriever" if state.get("need_retrieval", False) else "llm"

# # # graph.add_conditional_edges("planner", route_after_planner, {
# # #     "retriever": "retriever",
# # #     "llm": "llm"
# # # })

# # # # After retriever, always go to LLM
# # # graph.add_edge("retriever", "llm")

# # # # Conditional after LLM: check if we need fallback
# # # def route_after_llm(state: State) -> str:
# # #     if state.get("next_node") == "fallback":
# # #         return "fallback"
# # #     else:
# # #         return "validator"

# # # graph.add_conditional_edges("llm", route_after_llm, {
# # #     "fallback": "fallback",
# # #     "validator": "validator"
# # # })

# # # # Fallback goes to END
# # # graph.add_edge("fallback", END)

# # # # Conditional after validator: if fails, go to human approval; else end
# # # def route_after_validator(state: State) -> str:
# # #     if state.get("validation_status") == "failed":
# # #         return "human_approval"
# # #     else:
# # #         return END

# # # graph.add_conditional_edges("validator", route_after_validator, {
# # #     "human_approval": "human_approval",
# # #     END: END
# # # })

# # # # After human approval, end
# # # graph.add_edge("human_approval", END)

# # # # ========== 3. Compile with checkpointer ==========
# # # app = graph.compile(checkpointer=checkpointer)

# # from langgraph.graph import StateGraph, START, END
# # from langgraph.checkpoint.memory import MemorySaver   # Use MemorySaver instead
# # from state import State
# # from nodes import (
# #     planner_node,
# #     retriever_node,
# #     llm_node,
# #     validator_node,
# #     human_approval_node,
# #     fallback_node
# # )

# # # Use in-memory checkpointer (works without errors)
# # checkpointer = MemorySaver()

# # graph = StateGraph(State)

# # # Add nodes
# # graph.add_node("planner", planner_node)
# # graph.add_node("retriever", retriever_node)
# # graph.add_node("llm", llm_node)
# # graph.add_node("validator", validator_node)
# # graph.add_node("human_approval", human_approval_node)
# # graph.add_node("fallback", fallback_node)

# # # Edges
# # graph.add_edge(START, "planner")

# # def route_after_planner(state: State) -> str:
# #     return "retriever" if state.get("need_retrieval", False) else "llm"

# # graph.add_conditional_edges("planner", route_after_planner, {
# #     "retriever": "retriever",
# #     "llm": "llm"
# # })

# # graph.add_edge("retriever", "llm")

# # def route_after_llm(state: State) -> str:
# #     if state.get("next_node") == "fallback":
# #         return "fallback"
# #     else:
# #         return "validator"

# # graph.add_conditional_edges("llm", route_after_llm, {
# #     "fallback": "fallback",
# #     "validator": "validator"
# # })

# # graph.add_edge("fallback", END)

# # def route_after_validator(state: State) -> str:
# #     if state.get("validation_status") == "failed":
# #         return "human_approval"
# #     else:
# #         return END

# # graph.add_conditional_edges("validator", route_after_validator, {
# #     "human_approval": "human_approval",
# #     END: END
# # })

# # graph.add_edge("human_approval", END)

# # app = graph.compile(checkpointer=checkpointer)

# from langgraph.graph import StateGraph, START, END
# from state import State
# from nodes import (
#     planner_node,
#     retriever_node,
#     llm_node,
#     validator_node,
#     human_approval_node,
#     fallback_node
# )

# graph = StateGraph(State)

# # Add nodes
# graph.add_node("planner", planner_node)
# graph.add_node("retriever", retriever_node)
# graph.add_node("llm", llm_node)
# graph.add_node("validator", validator_node)
# graph.add_node("human_approval", human_approval_node)
# graph.add_node("fallback", fallback_node)

# graph.add_edge(START, "planner")

# def route_after_planner(state: State) -> str:
#     return "retriever" if state.get("need_retrieval", False) else "llm"

# graph.add_conditional_edges("planner", route_after_planner, {
#     "retriever": "retriever",
#     "llm": "llm"
# })

# graph.add_edge("retriever", "llm")

# def route_after_llm(state: State) -> str:
#     if state.get("next_node") == "fallback":
#         return "fallback"
#     else:
#         return "validator"

# graph.add_conditional_edges("llm", route_after_llm, {
#     "fallback": "fallback",
#     "validator": "validator"
# })

# graph.add_edge("fallback", END)

# def route_after_validator(state: State) -> str:
#     if state.get("validation_status") == "failed":
#         return "human_approval"
#     else:
#         return END

# graph.add_conditional_edges("validator", route_after_validator, {
#     "human_approval": "human_approval",
#     END: END
# })

# graph.add_edge("human_approval", END)

# # Compile without checkpointer
# app = graph.compile()

from langgraph.graph import StateGraph, START, END
from state import State
from nodes import (
    planner_node,
    handbook_retriever_node,
    web_retriever_node,
    llm_node,
    validator_node,
    human_approval_node,
    fallback_node
)

graph = StateGraph(State)

# Add all nodes
graph.add_node("planner", planner_node)
graph.add_node("handbook_retriever", handbook_retriever_node)
graph.add_node("web_retriever", web_retriever_node)
graph.add_node("llm", llm_node)
graph.add_node("validator", validator_node)
graph.add_node("human_approval", human_approval_node)
graph.add_node("fallback", fallback_node)

# START -> planner
graph.add_edge(START, "planner")

# Conditional after planner: fan‑out to both retrievers or go directly to LLM
def route_after_planner(state: State):
    if state.get("need_retrieval", False):
        # Return a list of target node names – LangGraph will run them in parallel
        return ["handbook_retriever", "web_retriever"]
    else:
        return "llm"

graph.add_conditional_edges("planner", route_after_planner, {
    "handbook_retriever": "handbook_retriever",
    "web_retriever": "web_retriever",
    "llm": "llm"
})

# Merge node to combine both contexts
def merge_node(state: State) -> dict:
    handbook = state.get("handbook_context", "No handbook info.")
    web = state.get("web_context", "No web info.")
    combined = f"Handbook results:\n{handbook}\n\nWeb results:\n{web}"
    return {"context": combined}

graph.add_node("merge", merge_node)

# Both retrievers go to merge node
graph.add_edge("handbook_retriever", "merge")
graph.add_edge("web_retriever", "merge")
graph.add_edge("merge", "llm")

# Conditional after LLM: fallback or validator
def route_after_llm(state: State) -> str:
    if state.get("next_node") == "fallback":
        return "fallback"
    else:
        return "validator"

graph.add_conditional_edges("llm", route_after_llm, {
    "fallback": "fallback",
    "validator": "validator"
})

# Fallback ends the graph
graph.add_edge("fallback", END)

# Conditional after validator: human approval or end
def route_after_validator(state: State) -> str:
    if state.get("validation_status") == "failed":
        return "human_approval"
    else:
        return END

graph.add_conditional_edges("validator", route_after_validator, {
    "human_approval": "human_approval",
    END: END
})

graph.add_edge("human_approval", END)

# Compile without checkpointer (avoids version issues)
app = graph.compile()