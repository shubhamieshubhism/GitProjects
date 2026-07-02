from Module9_HnadsOn.langgraph_agent.tools_simple import add_todo, list_todos, delete_todo

print("=== Testing TODO tools ===")
print(add_todo("Buy milk"))
print(add_todo("Write report"))
print(list_todos())
print(delete_todo(1))
print(list_todos())