from langgraph.types import interrupt
from state import State

def human_approval_node(state: State) -> dict:
    """Ask human to review the answer when validation fails."""
    last_answer = state["messages"][-1].content
    print("\n[System] Validation failed. Human review required.")
    feedback = interrupt({
        "question": f"Answer: {last_answer}\n\nIs this answer acceptable? (yes/no/revise): ",
        "context": "Please review the answer and provide feedback."
    })
    return {"human_feedback": feedback}