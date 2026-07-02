# Project Documentation: Tool-Enabled Agentic RAG System

## 1. Project Structure & File Purposes

The project is structured as a modular LangGraph application. Here is a breakdown of the key files and directories:

```text
Module4_Tool-Enabled Agentic RAG System/
├── main.py                 # Main entry point. Handles the terminal CLI loop, user input, and persistent memory (Session ID).
├── graph.py                # Defines the LangGraph StateMachine. Wires together nodes (agent, tools) and edges.
├── state.py                # Defines the `State` dictionary schema used to track conversation history, tool calls, and ReAct scratchpad.
├── requirements.txt        # Python dependencies (langgraph, langchain-ollama, chromadb, etc.).
├── data/                   # Directory containing internal data sources.
│   └── handbook.txt        # The internal company handbook used as the primary knowledge base.
├── nodes/                  # Directory containing LangGraph nodes.
│   ├── __init__.py         # Exports the node functions.
│   ├── agent_node.py       # The ReAct Agent node. Evaluates state, formulates prompts for Ollama, and parses actions (tool calls).
│   ├── router.py           # Conditional logic to route the graph to either execute a tool or end the turn.
│   └── tools_node.py       # Executes requested tools safely and appends the observations back to the state scratchpad.
└── tools/                  # Directory containing the executable tool functions.
    ├── __init__.py         # Exports the available tools.
    ├── handbook_search.py  # Internal retrieval tool. Uses ChromaDB and Ollama embeddings to search `handbook.txt`.
    └── web_search.py       # External retrieval tool. Uses Wikipedia and DuckDuckGo APIs for general web search.
```

## 2. How to Run the Project

### Prerequisites
- **Python 3.9+**: Required for LangChain and LangGraph compatibility.
- **pip**: Python package manager.
- **Ollama**: A local LLM runner. Must be installed and running in the background. Download from [ollama.com](https://ollama.com/).

### Step-by-Step Setup

**1. Clone or Navigate to the Project**
Open your terminal and navigate to the project directory:
```bash
cd "/Users/techverito/llmprojects/Module4_Tool-Enabled Agentic RAG System"
```

**2. Install Dependencies**
Install the required Python packages using pip:
```bash
pip3 install -r requirements.txt
```

**3. Set Up Environment Variables (Optional)**
If you wish to configure a different model provider or API keys in the future, you can create a `.env` file in the root directory:
```env
# .env
MODEL_PROVIDER=ollama
OLLAMA_MODEL=llama3.1
OLLAMA_EMBEDDINGS=nomic-embed-text
```

**4. Pull Local Models**
Since this system operates entirely locally for privacy, you must pull the specific language and embedding models via Ollama:
```bash
ollama pull llama3.1
ollama pull nomic-embed-text
```

### Running the Application (Development/Production)

Once dependencies are installed and Ollama is running locally, you can start the application:

```bash
python3 main.py
```

### How to Verify It’s Working

1. When you run `main.py`, you should see the welcome message: `🤖 Agentic RAG (Final) - type 'quit' to exit` along with a generated `Session ID`.
2. **Test Internal Knowledge**: Type: `"What is the vacation policy?"`
   - *Expected Behavior*: The agent should use the `handbook_search` tool, retrieve the policy from `handbook.txt`, and respond that employees get 20 days of paid leave.
3. **Test External Knowledge**: Type: `"What is the capital of France?"`
   - *Expected Behavior*: The agent should realize this isn't in the handbook, use the `web_search` tool, query Wikipedia/DuckDuckGo, and respond with "Paris".
4. **Test Memory**: Type: `"What was my previous question?"`
   - *Expected Behavior*: The agent should recall the last question asked, proving the LangGraph `MemorySaver` and `thread_id` persistent checkpointer are working correctly.
