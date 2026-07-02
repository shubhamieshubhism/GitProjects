# from langchain_core.messages import HumanMessage
# from graph import app

# def main():
#     print("Self‑Correcting RAG Agent (Step 1) - type 'quit' to exit")
#     state = {"messages": []}
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
#         state["messages"].append(HumanMessage(content=user_input))
#         final_state = app.invoke(state)
#         state = final_state
#         print(f"\nAssistant: {state['messages'][-1].content}")

# if __name__ == "__main__":
#     main()

from langchain_core.messages import HumanMessage
from graph import app

def main():
    print("Self‑Correcting RAG (Step 2) - type 'quit' to exit")
    state = {
        "messages": [],
        "tool_calls": [],
        "tool_results": [],
        "context": None,
        "next_action": ""
    }
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "quit":
            break
        state["messages"].append(HumanMessage(content=user_input))
        final_state = app.invoke(state)
        state = final_state
        if state.get("tool_results"):
            print(f"\nTool result:\n{state['tool_results'][-1]}")
            state["tool_results"] = []
        else:
            print(f"\nAssistant: {state['messages'][-1].content}")
        state["next_action"] = ""

if __name__ == "__main__":
    main()