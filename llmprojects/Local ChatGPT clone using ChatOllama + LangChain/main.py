# # # # from langchain_core.messages import HumanMessage
# # # # from graph import app

# # # # def main():
# # # #     print("Local ChatGPT (Step 1) - type 'quit' to exit")
# # # #     state = {"messages": []}
# # # #     while True:
# # # #         user_input = input("\nYou: ")
# # # #         if user_input.lower() == "quit":
# # # #             break
# # # #         state["messages"].append(HumanMessage(content=user_input))
# # # #         final_state = app.invoke(state)
# # # #         state = final_state
# # # #         print(f"\nAI: {state['messages'][-1].content}")

# # # # if __name__ == "__main__":
# # # #     main()

# # # #main.py – add truncation logic and /clear command.
# # # from langchain_core.messages import HumanMessage
# # # from graph import app

# # # # Maximum number of messages to keep in the state
# # # MAX_HISTORY = 6   # keep last 6 messages (3 exchanges)

# # # def main():
# # #     print("Local ChatGPT (Step 2) - type 'quit' to exit, '/clear' to reset history")
# # #     state = {"messages": []}
# # #     while True:
# # #         user_input = input("\nYou: ")
# # #         if user_input.lower() == "quit":
# # #             break
# # #         if user_input.lower() == "/clear":
# # #             state = {"messages": []}
# # #             print("Conversation history cleared.")
# # #             continue
# # #         state["messages"].append(HumanMessage(content=user_input))
# # #         final_state = app.invoke(state)
# # #         state = final_state
# # #         # Truncate stored state to keep only recent messages
# # #         if len(state["messages"]) > MAX_HISTORY:
# # #             state["messages"] = state["messages"][-MAX_HISTORY:]
# # #         print(f"\nAI: {state['messages'][-1].content}")

# # # if __name__ == "__main__":
# # #     main()


# # from langchain_core.messages import HumanMessage
# # from graph import app

# # MAX_HISTORY = 6

# # def main():
# #     print("Local ChatGPT (Step 3) - type 'quit' to exit, '/clear' to reset")
# #     state = {
# #         "messages": [],
# #         "tool_calls": [],
# #         "tool_results": [],
# #         "next_action": ""
# #     }
# #     while True:
# #         user_input = input("\nYou: ")
# #         if user_input.lower() == "quit":
# #             break
# #         if user_input.lower() == "/clear":
# #             state = {
# #                 "messages": [],
# #                 "tool_calls": [],
# #                 "tool_results": [],
# #                 "next_action": ""
# #             }
# #             print("Conversation history cleared.")
# #             continue
# #         state["messages"].append(HumanMessage(content=user_input))
# #         final_state = app.invoke(state)
# #         state = final_state
# #         if len(state["messages"]) > MAX_HISTORY:
# #             state["messages"] = state["messages"][-MAX_HISTORY:]
# #         if state.get("tool_results"):
# #             print(f"\nTool result: {state['tool_results'][-1]}")
# #             state["tool_results"] = []
# #         else:
# #             print(f"\nAI: {state['messages'][-1].content}")
# #         state["next_action"] = ""

# # if __name__ == "__main__":
# #     main()

# from langchain_core.messages import HumanMessage
# from graph import app

# # Maximum number of messages to keep in the state (3 exchanges = 6 messages)
# MAX_HISTORY = 6

# def main():
#     print("Local ChatGPT (Step 4 - Memory Mgmt) - type 'quit' to exit, '/clear' to reset")
#     state = {
#         "messages": [],
#         "tool_calls": [],
#         "tool_results": [],
#         "next_action": ""
#     }
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
#         if user_input.lower() == "/clear":
#             state = {
#                 "messages": [],
#                 "tool_calls": [],
#                 "tool_results": [],
#                 "next_action": ""
#             }
#             print("Conversation history cleared.")
#             continue
#         state["messages"].append(HumanMessage(content=user_input))
#         final_state = app.invoke(state)
#         state = final_state
#         # Truncate stored state to keep only recent messages
#         if len(state["messages"]) > MAX_HISTORY:
#             state["messages"] = state["messages"][-MAX_HISTORY:]
#         # Show tool result or AI answer
#         if state.get("tool_results"):
#             print(f"\nTool result: {state['tool_results'][-1]}")
#             state["tool_results"] = []
#         else:
#             print(f"\nAI: {state['messages'][-1].content}")
#         state["next_action"] = ""

# if __name__ == "__main__":
#     main()

from langchain_core.messages import HumanMessage
from graph import app

MAX_HISTORY = 6

def main():
    print("Local ChatGPT (Terminal) - type 'quit' to exit, '/clear' to reset")
    state = {
        "messages": [],
        "tool_calls": [],
        "tool_results": [],
        "next_action": "",
        "confidence": 0.0,
        "sources": [],
        "temperature": 0.7
    }
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "quit":
            break
        if user_input.lower() == "/clear":
            state = {
                "messages": [],
                "tool_calls": [],
                "tool_results": [],
                "next_action": "",
                "confidence": 0.0,
                "sources": [],
                "temperature": state["temperature"]
            }
            print("Conversation cleared.")
            continue
        state["messages"].append(HumanMessage(content=user_input))
        final_state = app.invoke(state)
        state = final_state
        if len(state["messages"]) > MAX_HISTORY:
            state["messages"] = state["messages"][-MAX_HISTORY:]
        if state.get("tool_results"):
            print(f"\nTool result: {state['tool_results'][-1]}")
            state["tool_results"] = []
        else:
            print(f"\nAI: {state['messages'][-1].content}")
        state["next_action"] = ""

if __name__ == "__main__":
    main()