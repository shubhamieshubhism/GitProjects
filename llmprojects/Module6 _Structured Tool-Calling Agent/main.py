# # # # from langchain_core.messages import HumanMessage
# # # # from graph import app

# # # # def main():
# # # #     print("Structured Tool‑Calling Agent (Step 1) - type 'quit' to exit")
# # # #     state = {"messages": []}
# # # #     while True:
# # # #         user_input = input("\nYou: ")
# # # #         if user_input.lower() == "quit":
# # # #             break
# # # #         state["messages"].append(HumanMessage(content=user_input))
# # # #         final_state = app.invoke(state)
# # # #         state = final_state
# # # #         print(f"\nAssistant: {state['messages'][-1].content}")

# # # # if __name__ == "__main__":
# # # #     main()

# # # from langchain_core.messages import HumanMessage
# # # from graph import app

# # # def main():
# # #     print("Structured Tool‑Calling Agent (Step 2) - type 'quit' to exit")
# # #     state = {"messages": [], "tool_calls": [], "tool_results": [], "next_action": ""}
# # #     while True:
# # #         user_input = input("\nYou: ")
# # #         if user_input.lower() == "quit":
# # #             break
# # #         state["messages"].append(HumanMessage(content=user_input))
# # #         final_state = app.invoke(state)
# # #         state = final_state
# # #         if state.get("tool_results"):
# # #             print(f"\nTool result: {state['tool_results'][-1]}")
# # #         else:
# # #             print(f"\nAssistant: {state['messages'][-1].content}")

# # # if __name__ == "__main__":
# # #     main()

# # """update main.py to show the assistant's natural answer when no tool result"""
# # def main():
# #     print("Structured Tool‑Calling Agent (Step 2) - type 'quit' to exit")
# #     state = {"messages": [], "tool_calls": [], "tool_results": [], "next_action": ""}
# #     while True:
# #         user_input = input("\nYou: ")
# #         if user_input.lower() == "quit":
# #             break
# #         state["messages"].append(HumanMessage(content=user_input))
# #         final_state = app.invoke(state)
# #         state = final_state
# #         if state.get("tool_results"):
# #             print(f"\nTool result: {state['tool_results'][-1]}")
# #         else:
# #             # Print the last AI message if no tool result
# #             last_msg = state["messages"][-1]
# #             print(f"\nAssistant: {last_msg.content}")

# print("DEBUG: Starting imports...")

# from langchain_core.messages import HumanMessage
# print("DEBUG: Imported HumanMessage")

# try:
#     from graph import app
#     print("DEBUG: Imported app from graph")
# except Exception as e:
#     print(f"DEBUG: Import error: {e}")
#     raise

# # def main():
# #     print("Structured Tool‑Calling Agent (Step 2) - type 'quit' to exit")
# #     state = {"messages": [], "tool_calls": [], "tool_results": [], "next_action": ""}
# #     while True:
# #         user_input = input("\nYou: ")
# #         if user_input.lower() == "quit":
# #             break
# #         state["messages"].append(HumanMessage(content=user_input))
# #         final_state = app.invoke(state)
# #         state = final_state
# #         if state.get("tool_results"):
# #             print(f"\nTool result: {state['tool_results'][-1]}")
# #         else:
# #             last_msg = state["messages"][-1]
# #             print(f"\nAssistant: {last_msg.content}")

# def main():
#     print("Structured Tool‑Calling Agent (Step 2) - type 'quit' to exit")
#     state = {"messages": [], "tool_calls": [], "tool_results": [], "next_action": ""}
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
#         state["messages"].append(HumanMessage(content=user_input))
#         final_state = app.invoke(state)
#         state = final_state
#         if state.get("tool_results"):
#             print(f"\nTool result: {state['tool_results'][-1]}")
#             # Clear tool_results to prevent re-printing in next turn
#             state["tool_results"] = []
#         else:
#             last_msg = state["messages"][-1]
#             print(f"\nAssistant: {last_msg.content}")

# if __name__ == "__main__":
#     print("DEBUG: Calling main()")
#     main()

from langchain_core.messages import HumanMessage
from graph import app

def main():
    print("Structured Tool‑Calling Agent (Step 6) - type 'quit' to exit")
    state = {
        "messages": [],
        "tool_calls": [],
        "tool_results": [],
        "next_action": "",
        "iterations": 0
    }
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "quit":
            break
        # Reset iterations for each new user query (prevents limit accumulation)
        state["iterations"] = 0
        state["messages"].append(HumanMessage(content=user_input))
        final_state = app.invoke(state)
        state = final_state
        # Print tool result or assistant's final answer
        if state.get("tool_results"):
            print(f"\nTool result: {state['tool_results'][-1]}")
            state["tool_results"] = []   # clear after printing
        else:
            last_msg = state["messages"][-1]
            print(f"\nAssistant: {last_msg.content}")
        # Reset next_action for next iteration
        state["next_action"] = ""

if __name__ == "__main__":
    main()