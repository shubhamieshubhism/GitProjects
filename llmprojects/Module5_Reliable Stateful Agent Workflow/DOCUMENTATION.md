# Project Documentation: Reliable Stateful Agent Workflow

## 1. Project Structure & File Purposes

```text
Module5_Reliable Stateful Agent Workflow/
├── main.py                     # Main entry point. CLI loop, session management, and invokes the LangGraph app.
├── graph.py                    # Defines the LangGraph StateGraph: nodes, conditional edges, and MemorySaver checkpointer.
├── state.py                    # Defines the `State` TypedDict: messages, routing, error tracking, and HITL approval flag.
├── requirements.txt            # Python dependencies.
├── thread_id.txt               # Auto-generated file that persists the session UUID across restarts.
├── architecture.md             # System architecture documentation (Mermaid diagrams included).
└── nodes/                      # All LangGraph node functions, one per file.
    ├── __init__.py             # Exports all node functions for clean import in graph.py.
    ├── llm_node.py             # Calls Ollama LLM with Tenacity retry logic. Routes to approval or fallback.
    ├── approval_node.py        # Human-in-the-Loop (HITL): pauses graph via `interrupt()` to get user consent.
    ├── tool_node.py            # Mock tool executor. Only runs if `state["approved"] == True`.
    ├── fallback_node.py        # Safety net: returns a graceful error message when LLM retries are exhausted.
    └── router.py               # Conditional routing logic: reads `state["next_node"]` to direct graph flow.
```

### File Details

| File | Purpose |
|------|---------|
| `main.py` | Entry point. Manages the terminal loop, generates/loads `thread_id` from `thread_id.txt`, and calls `app.invoke()`. |
| `graph.py` | Assembles the `StateGraph`. Wires START → `call_llm` → router → (`approval` / `mock_tool` / `fallback` / END). Uses `MemorySaver`. |
| `state.py` | Single source of truth for graph state. Contains: `messages`, `next_node`, `error_count`, `error_message`, `approved`. |
| `nodes/llm_node.py` | Wraps `ChatOllama` with a `@retry` (Tenacity) decorator. On persistent failure, routes to `fallback`. |
| `nodes/approval_node.py` | Uses `langgraph.types.interrupt` to pause execution mid-graph, presenting the user a yes/no question. |
| `nodes/tool_node.py` | Checks the `approved` flag before running any tool. Safely aborts if the user denied consent. |
| `nodes/fallback_node.py` | Returns a friendly `AIMessage` when `error_count >= 3`, preventing crashes from surfacing to the user. |
| `nodes/router.py` | Pure routing function: maps `next_node` string values to node names or `END`. |
| `thread_id.txt` | Stores the UUID for the current conversation session, enabling state persistence via the checkpointer. |
| `requirements.txt` | Declares all Python packages needed for the project. |

---

## 2. How to Run the Project

### Prerequisites

- **Python 3.9+** — required for LangChain/LangGraph compatibility.
- **pip3** — Python 3 package manager.
- **Ollama** — local LLM runner. Must be installed and running in the background.
  - Download from [ollama.com](https://ollama.com).

---

### Step-by-Step Setup

**Step 1 — Navigate to the project directory**

```bash
cd "/Users/techverito/llmprojects/Module5_Reliable Stateful Agent Workflow"
```

**Step 2 — Install Python dependencies**

```bash
pip3 install -r requirements.txt
```

> **Note**: `tenacity` is used inside `llm_node.py` for retry logic. Install it separately if not already available:
> ```bash
> pip3 install tenacity
> ```

**Step 3 — Pull the Ollama model**

The project uses `llama3.1` for inference. Pull it via:

```bash
ollama pull llama3.1
```

Make sure the Ollama daemon is running (it typically starts automatically on macOS after installation).

**Step 4 — (Optional) Configure environment variables**

There is no `.env` file required for this project in its current state. If you extend it to use OpenAI or Tavily, create a `.env` file:

```env
# .env (optional)
OPENAI_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
```

---

### Running the Application

```bash
python3 main.py
```

You will see startup messages and the interactive prompt:

```
Starting main...
Graph imported
Imports done
Inside main()
Reliable Stateful Agent - type 'quit' to exit
About to get input...

You:
```

Type any query and press Enter. To exit, type `quit`.

---

### How to Verify It's Working

**1. Test Basic LLM Response**
```
You: Hello, how are you?
```
Expected: The agent responds directly without calling any tool.

**2. Test Retry + Fallback**
Stop the Ollama daemon (`ollama stop` or kill the process) and send a query.
Expected: After 3 failed retries with exponential backoff, you should see a graceful fallback message like:
> ⚠️ I'm having trouble right now. Please try again later.

**3. Test Human-in-the-Loop Approval**
```
You: Can you search for the latest AI news?
```
Expected: The graph pauses and asks:
```
[System] Do you approve calling the mock tool?
>
```
- Type `yes` → the mock tool runs and appends `[Mock Tool] Searching... (simulated)`.
- Type `no` → the tool is skipped with `[Tool not executed because user did not approve.]`.

**4. Test Session Persistence**
Quit the app (`quit`) and restart it with `python3 main.py`.
The same `thread_id` from `thread_id.txt` is loaded, allowing the checkpointer to restore previous state [assumption: MemorySaver resets on process restart; SQLite checkpointer needed for true cross-session persistence].
