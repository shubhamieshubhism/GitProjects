# from langchain_core.messages import HumanMessage
# from graph import app

# def main():
#     print("AI Email Assistant (type 'quit' to exit)")
#     current_state = {"messages": []}
    
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
        
#         current_state["messages"].append(HumanMessage(content=user_input))
#         final_state = app.invoke(current_state)
#         current_state = final_state
#         last_message = final_state["messages"][-1]
#         print(f"\nAssistant: {last_message.content}")

# if __name__ == "__main__":
#     main()

# from langchain_core.messages import HumanMessage
# from graph import app

# def main():
#     print("AI Email Assistant (with draft email tool) - type 'quit' to exit")
#     current_state = {
#         "messages": [],
#         "next_action": "",
#         "tool_calls": [],
#         "final_answer": ""
#     }
    
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
        
#         current_state["messages"].append(HumanMessage(content=user_input))
#         final_state = app.invoke(current_state)
#         current_state = final_state
        
#         # Print the final answer (if any)
#         if final_state.get("final_answer"):
#             print(f"\nAssistant: {final_state['final_answer']}")
#         else:
#             # Fallback: print last AI message
#             last_msg = final_state["messages"][-1]
#             print(f"\nAssistant: {last_msg.content}")

# if __name__ == "__main__":
#     main()


# from langchain_core.messages import HumanMessage
# from graph import app
# import uuid

# def get_or_create_thread_id():
#     """Load existing thread_id from file, or create a new one."""
#     try:
#         with open("thread_id.txt", "r") as f:
#             return f.read().strip()
#     except FileNotFoundError:
#         new_id = str(uuid.uuid4())
#         with open("thread_id.txt", "w") as f:
#             f.write(new_id)
#         return new_id

# def main():
#     print("AI Email Assistant (with persistent memory) - type 'quit' to exit")
    
#     # Get a consistent thread_id for this conversation
#     thread_id = get_or_create_thread_id()
#     print(f"Conversation ID: {thread_id[:8]}... (saved to disk)")
    
#     # Configuration for LangGraph – includes thread_id for checkpointing
#     config = {"configurable": {"thread_id": thread_id}}
    
#     # Initial state (will be overridden by checkpoint if exists)
#     current_state = {
#         "messages": [],
#         "next_action": "",
#         "tool_calls": [],
#         "final_answer": ""
#     }
    
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
        
#         # Add user message to state
#         current_state["messages"].append(HumanMessage(content=user_input))
        
#         # Invoke the graph with the config (so it knows which checkpoint to use)
#         final_state = app.invoke(current_state, config=config)
#         current_state = final_state
        
#         # Print the final answer
#         if final_state.get("final_answer"):
#             print(f"\nAssistant: {final_state['final_answer']}")
#         else:
#             last_msg = final_state["messages"][-1]
#             print(f"\nAssistant: {last_msg.content}")

# if __name__ == "__main__":
#     main()




# #We need to change the main loop to handle interrupts. When app.invoke raises an interrupt, we capture the interrupt data, ask the user, then resume. python
# from langgraph.errors import GraphInterrupt
# from langgraph.types import Command
# from langchain_core.messages import HumanMessage
# from graph import app
# import uuid

# def get_or_create_thread_id():
#     try:
#         with open("thread_id.txt", "r") as f:
#             return f.read().strip()
#     except FileNotFoundError:
#         new_id = str(uuid.uuid4())
#         with open("thread_id.txt", "w") as f:
#             f.write(new_id)
#         return new_id

# def main():
#     print("AI Email Assistant (with human approval for sending emails) - type 'quit' to exit")
    
#     thread_id = get_or_create_thread_id()
#     config = {"configurable": {"thread_id": thread_id}}
    
#     current_state = {
#         "messages": [],
#         "next_action": "",
#         "tool_calls": [],
#         "final_answer": ""
#     }
    
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
        
#         current_state["messages"].append(HumanMessage(content=user_input))
        
#         # Run the graph, but it may interrupt
#         try:
#             final_state = app.invoke(current_state, config=config)
#             current_state = final_state
#             if final_state.get("final_answer"):
#                 print(f"\nAssistant: {final_state['final_answer']}")
#             else:
#                 last_msg = final_state["messages"][-1]
#                 print(f"\nAssistant: {last_msg.content}")
#         except GraphInterrupt as e:
#             # The graph paused because interrupt() was called
#             # e.resume_value contains the interrupt data? Actually need to capture via Command
#             # Better pattern: use app.invoke with streaming or check for pending interrupts.
#             # For simplicity, we'll use a different approach: call app.invoke and if it returns with a resume value.
#             # But LangGraph's interrupt raises an exception. We'll handle by re‑invoking with resume.
#             # Let's simplify: we'll use the recommended pattern – separate function to resume.
#             pass

# # Simpler approach: use two-phase invocation
# def run_with_approval():
#     thread_id = get_or_create_thread_id()
#     config = {"configurable": {"thread_id": thread_id}}
#     state = {"messages": [], "next_action": "", "tool_calls": [], "final_answer": ""}
    
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
#         state["messages"].append(HumanMessage(content=user_input))
        
#         # Start/resume the graph
#         while True:
#             try:
#                 state = app.invoke(state, config=config)
#                 break  # finished without interrupt
#             except GraphInterrupt:
#                 # This happens when interrupt() is called
#                 # We need to get the interrupt data. Actually in newer versions,
#                 # you catch GraphInterrupt and then call app.invoke with a Command(resume=...)
#                 # For simplicity, we'll use a pattern with a separate function.
#                 pass
        
#         # After graph finishes, print final answer
#         if state.get("final_answer"):
#             print(f"\nAssistant: {state['final_answer']}")
#         else:
#             print(f"\nAssistant: {state['messages'][-1].content}")

# # Real working pattern (using the latest LangGraph API)
# def run_correct():
#     from langgraph.types import Command
#     thread_id = get_or_create_thread_id()
#     config = {"configurable": {"thread_id": thread_id}}
#     state = {"messages": [], "next_action": "", "tool_calls": [], "final_answer": ""}
    
#     while True:
#         user_input = input("\nYou: ")
#         if user_input.lower() == "quit":
#             break
#         state["messages"].append(HumanMessage(content=user_input))
        
#         # Run the graph; if interrupted, we get an exception
#         while True:
#             try:
#                 state = app.invoke(state, config=config)
#                 break
#             except GraphInterrupt as e:
#                 # Interrupt occurred. e.args[0] contains the data passed to interrupt()
#                 interrupt_data = e.args[0]
#                 print(f"\n⏸️  Graph interrupted: {interrupt_data.get('question')}")
#                 user_decision = input("Your choice (yes/no): ")
#                 # Resume with the user's answer
#                 state = app.invoke(Command(resume=user_decision), config=config)
#                 # Continue the loop (graph will run until next interrupt or end)
#         # After loop ends, print final answer
#         if state.get("final_answer"):
#             print(f"\nAssistant: {state['final_answer']}")
#         else:
#             last_msg = state["messages"][-1]
#             print(f"\nAssistant: {last_msg.content}")

# if __name__ == "__main__":
#     run_correct()
# #But to keep this step simple and focused on the concept, I will provide a simplified working version that you can copy and run. The key is understanding the pattern.



#Simplified version of the main.py

from langgraph.types import Command
from langgraph.errors import GraphInterrupt
from langchain_core.messages import HumanMessage
from graph import app
import uuid

def get_thread_id():
    try:
        with open("thread_id.txt", "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        new_id = str(uuid.uuid4())
        with open("thread_id.txt", "w") as f:
            f.write(new_id)
        return new_id

def main():
    print("AI Email Assistant (human approval for sending) - type 'quit' to exit")
    thread_id = get_thread_id()
    config = {"configurable": {"thread_id": thread_id}}
    state = {"messages": [], "next_action": "", "tool_calls": [], "final_answer": ""}
    
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "quit":
            break
        
        current_input = {"messages": [HumanMessage(content=user_input)]}
        
        # Run graph until completion or interrupt
        while True:
            # We don't use try/except because app.invoke catches the interrupt internally
            state = app.invoke(current_input, config=config)
            
            # Check if the graph paused (interrupted)
            state_snapshot = app.get_state(config)
            if state_snapshot.next:
                # Graph is paused! Get the interrupt data
                # In LangGraph 0.6, interrupt data is stored in the task
                interrupts = state_snapshot.tasks[0].interrupts
                if interrupts:
                    interrupt_data = interrupts[0].value
                    print(f"\n[System] {interrupt_data.get('question', 'Approve?')}")
                    decision = input("> ")
                    current_input = Command(resume=decision)
                    continue # Loop back and invoke with the resume command
                else:
                    # Paused but no interrupt data? Shouldn't happen here.
                    break
            else:
                # Graph finished successfully
                break
        
        # Print final answer
        if state.get("final_answer"):
            print(f"\nAssistant: {state['final_answer']}")
        else:
            print(f"\nAssistant: {state['messages'][-1].content}")

if __name__ == "__main__":
    main()