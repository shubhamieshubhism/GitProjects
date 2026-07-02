# Module9_HnadsOn Documentation

## Project Overview

`Module9_HnadsOn` is a Python-based TODO assistant project demonstrating how to build an MCP-enabled agent workflow with `langgraph`, `langchain_ollama`, and an MCP tool server. The repository includes both a simple LangGraph-based assistant and a separate MCP server that exposes TODO management tools.

The main idea is:
- `mcp_server/server.py` runs an MCP tool server with TODO operations backed by SQLite
- `langgraph_agent/` contains agent definitions and tool wrappers that use the MCP server
- `main_simple.py` and `langgraph_agent/main.py` are interactive CLI entry points for running the assistant

## Project Structure & File Purposes

### Top-level files

- `requirements.txt`
  - Lists the Python dependencies required by the project:
    - `mcp`
    - `langgraph`
    - `langchain-ollama`
    - `langchain-core`

- `main_simple.py`
  - A simple interactive TODO assistant CLI.
  - Uses `Module9_HnadsOn.langgraph_agent.agent_simple.app` directly to invoke the LangGraph workflow.
  - Accepts user input and prints assistant responses in a loop.

- `langgraph_agent.py`
  - A top-level agent version of the TODO assistant.
  - Builds a LangGraph workflow that uses MCP-connected tools defined in `langgraph_agent/mcp_tools.py`.
  - Demonstrates an alternate integration path for tool-enabled agent execution.

- `client.py`
  - A standalone async MCP client example.
  - Spawns `server.py`, lists available tools, adds TODOs, lists them, deletes one, and re-lists tasks.
  - Useful as a reference for how to call MCP tools from Python.

- `final_working/final_todo.py`
  - A working example of an async MCP client that exercises the TODO tool server.
  - Adds tasks, lists tasks, deletes a task, and prints results.
  - This file demonstrates the expected tool call lifecycle.

### `langgraph_agent/`

- `langgraph_agent/agent_simple.py`
  - Defines the core LangGraph workflow for the TODO assistant.
  - Creates a `StateGraph` with a single agent node and a `ToolNode` for task actions.
  - Uses `ChatOllama` and a chat prompt to generate responses.
  - Binds tool functions from `langgraph_agent.tools_simple`.

- `langgraph_agent/main.py`
  - Provides an interactive CLI entry point for the `langgraph_agent` package.
  - Repeatedly prompts the user for input and prints the assistant's answer.
  - Looks up the compiled `app` workflow from `langgraph_agent`.

- `langgraph_agent/tools_simple.py`
  - Defines local tool wrappers for TODO actions used by the simple agent.
  - Likely includes `add_todo_tool`, `list_todos_tool`, and `delete_todo_tool`.
  - These tool wrappers are connected directly to the `ToolNode` in `agent_simple.py`.

- `langgraph_agent/mcp_tools.py`
  - Defines tool wrappers using `langchain_core.tools.tool` decorators.
  - Uses `MCPTodoClient` to call the remote MCP server tools.
  - Provides `add_todo()`, `list_todos()`, and `delete_todo(todo_id)` functions.

- `langgraph_agent/mcp_client.py`
  - A synchronous wrapper around an async MCP client.
  - Starts an MCP stdio client in a background thread and keeps it alive.
  - Provides a `call_tool(name, arguments)` method that invokes relative MCP tools.
  - Used by `langgraph_agent/mcp_tools.py` to communicate with `mcp_server/server.py`.

### `mcp_server/`

- `mcp_server/server.py`
  - Implements the MCP tool server named `todo-server`.
  - Uses SQLite to store tasks in `todos.db`.
  - Defines three tools:
    - `add_todo` — add a task string to the database
    - `list_todos` — retrieve all tasks with IDs and completion status
    - `delete_todo` — delete a task by integer ID
  - Starts the MCP server over stdio when run directly.

- `mcp_server/__init__.py`
  - An empty package marker file.
  - Allows `mcp_server` to be imported as a Python package.

- `mcp_server/todos.db`
  - SQLite database file used by the server to persist TODO data.
  - Created automatically when `server.py` initializes.

### Tests

- `tests/run_echo.py`
  - Likely a minimal test / example for an echo-style agent or tool.

- `tests/test_agent.py`
  - Presumably contains unit tests for agent behavior.

- `tests/echo_agent.py`
  - Likely sample code for an echo agent.

- `tests/test_llm.py`
  - Presumably contains tests validating LLM integration.

- `tests/test_tools.py`
  - Presumably contains tests for tool execution and tool wrappers.

## How to Run the Project

### Prerequisites

- Python 3.11+ / 3.13+ recommended
- `pip` package manager
- Optional: create and use a Python virtual environment
- No `Dockerfile` or `docker-compose.yml` is present in this repository

### Setup Steps

1. Clone or open the repository:
   ```bash
   cd /Users/techverito/llmprojects/Module9_HnadsOn
   ```

2. Create a virtual environment (recommended):
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt
   ```

4. Confirm `python` points to the intended interpreter. If you are using the `.venv`, it should be:
   ```bash
   which python
   # /Users/techverito/llmprojects/Module9_HnadsOn/.venv/bin/python
   ```

### Running the MCP Tool Server

The MCP server provides the TODO management tools used by the agent.

```bash
cd /Users/techverito/llmprojects/Module9_HnadsOn/mcp_server
python server.py
```

This will create or open `todos.db` and keep the tool server running.

### Running the Simple CLI Assistant

In a second terminal, run:

```bash
cd /Users/techverito/llmprojects/Module9_HnadsOn
python main_simple.py
```

This launches a simple interactive assistant that uses the local LangGraph workflow.

### Running the MCP-backed LangGraph Assistant

In another terminal, ensure the MCP server is running, then execute:

```bash
cd /Users/techverito/llmprojects/Module9_HnadsOn
python langgraph_agent/main.py
```

This CLI uses `langgraph_agent` and the MCP tool wrappers in `langgraph_agent/mcp_tools.py` to call the server.

### Running the MCP Client Example

`client.py` and `final_working/final_todo.py` demonstrate direct async MCP client usage.

```bash
cd /Users/techverito/llmprojects/Module9_HnadsOn
python client.py
```

or:

```bash
python final_working/final_todo.py
```

Both scripts start the server over stdio, call `list_tools`, add tasks, list tasks, and delete a task.

## Verify the Project is Working

- When running `python main_simple.py` or `python langgraph_agent/main.py`, the app should prompt:
  - `TODO Assistant (Simple) - type 'quit' to exit`
  - `TODO Assistant (MCP + LangGraph) - type 'quit' to exit`
- Enter any TODO-related command and confirm the assistant prints a response.
- When running `python client.py` or `python final_working/final_todo.py`, the script should print the available MCP tools and list TODO tasks.
- Confirm `mcp_server/todos.db` is created and updated when adding or deleting TODOs.

## Notes and Caveats

- There is no `README.md` or environment example file in this repository.
- The project depends on local MCP and LangChain/Ollama packages, so ensure those are available and compatible with your Python interpreter.
- The `.venv/` directory is already present in the repository, but the documentation assumes a fresh virtual environment may be created.
- `mcp_server/server.py` must be running before using the MCP-backed agent or client examples.

## Key Execution Paths

- `main_simple.py` → direct LangGraph workflow via `langgraph_agent.agent_simple.app`
- `langgraph_agent/main.py` → MCP tool-wrapped LangGraph workflow via `langgraph_agent/mcp_tools.py`
- `client.py` / `final_working/final_todo.py` → async MCP client examples
- `mcp_server/server.py` → tool server exposing `add_todo`, `list_todos`, and `delete_todo`
