from langgraph_agent import app
from langchain_core.messages import HumanMessage

def main():
    print("TODO Assistant (MCP + LangGraph) - type 'quit' to exit")
    state = {"messages": []}
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "quit":
            break
        state["messages"].append(HumanMessage(content=user_input))
        final_state = app.invoke(state)
        state = final_state
        # Print the last AI message (the final answer)
        last_msg = state["messages"][-1]
        if hasattr(last_msg, "content"):
            print(f"\nAssistant: {last_msg.content}")
        else:
            print(f"\nAssistant: {last_msg}")

if __name__ == "__main__":
    main()