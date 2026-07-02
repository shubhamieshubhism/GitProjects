# Summary: Structured Tool-Calling Agent (LangGraph)

## Project Overview
Built a single‑agent system that can decide when to use tools (weather, calculator), call them safely, and produce structured outputs – using only LangGraph and an LLM (Ollama). No high‑level agent frameworks; all logic is implemented from scratch.

---

## Step 1 – Basic Graph with a Single LLM Node
- **Concepts:** StateGraph, state schema (messages), nodes, edges, START/END.
- **Code:** `state.py`, `graph.py`, `nodes/llm_node.py`, `main.py`.
- **Outcome:** An interactive assistant that answers general questions directly (no tools).

## Step 2 – Add Tool Calling (LLM outputs JSON)
- **Concepts:** Tool calling via structured JSON output; router node; tool executor.
- **Code:** `tools/weather.py` (mock API), `nodes/tool_node.py`, `nodes/router.py`.
- **Outcome:** Agent detects "weather" keyword, outputs JSON tool call, tool executes, result returned.

## Step 3 – Add Calculator Tool & Validation
- **Concepts:** Multiple tools; input validation; error handling.
- **Code:** `tools/calculator.py` (safe eval with restricted namespace).
- **Outcome:** Agent handles both weather and math queries; invalid expressions return safe errors.

## Step 4 – Self‑Correction Loop & Iteration Limit
- **Concepts:** Graph loop (`tool → llm`); iteration counter; tool result messages.
- **Code:** Modified `graph.py`, `llm_node.py`, `tool_node.py`.
- **Outcome:** After tool execution, the agent returns to LLM to process the result, then ends. Iteration limit (5) prevents infinite loops.

## Step 5 – Structured Output Parsing
- **Concepts:** Pydantic schemas; `PydanticOutputParser`; forced JSON output.
- **Code:** `schemas.py` (FinalAnswer model); updated `llm_node.py` final answer branch.
- **Outcome:** Final answers are structured with `answer`, `confidence`, optional `sources`.

## Step 6 – Logging, Tracing, and Error Recovery
- **Concepts:** Python logging; tracing agent decisions; error logging.
- **Code:** `utils/logger.py`; added log statements in `llm_node.py` and `tool_node.py`.
- **Outcome:** Full trace of each turn saved to `agent.log`, plus console output for debugging.

---

## Final Project Structure

```text
structured_tool_agent/
├── requirements.txt
├── main.py
├── state.py
├── graph.py
├── schemas.py
├── utils/
│   └── logger.py
├── nodes/
│   ├── __init__.py
│   ├── llm_node.py
│   ├── tool_node.py
│   └── router.py
└── tools/
    ├── __init__.py
    ├── weather.py
    └── calculator.py

## Key Achievements
- ✅ Agent can call multiple tools (weather, calculator) based on user intent.
- ✅ Tools are validated and errors are caught.
- ✅ Graph loops back to LLM after tool execution (self‑correction).
- ✅ Iteration limit prevents infinite loops.
- ✅ Final answers are structured JSON (confidence, answer, sources).
- ✅ Full logging and tracing for production monitoring.

## Running the Final System

```bash
pip install -r requirements.txt
ollama serve      # in a separate terminal
python main.py

You: what is the weather in Paris?
Tool result: Weather in Paris: 22°C, sunny.

You: calculate 10*5 + 2
Tool result: Result: 52

You: what is the capital of Nepal?
Assistant: The capital of Nepal is Kathmandu.

