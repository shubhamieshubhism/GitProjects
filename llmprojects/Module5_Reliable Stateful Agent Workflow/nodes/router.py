#from state import State

# # def router(state: State) -> str:
# #     """Return the name of the next node based on state['next_node']."""
# #     return state.get("next_node", "end")

# from state import State

# def router(state: State) -> str:
#     next_node = state.get("next_node", "end")
#     if next_node == "mock_tool":
#         return "mock_tool"
#     elif next_node == "fallback":
#         return "fallback"
#     else:
#         return "end"

# def router(state: State) -> str:
#     next_node = state.get("next_node", "end")
#     if next_node == "await_approval":
#         return "await_approval"
#     elif next_node == "mock_tool":
#         return "mock_tool"
#     elif next_node == "fallback":
#         return "fallback"
#     else:
#         return "end"

from state import State

def router(state: State) -> str:
    next_node = state.get("next_node", "end")
    print(f"[DEBUG router] state.get('next_node') = {next_node}")   # <-- ADD THIS

    if next_node == "await_approval":
        return "await_approval"
    elif next_node == "mock_tool":
        return "mock_tool"
    elif next_node == "fallback":
        return "fallback"
    else:
        return "end"