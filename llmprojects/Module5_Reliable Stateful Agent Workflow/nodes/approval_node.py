#from langgraph.checkpoint import interrupt
# from langgraph.types import interrupt  # ✅ Correct
# from state import State

# def approval_node(state: State) -> dict:
#     """
#     Ask the user for approval before proceeding to the tool.
#     Pauses the graph, waits for yes/no, and sets approved flag.
#     """
#     # The interrupt call returns the user's response when resumed
#     user_response = interrupt({
#         "question": "Do you approve calling the mock tool?",
#         "tool_call": "mock_tool",
#         "context": "This will simulate a search action."
#     })
#     approved = user_response.lower() == "yes"
#     #return {"approved": approved, "next_node": "tools" if approved else "end"}
#     return {"approved": approved, "next_node": "mock_tool" if approved else "end"}


# from langgraph.types import interrupt
# from state import State

# def approval_node(state: State) -> dict:
#     print("[DEBUG] approval_node has been reached!")   # <-- ADD THIS
#     user_response = interrupt({
#         "question": "Do you approve calling the mock tool?",
#         "tool_call": "mock_tool",
#         "context": "This will simulate a search action."
#     })
#     approved = user_response.lower() == "yes"
#     return {"approved": approved, "next_node": "mock_tool" if approved else "end"}


from state import State

# def approval_node(state: State) -> dict:
#     print("\n[System] Approval required for mock tool.")
#     user_response = input("Do you approve? (yes/no): ")
#     approved = user_response.lower() == "yes"
#     return {"approved": approved, "next_node": "mock_tool" if approved else "end"}

def approval_node(state: State) -> dict:
    print("\n[System] Do you approve calling the LLM to answer?")
    user_response = input("> ")
    approved = user_response.lower() == "yes"
    return {"approved": approved}