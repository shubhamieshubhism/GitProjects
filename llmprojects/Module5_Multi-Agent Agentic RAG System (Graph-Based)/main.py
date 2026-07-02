# # # from langchain_core.messages import HumanMessage
# # # from graph import app

# # # def main():
# # #     print("Multi-Agent RAG (Step 1) - type 'quit' to exit")
# # #     state = {"messages": []}
# # #     while True:
# # #         user_input = input("\nYou: ")
# # #         if user_input.lower() == "quit":
# # #             break
# # #         state["messages"].append(HumanMessage(content=user_input))
# # #         final_state = app.invoke(state)
# # #         state = final_state
# # #         print(f"\nAssistant: {state['messages'][-1].content}")

# # # if __name__ == "__main__":
# # #     main()

# # import traceback

# # try:
# #     from graph import app
# #     from langchain_core.messages import HumanMessage
# # except Exception as e:
# #     print("Import error:")
# #     traceback.print_exc()
# #     exit(1)

# # def main():
# #     print("Multi-Agent RAG (Step 1) - type 'quit' to exit")
# #     #state = {"messages": []}
# #     #state = {"messages": [], "need_retrieval": False, "context": None}
# #     #state = {"messages": [], "context": None}
# #     state = {"messages": [], "context": None, "need_retrieval": False}
# #     while True:
# #         user_input = input("\nYou: ")
# #         if user_input.lower() == "quit":
# #             break
# #         state["messages"].append(HumanMessage(content=user_input))
# #         final_state = app.invoke(state)
# #         state = final_state
# #         print(f"\nAssistant: {state['messages'][-1].content}")

# # if __name__ == "__main__":
# #     main()

# from langgraph.errors import GraphInterrupt
# from langgraph.types import Command
# from langchain_core.messages import HumanMessage
# from graph import app
# import uuid
# import os

# def get_or_create_thread_id():
#     thread_file = "thread_id.txt"
#     if os.path.exists(thread_file):
#         with open(thread_file, "r") as f:
#             return f.read().strip()
#     else:
#         new_id = str(uuid.uuid4())
#         with open(thread_file, "w") as f:
#             f.write(new_id)
#         return new_id

# def main():
#     print("⚡ Multi-Agent RAG (Step 4) - type 'quit' to exit")
#     thread_id = get_or_create_thread_id()
#     config = {"configurable": {"thread_id": thread_id}}
#     state = {
#         "messages": [],
#         "context": None,
#         "need_retrieval": False,
#         "validation_status": "",
#         "human_feedback": None
#     }
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
#         state["messages"].append(HumanMessage(content=user_input))
#         try:
#             final_state = app.invoke(state, config=config)
#             state = final_state
#         except GraphInterrupt as e:
#             # Interrupt from human_approval_node
#             interrupt_data = e.args[0]
#             print(f"\n[System] {interrupt_data.get('question')}")
#             decision = input("> ")
#             state = app.invoke(Command(resume=decision), config=config)
#         # Print the assistant's last answer
#         if state["messages"]:
#             print(f"\nAssistant: {state['messages'][-1].content}")

# if __name__ == "__main__":
#     main()

import uuid
import os
from langgraph.errors import GraphInterrupt
from langgraph.types import Command
from langchain_core.messages import HumanMessage
from graph import app

def get_or_create_thread_id():
    thread_file = "thread_id.txt"
    if os.path.exists(thread_file):
        with open(thread_file, "r") as f:
            return f.read().strip()
    else:
        new_id = str(uuid.uuid4())
        with open(thread_file, "w") as f:
            f.write(new_id)
        return new_id

def main():
    print("Multi-Agent RAG (Step 6 - Persistent Memory) - type 'quit' to exit")
    thread_id = get_or_create_thread_id()
    config = {"configurable": {"thread_id": thread_id}}
    state = {
        "messages": [],
        "context": None,
        "need_retrieval": False,
        "validation_status": "",
        "human_feedback": None,
        "error_count": 0,
        "error_message": ""
    }
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "quit":
            break
        state["messages"].append(HumanMessage(content=user_input))
        try:
            final_state = app.invoke(state, config=config)
            state = final_state
        except GraphInterrupt as e:
            interrupt_data = e.args[0]
            print(f"\n[System] {interrupt_data.get('question')}")
            decision = input("> ")
            state = app.invoke(Command(resume=decision), config=config)
        # Print last assistant message
        if state["messages"]:
            print(f"\nAssistant: {state['messages'][-1].content}")

if __name__ == "__main__":
    main()