from Module9_HnadsOn.langgraph_agent.agent_simple import app
from langchain_core.messages import HumanMessage

def main():
    print("TODO Assistant (Simple) - type 'quit' to exit")
    state = {"messages": []}
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "quit":
            break
        state["messages"].append(HumanMessage(content=user_input))
        final_state = app.invoke(state)
        state = final_state
        last_msg = state["messages"][-1]
        print(f"\nAssistant: {last_msg.content}")

if __name__ == "__main__":
    main()