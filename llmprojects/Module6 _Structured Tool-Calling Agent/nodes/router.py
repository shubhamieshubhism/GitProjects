# from state import State

# # def router(state: State) -> str:
# #     return state.get("next_action", "end")

# def router(state: State) -> str:
#     action = state.get("next_action", "end")
#     print(f"[DEBUG] router: next_action = {action}")
#     return action

from state import State

def router(state: State) -> str:
    action = state.get("next_action", "end")
    return action