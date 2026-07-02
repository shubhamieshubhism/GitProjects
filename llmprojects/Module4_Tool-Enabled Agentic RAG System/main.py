# # from langchain_core.messages import HumanMessage
# # from graph import app

# # def main():
# #     print("🤖 Agentic RAG System (Step 1) - type 'quit' to exit")
# #     state = {"messages": []}
    
# #     while True:
# #         user_input = input("\nYou: ")
# #         if user_input.lower() == "quit":
# #             break
# #         # Add user message to state
# #         state["messages"].append(HumanMessage(content=user_input))
# #         # Run the graph
# #         final_state = app.invoke(state)
# #         # Update state with the result
# #         state = final_state
# #         # Print the AI's last message
# #         print(f"\nAssistant: {state['messages'][-1].content}")

# # if __name__ == "__main__":
# #     main()

# # from langchain_core.messages import HumanMessage
# # from graph import app

# # def main():
# #     print("🤖 Agentic RAG (Step 2) - type 'quit' to exit")
# #     state = {"messages": [], "context": None}
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

# # from langchain_core.messages import HumanMessage
# # from graph import app

# # def main():
# #     print("🤖 Agentic RAG (Step 3 - Agent decides when to use tool) - type 'quit' to exit")
# #     state = {
# #     "messages": [],
# #     "context": None,
# #     "next_action": "",
# #     "tool_calls": [],
# #     "scratchpad": ""
# # }
# #     while True:
# #         user_input = input("\nYou: ")
# #         if user_input.lower() == "quit":
# #             break
# #         state["messages"].append(HumanMessage(content=user_input))
# #         final_state = app.invoke(state)
# #         state = final_state
# #         # Print the last AI message
# #         last_msg = state["messages"][-1]
# #         print(f"\nAssistant: {last_msg.content}")

# # if __name__ == "__main__":
# #     main()

# from langchain_core.messages import HumanMessage
# from graph import app
# import uuid
# import os

# def get_or_create_thread_id():
#     """Load existing thread_id from a file, or create a new one."""
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
#     print("🤖 Agentic RAG (Step 6 - Persistent Memory) - type 'quit' to exit")
    
#     thread_id = get_or_create_thread_id()
#     print(f"Session ID: {thread_id[:8]}... (conversation will resume after restart)")
    
#     # Configuration that tells LangGraph which thread to use
#     config = {"configurable": {"thread_id": thread_id}}
    
#     # Initial state (checkpointer will load previous state if exists)
#     state = {
#         "messages": [],
#         "context": None,
#         "next_action": "",
#         "tool_calls": [],
#         "scratchpad": ""
#     }
    
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
        
#         state["messages"].append(HumanMessage(content=user_input))
#         final_state = app.invoke(state, config=config)
#         state = final_state
        
#         last_msg = state["messages"][-1]
#         print(f"\nAssistant: {last_msg.content}")

# if __name__ == "__main__":
#     main()

from langchain_core.messages import HumanMessage
from graph import app
import uuid
import os

def get_or_create_thread_id():
    fname = "thread_id.txt"
    if os.path.exists(fname):
        with open(fname) as f:
            return f.read().strip()
    else:
        tid = str(uuid.uuid4())
        with open(fname, "w") as f:
            f.write(tid)
        return tid

def main():
    print("🤖 Agentic RAG (Final) - type 'quit' to exit")
    thread_id = get_or_create_thread_id()
    config = {"configurable": {"thread_id": thread_id}}
    state = {
        "messages": [],
        "context": None,
        "next_action": "",
        "tool_calls": [],
        "scratchpad": ""
    }
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "quit":
            break
        state["messages"].append(HumanMessage(content=user_input))
        final_state = app.invoke(state, config=config)
        state = final_state
        last_msg = state["messages"][-1]
        print(f"\nAssistant: {last_msg.content}")

if __name__ == "__main__":
    main()