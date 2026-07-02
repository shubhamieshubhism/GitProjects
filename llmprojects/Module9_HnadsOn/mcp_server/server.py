# # import asyncio
# # from mcp.server import Server
# # from mcp.types import Tool, TextContent
# # from mcp.server.stdio import stdio_server

# # # 1. Create the MCP server instance
# # app = Server("todo-server")

# # # 2. Define a dummy tool (we'll add real ones later)
# # @app.list_tools()
# # async def list_tools() -> list[Tool]:
# #     """Return the list of available tools."""
# #     return [
# #         Tool(
# #             name="echo",
# #             description="Echoes back the input message",
# #             inputSchema={
# #                 "type": "object",
# #                 "properties": {
# #                     "message": {"type": "string"}
# #                 },
# #                 "required": ["message"]
# #             }
# #         )
# #     ]

# # # 3. Define the handler for calling a tool
# # @app.call_tool()
# # async def call_tool(name: str, arguments: dict) -> list[TextContent]:
# #     if name == "echo":
# #         msg = arguments.get("message", "")
# #         return [TextContent(type="text", text=f"Echo: {msg}")]
# #     else:
# #         raise ValueError(f"Unknown tool: {name}")

# # # 4. Run the server using stdio transport
# # async def main():
# #     async with stdio_server() as (read_stream, write_stream):
# #         await app.run(read_stream, write_stream, app.create_initialization_options())

# # if __name__ == "__main__":
# #     asyncio.run(main())

# import asyncio
# from mcp.server import Server
# from mcp.types import Tool, TextContent
# from mcp.server.stdio import stdio_server

# # Simple in‑memory storage for TODOs
# todos = []  # list of strings

# app = Server("todo-server")

# @app.list_tools()
# async def list_tools() -> list[Tool]:
#     return [
#         Tool(
#             name="add_todo",
#             description="Add a new TODO task",
#             inputSchema={
#                 "type": "object",
#                 "properties": {
#                     "task": {"type": "string", "description": "The task to add"}
#                 },
#                 "required": ["task"]
#             }
#         )
#     ]

# @app.call_tool()
# async def call_tool(name: str, arguments: dict) -> list[TextContent]:
#     if name == "add_todo":
#         task = arguments.get("task", "")
#         if not task:
#             return [TextContent(type="text", text="Error: task cannot be empty")]
#         todos.append(task)
#         return [TextContent(type="text", text=f"Added TODO: {task}. Now {len(todos)} tasks.")]
#     else:
#         raise ValueError(f"Unknown tool: {name}")

# async def main():
#     async with stdio_server() as (read_stream, write_stream):
#         await app.run(read_stream, write_stream, app.create_initialization_options())

# if __name__ == "__main__":
#     asyncio.run(main())

import asyncio
import sqlite3
import os
from mcp.server import Server
from mcp.types import Tool, TextContent
from mcp.server.stdio import stdio_server

DB_PATH = "todos.db"

def init_db():
    """Create the todos table if it doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            done BOOLEAN DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

def add_todo_db(task: str) -> int:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO todos (task) VALUES (?)", (task,))
    conn.commit()
    last_id = c.lastrowid
    conn.close()
    return last_id

def list_todos_db() -> list:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, task, done FROM todos")
    rows = c.fetchall()
    conn.close()
    return rows

def delete_todo_db(todo_id: int) -> bool:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
    conn.commit()
    deleted = c.rowcount > 0
    conn.close()
    return deleted

# Initialize database on startup
init_db()

app = Server("todo-server")

@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="add_todo",
            description="Add a new TODO task",
            inputSchema={
                "type": "object",
                "properties": {
                    "task": {"type": "string", "description": "The task to add"}
                },
                "required": ["task"]
            }
        ),
        Tool(
            name="list_todos",
            description="List all current TODO tasks (with IDs and completion status)",
            inputSchema={"type": "object", "properties": {}}   # no arguments
        ),
        Tool(
            name="delete_todo",
            description="Delete a TODO task by its ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "todo_id": {"type": "integer", "description": "ID of the todo to delete"}
                },
                "required": ["todo_id"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "add_todo":
        task = arguments.get("task", "")
        if not task:
            return [TextContent(type="text", text="Error: task cannot be empty")]
        todo_id = add_todo_db(task)
        return [TextContent(type="text", text=f"Added TODO #{todo_id}: {task}")]
    
    elif name == "list_todos":
        todos = list_todos_db()
        if not todos:
            return [TextContent(type="text", text="No TODOs found.")]
        lines = [f"{tid}. {'[x]' if done else '[ ]'} {task}" for tid, task, done in todos]
        return [TextContent(type="text", text="\n".join(lines))]
    
    elif name == "delete_todo":
        todo_id = arguments.get("todo_id")
        if todo_id is None:
            return [TextContent(type="text", text="Error: todo_id required")]
        if delete_todo_db(todo_id):
            return [TextContent(type="text", text=f"Deleted TODO #{todo_id}")]
        else:
            return [TextContent(type="text", text=f"Error: TODO #{todo_id} not found")]
    
    else:
        raise ValueError(f"Unknown tool: {name}")

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())