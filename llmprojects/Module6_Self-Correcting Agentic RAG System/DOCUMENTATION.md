# Self-Correcting Agentic RAG System

This project is a Self-Correcting Agentic Retrieval-Augmented Generation (RAG) System built using LangGraph, LangChain, and Ollama. It features a conversational agent that can intelligently decide when to use a tool to look up information from a local knowledge base (a handbook) based on user queries, or when to respond directly using its internal knowledge.

## Project Structure & File Purposes

Below is the structure of the project and the purpose of each file:

```text
.
├── data
│   └── handbook.txt          # The knowledge base text file containing policies or reference information used by the RAG system.
├── nodes
│   ├── __init__.py           # Exports the nodes (llm_node, tool_node, router) for use in the graph.
│   ├── llm_node.py           # Defines the LLM node. It uses ChatOllama (llama3.1) to either respond directly to the user or request a tool call if specific keywords are detected.
│   ├── router.py             # Contains the routing logic to dictate the next step in the LangGraph execution (e.g., call a tool or end the interaction).
│   └── tool_node.py          # Executes the tool calls requested by the LLM (e.g., retrieving handbook info) and appends the results to the conversation state.
├── tools
│   ├── __init__.py           # Exports the available tools (get_handbook_info).
│   └── retriever_tool.py     # Defines the `get_handbook_info` tool. It loads `handbook.txt`, splits it, and builds a Chroma vector store with Ollama embeddings to perform similarity searches.
├── graph.py                  # Orchestrates the agent's workflow by constructing the LangGraph `StateGraph`, adding nodes (`llm`, `tool`), and defining conditional edges.
├── main.py                   # The main entry point of the application. It initializes the LangGraph app and runs an interactive CLI loop for the user.
├── requirements.txt          # Lists the Python dependencies required to run the project.
└── state.py                  # Defines the `State` type using Python's `TypedDict`, which tracks the conversation history, tool calls, tool results, and other metadata across graph nodes.
```

## How to Run the Project

### Prerequisites

To run this project, you need the following installed on your system:
- **Python 3.8+**
- **Ollama**: You must have Ollama installed and running locally.
- **Ollama Models**: Pull the required language and embedding models by running:
  ```bash
  ollama pull llama3.1
  ollama pull nomic-embed-text
  ```

### Step-by-Step Setup

1. **Clone or Navigate to the Project**
   Open your terminal and navigate to the project directory:
   ```bash
   cd "Module6_Self-Correcting Agentic RAG System"
   ```

2. **Create a Virtual Environment**
   It is recommended to use a virtual environment to manage dependencies:
   ```bash
   python -m venv .venv
   ```

3. **Activate the Virtual Environment**
   - On **macOS/Linux**:
     ```bash
     source .venv/bin/activate
     ```
   - On **Windows**:
     ```bash
     .venv\Scripts\activate
     ```

4. **Install Dependencies**
   Install the required Python packages from `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```

### Commands to Run

To start the interactive agent CLI, simply run the `main.py` entry point:

```bash
python main.py
```

### How to Verify It's Working

1. Once you run the command, you should see the prompt:
   `Self‑Correcting RAG (Step 2) - type 'quit' to exit`
   `You: `
2. **Test Direct LLM Response**: Ask a general question (e.g., "Hello, how are you?"). The agent should respond directly without using the retriever tool.
3. **Test Tool Execution**: Ask a question containing specific keywords that trigger the retriever tool (e.g., "Tell me about the Avengers" or "What is the policy for John Wick?"). The console should display `[Calling tool: get_handbook_info]` followed by the retrieved information from `handbook.txt`.
4. **Exit**: Type `quit` to exit the interactive loop.
