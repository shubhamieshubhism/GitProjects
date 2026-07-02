import re
from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage
from typing import TypedDict, List, Union

class State(TypedDict):
    messages: List[Union[HumanMessage, AIMessage]]
    todos: List[str]

llm = ChatOllama(model="llama3.1", temperature=0)

def agent_node(state: State):
    messages = state["messages"]
    user_input = messages[-1].content
    todos = state.get("todos", [])
    
    # Format current tasks
    if todos:
        task_list = "\n".join(f"{i+1}. {t}" for i, t in enumerate(todos))
    else:
        task_list = "No tasks."
    
    prompt = f"""You are a TODO assistant. Current tasks:
{task_list}

User: {user_input}

Respond with exactly one line in one of these formats:
- ADD: <task description>
- LIST
- DELETE: <number>
- ANSWER: <your response>

Do not add any extra text outside these formats.
"""
    response = llm.invoke(prompt).content.strip()
    
    # Parse response
    if response.lower().startswith("add:"):
        task = response[4:].strip()
        todos.append(task)
        result = f"Added: '{task}'. Total: {len(todos)}"
    elif response.lower().startswith("list"):
        if not todos:
            result = "No tasks."
        else:
            result = "\n".join(f"{i+1}. {t}" for i, t in enumerate(todos))
    elif response.lower().startswith("delete:"):
        try:
            idx = int(response[7:].strip())
            if 1 <= idx <= len(todos):
                removed = todos.pop(idx-1)
                result = f"Deleted: '{removed}'. Remaining: {len(todos)}"
            else:
                result = f"Invalid index {idx}. Current tasks: {len(todos)}"
        except ValueError:
            result = "Invalid number. Use DELETE: <number>"
    else:
        # If the LLM gives a plain answer
        result = response
    
    return {"messages": [AIMessage(content=result)], "todos": todos}

graph = StateGraph(State)
graph.add_node("agent", agent_node)
graph.set_entry_point("agent")
graph.add_edge("agent", END)
app = graph.compile()

def main():
    print("TODO Manager - type 'quit' to exit")
    state = {"messages": [], "todos": []}
    while True:
        user = input("\nYou: ")
        if user.lower() == "quit":
            break
        state["messages"].append(HumanMessage(content=user))
        state = app.invoke(state)
        print(f"Assistant: {state['messages'][-1].content}")

if __name__ == "__main__":
    main()