# from state import State

# def router(state: State) -> str:
#     return state.get("next_action", "end")

from state import State

def router(state: State) -> str:
    action = state.get("next_action", "end")
    # If action is empty string, treat it as "end"
    if action == "":
        return "end"
    return action