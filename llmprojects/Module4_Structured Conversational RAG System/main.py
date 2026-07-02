# from langchain_core.messages import HumanMessage
# import warnings
# warnings.filterwarnings("ignore", category=DeprecationWarning, module="langgraph")
# from graph import app

# def main():
#     print("AI Assistant (Ollama) - type 'quit' to exit")
#     # Initial state: empty conversation
#     state = {"messages": []}
    
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
#         # Add user message to state
#         state["messages"].append(HumanMessage(content=user_input))
#         # Run the graph
#         final_state = app.invoke(state)
#         # Update state with the result (contains AI reply)
#         state = final_state
#         # Print the AI's last message
#         print(f"\nAssistant: {state['messages'][-1].content}")

# if __name__ == "__main__":
#     main()

# from langchain_core.messages import HumanMessage
# from graph import app

# def main():
#     print("AI Assistant (RAG with Ollama) - type 'quit' to exit")
#     state = {"messages": [], "context": []}
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

# from langchain_core.messages import HumanMessage
# from graph import app

# def main():
#     print("AI Assistant (Agentic RAG) - type 'quit' to exit")
#     state = {
#         "messages": [],
#         "context": [],
#         "next_action": "",
#         "tool_calls": [],
#         "final_answer": ""
#     }
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
#         # Add user message
#         state["messages"].append(HumanMessage(content=user_input))
#         # Run the graph
#         final_state = app.invoke(state)
#         state = final_state
#         # Print the last AI message
#         last_msg = state["messages"][-1]
#         print(f"\nAssistant: {last_msg.content}")

# if __name__ == "__main__":
#     main()

from langchain_core.messages import HumanMessage
from graph import app
import uuid
import os

def get_or_create_thread_id():
    """Load existing thread_id from a file, or create a new one."""
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
    print("AI Assistant (with persistent memory) - type 'quit' to exit")
    
    # Get a consistent thread_id for this conversation
    thread_id = get_or_create_thread_id()
    print(f"Session ID: {thread_id[:8]}... (conversation will resume after restart)")
    
    # Configuration that tells LangGraph which thread to use
    config = {"configurable": {"thread_id": thread_id}}
    
    # Initial state – the checkpointer will load previous state automatically
    state = {
        "messages": [],
        "context": [],
        "next_action": "",
        "tool_calls": [],
        "final_answer": ""
    }
    
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "quit":
            break
        
        # Add the new user message
        state["messages"].append(HumanMessage(content=user_input))
        
        # Run the graph with the config (automatically loads previous checkpoint)
        final_state = app.invoke(state, config=config)
        state = final_state
        
        # Print the assistant's last message
        last_msg = state["messages"][-1]
        print(f"\nAssistant: {last_msg.content}")

if __name__ == "__main__":
    main()