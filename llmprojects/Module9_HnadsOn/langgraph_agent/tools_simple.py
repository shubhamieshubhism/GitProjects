# # _todos = []

# # def add_todo(task: str) -> str:
# #     _todos.append(task)
# #     return f"Added TODO: {task}. Now {len(_todos)} tasks."

# # def list_todos() -> str:
# #     if not _todos:
# #         return "No TODOs found."
# #     return "\n".join(f"{i+1}. [ ] {task}" for i, task in enumerate(_todos))

# # def delete_todo(index: int) -> str:
# #     if 1 <= index <= len(_todos):
# #         removed = _todos.pop(index-1)
# #         return f"Deleted TODO: {removed}"
# #     return f"Error: TODO #{index} not found."

# # from langchain_core.tools import tool
# # add_todo_tool = tool(add_todo)
# # list_todos_tool = tool(list_todos)
# # delete_todo_tool = tool(delete_todo)


# _todos = []

# def add_todo(task: str) -> str:
#     """Add a new TODO task."""
#     _todos.append(task)
#     return f"Added TODO: {task}. Now {len(_todos)} tasks."

# def list_todos() -> str:
#     """List all current TODO tasks."""
#     if not _todos:
#         return "No TODOs found."
#     return "\n".join(f"{i+1}. [ ] {task}" for i, task in enumerate(_todos))

# def delete_todo(index: int) -> str:
#     """Delete a TODO by its number (1-indexed)."""
#     if 1 <= index <= len(_todos):
#         removed = _todos.pop(index-1)
#         return f"Deleted TODO: {removed}"
#     return f"Error: TODO #{index} not found."

# from langchain_core.tools import tool
# add_todo_tool = tool(add_todo)
# list_todos_tool = tool(list_todos)
# delete_todo_tool = tool(delete_todo)

_todos = []

# def add_todo(task: str) -> str:
#     """Add a new TODO task."""
#     _todos.append(task)
#     return f"✅ Added TODO: '{task}'. Now you have {len(_todos)} task(s)."

def add_todo(task) -> str:
    """Add a new TODO task."""
    # Handle case where argument is {'type': 'string', 'value': '...'}
    if isinstance(task, dict) and 'value' in task:
        task = task['value']
    elif isinstance(task, dict) and 'type' == 'string' and 'value' in task:
        task = task['value']
    _todos.append(task)
    return f"✅ Added TODO: '{task}'. Now you have {len(_todos)} task(s)."

def list_todos() -> str:
    """List all current TODO tasks."""
    if not _todos:
        return "📭 No TODOs found. Add one with 'add task...'."
    result = "📋 Your TODOs:\n"
    for i, task in enumerate(_todos):
        result += f"{i+1}. [ ] {task}\n"
    return result

def delete_todo(index: int) -> str:
    """Delete a TODO by its number (1-indexed)."""
    if 1 <= index <= len(_todos):
        removed = _todos.pop(index-1)
        return f"🗑️ Deleted TODO: '{removed}'. Remaining: {len(_todos)} task(s)."
    return f"❌ Error: TODO #{index} not found."

from langchain_core.tools import tool
add_todo_tool = tool(add_todo)
list_todos_tool = tool(list_todos)
delete_todo_tool = tool(delete_todo)