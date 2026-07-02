from langchain_core.messages import HumanMessage
from graph import app
import uuid
import os

# # def get_or_create_thread_id():
# #     thread_file = "thread_id.txt"
# #     if os.path.exists(thread_file):
# #         with open(thread_file, "r") as f:
# #             return f.read().strip()
# #     else:
# #         new_id = str(uuid.uuid4())
# #         with open(thread_file, "w") as f:
# #             f.write(new_id)
# #         return new_id

# # from langgraph.errors import GraphInterrupt
# # from langgraph.types import Command
# # # ... other imports ...

# # def main():
# #     print("Reliable Stateful Agent (Step 5 - Human-in-the-loop) - type 'quit' to exit")
# #     thread_id = get_or_create_thread_id()
# #     config = {"configurable": {"thread_id": thread_id}}
# #     state = {"messages": [], "next_node": "", "error_count": 0, "error_message": "", "approved": False}
# #     while True:
# #         user_input = input("\nYou: ")
# #         if user_input.lower() == "quit":
# #             break
# #         state["messages"].append(HumanMessage(content=user_input))
# #         while True:
# #             try:
# #                 final_state = app.invoke(state, config=config)
# #                 state = final_state
# #                 break
# #             except GraphInterrupt as e:
# #                 # Interrupt raised by approval_node
# #                 # The interrupt data is in e.args[0] (dictionary)
# #                 interrupt_data = e.args[0]
# #                 print(f"\n[System] {interrupt_data.get('question')}")
# #                 decision = input("> ")
# #                 # Resume with the user's decision
# #                 state = app.invoke(Command(resume=decision), config=config)
# #         # Print assistant's last message
# #         last_msg = state["messages"][-1]
# #         print(f"\nAssistant: {last_msg.content}")

# print("Starting main...")
# from graph import app
# print("Graph imported")
# from langchain_core.messages import HumanMessage
# print("Imports done")

# def main():
#     print("Inside main()")
#     print("Reliable Stateful Agent - type 'quit' to exit")
#     state = {"messages": [], "next_node": "", "error_count": 0, "error_message": "", "approved": False}
#     print("State initialized")
#     while True:
#         print("About to get input...")
#         user_input = input("\nYou: ")
#         print(f"Got: {user_input}")
#         if user_input.lower() == "quit":
#             break
#         state["messages"].append(HumanMessage(content=user_input))
#         final_state = app.invoke(state)
#         state = final_state
#         print(f"\nAssistant: {state['messages'][-1].content}")

# if __name__ == "__main__":
#     print("Calling main()")
#     main()


print("Starting main...")
from graph import app
print("Graph imported")
from langchain_core.messages import HumanMessage
print("Imports done")
import uuid
import os

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
    print("Inside main()")
    print("Reliable Stateful Agent - type 'quit' to exit")
    thread_id = get_or_create_thread_id()
    config = {"configurable": {"thread_id": thread_id}}
    #state = {"messages": [], "next_node": "", "error_count": 0, "error_message": "", "approved": False}
    state = {"messages": [], "approved": False, "error_count": 0, "error_message": ""}
    print("State initialized")
    while True:
        print("About to get input...")
        user_input = input("\nYou: ")
        print(f"Got: {user_input}")
        if user_input.lower() == "quit":
            break
        state["messages"].append(HumanMessage(content=user_input))
        final_state = app.invoke(state, config=config)
        state = final_state
        print(f"\nAssistant: {state['messages'][-1].content}")

if __name__ == "__main__":
    print("Calling main()")
    main()