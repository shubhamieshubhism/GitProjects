# # # # from langchain_core.messages import HumanMessage
# # # # from graph import app

# # # # def main():
# # # #     print("Finance/Legal Expert (Step 1) - type 'quit' to exit")
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

# # # """update – handle tool results"""
# # # from langchain_core.messages import HumanMessage
# # # from graph import app

# # # def main():
# # #     print("Finance/Legal Expert (Step 2) - type 'quit' to exit")
# # #     state = {
# # #         "messages": [],
# # #         "tool_calls": [],
# # #         "tool_results": [],
# # #         "context": None,
# # #         "next_action": ""
# # #     }
# # #     while True:
# # #         user_input = input("\nYou: ")
# # #         if user_input.lower() == "quit":
# # #             break
# # #         state["messages"].append(HumanMessage(content=user_input))
# # #         final_state = app.invoke(state)
# # #         state = final_state
# # #         if state.get("tool_results"):
# # #             print(f"\nTool result:\n{state['tool_results'][-1]}")
# # #             state["tool_results"] = []
# # #         else:
# # #             print(f"\nAssistant: {state['messages'][-1].content}")
# # #         state["next_action"] = ""

# # # if __name__ == "__main__":
# # #     main()

# # #main.py with trucate logic
# # from langchain_core.messages import HumanMessage
# # from graph import app

# # # Maximum number of messages to keep in conversation history
# # MAX_HISTORY = 8   # 4 exchanges (user + assistant)

# # def main():
# #     print("Finance/Legal Expert (Step 4 - Memory Mgmt) - type 'quit' to exit")
# #     state = {
# #         "messages": [],
# #         "tool_calls": [],
# #         "tool_results": [],
# #         "context": None,
# #         "next_action": ""
# #     }
# #     while True:
# #         user_input = input("\nYou: ")
# #         if user_input.lower() == "quit":
# #             break
# #         state["messages"].append(HumanMessage(content=user_input))
# #         final_state = app.invoke(state)
# #         state = final_state
        
# #         # --- CHANGE: Truncate conversation to keep only recent history ---
# #         if len(state["messages"]) > MAX_HISTORY:
# #             state["messages"] = state["messages"][-MAX_HISTORY:]
# #         # ----------------------------------------------------------------
        
# #         if state.get("tool_results"):
# #             print(f"\nTool result:\n{state['tool_results'][-1]}")
# #             state["tool_results"] = []
# #         else:
# #             print(f"\nAssistant: {state['messages'][-1].content}")
# #         state["next_action"] = ""

# # if __name__ == "__main__":
# #     main()

# #main.py (with turn_id, user rating logging, and truncation)
# from langchain_core.messages import HumanMessage
# from graph import app
# from utils.eval import log_metric

# # Maximum number of messages to keep in conversation history (for state truncation)
# MAX_HISTORY = 8

# def main():
#     print("Finance/Legal Expert (Step 5 - Evaluation) - type 'quit' to exit")
#     state = {
#         "messages": [],
#         "tool_calls": [],
#         "tool_results": [],
#         "context": None,
#         "next_action": "",
#         "turn_id": 0
#     }
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
#         state["turn_id"] += 1
#         state["messages"].append(HumanMessage(content=user_input))
        
#         final_state = app.invoke(state)
#         state = final_state
        
#         # Truncate conversation to avoid unlimited growth in state
#         if len(state["messages"]) > MAX_HISTORY:
#             state["messages"] = state["messages"][-MAX_HISTORY:]
        
#         # Show results
#         if state.get("tool_results"):
#             print(f"\nTool result:\n{state['tool_results'][-1]}")
#             state["tool_results"] = []
#         else:
#             last_msg = state["messages"][-1]
#             print(f"\nAssistant: {last_msg.content}")
        
#         # Ask for user rating (1-5) and log it
#         rating = input("\nRate answer (1=bad, 5=good): ").strip()
#         if rating.isdigit():
#             log_metric(
#                 turn_id=state["turn_id"],
#                 metric_name="user_rating",
#                 value=int(rating),
#                 metadata={"question": user_input}
#             )
        
#         state["next_action"] = ""

# if __name__ == "__main__":
#     main()

from langchain_core.messages import HumanMessage
from graph import app
from utils.eval import log_metric

MAX_HISTORY = 8

def main():
    print("Finance/Legal Expert (Step 5 - Evaluation) - type 'quit' to exit")
    state = {
        "messages": [],
        "tool_calls": [],
        "tool_results": [],
        "context": None,
        "next_action": "",
        "turn_id": 0
    }
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "quit":
            break
        state["turn_id"] += 1
        state["messages"].append(HumanMessage(content=user_input))
        
        final_state = app.invoke(state)
        # Preserve turn_id (in case graph nodes don't return it)
        final_state["turn_id"] = state["turn_id"]
        state = final_state
        
        if len(state["messages"]) > MAX_HISTORY:
            state["messages"] = state["messages"][-MAX_HISTORY:]
        
        if state.get("tool_results"):
            print(f"\nTool result:\n{state['tool_results'][-1]}")
            state["tool_results"] = []
        else:
            last_msg = state["messages"][-1]
            print(f"\nAssistant: {last_msg.content}")
        
        rating = input("\nRate answer (1=bad, 5=good): ").strip()
        if rating.isdigit():
            log_metric(
                turn_id=state["turn_id"],
                metric_name="user_rating",
                value=int(rating),
                metadata={"question": user_input}
            )
        
        state["next_action"] = ""

if __name__ == "__main__":
    main()