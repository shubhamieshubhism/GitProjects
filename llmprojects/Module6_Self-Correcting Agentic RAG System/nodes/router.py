from state import State

def router(state: State) -> str:
    return state.get("next_action", "end")