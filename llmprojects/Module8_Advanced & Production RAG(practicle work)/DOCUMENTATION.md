# Project Documentation: Advanced & Production RAG

This project implements an advanced Retrieval-Augmented Generation (RAG) system designed for enterprise applications. It uses a graph-based state machine (via LangGraph) to orchestrate a complex pipeline including multi-query retrieval, hybrid search, cross-encoder reranking, LLM-based context compression, and answer verification.

## 1. Project Structure & File Purposes

Below is an overview of the directories and important files in this project:

```text
Module8_Advanced & Production RAG(practicle work)/
├── data/
│   └── enterprise.txt         # The main knowledge base/document used for RAG
├── embedding_cache/           # Local cache for embeddings to speed up development
├── nodes/                     # Contains individual steps (nodes) of the LangGraph workflow
│   ├── __init__.py
│   ├── compressor_node.py     # Extracts only relevant sentences from retrieved docs using an LLM
│   ├── llm_node.py            # Generates the final answer using the compressed context
│   ├── reranker_node.py       # Re-scores and filters docs using a Cross-Encoder and metadata
│   ├── retriever_node.py      # Performs Multi-Query expansion and Hybrid (Dense+Sparse) Retrieval
│   └── verifier_node.py       # Fact-checks the final answer against context to prevent hallucinations
├── utils/
│   └── embeddings.py          # Configures the embedding model (nomic-embed-text) and caching
├── architecture.md            # Detailed system architecture, diagrams, and design decisions
├── graph.py                   # Orchestration layer: wires the nodes together into a StateGraph
├── main.py                    # Application entry point: initializes cache and runs the interactive CLI loop
├── requirements.txt           # Python dependencies required to run the project
└── state.py                   # Defines the State TypedDict passed between LangGraph nodes
```

### Key Components

*   **`main.py`**: The main entry point. It sets up in-memory LLM caching and initiates the `while True` loop to interact with the user via the terminal.
*   **`graph.py`**: Defines the workflow execution order: `Retriever -> Reranker -> Compressor -> LLM -> Verifier`.
*   **`state.py`**: Defines the schema for the data passing through the system, including `messages`, `retrieved_docs`, `context`, `compressed_context`, and `hallucination_detected`.
*   **`nodes/`**: Each Python file here represents an independent step in the RAG pipeline. This modular approach allows for easy swapping or upgrading of individual RAG techniques (e.g., swapping the reranker model).

---

## 2. How to Run the Project

### Prerequisites
1.  **Python 3.9+** installed on your machine.
2.  **Ollama**: You must have [Ollama](https://ollama.com/) installed and running locally.
3.  **Local Models**: Pull the required models in Ollama before running the code.
    ```bash
    ollama run llama3.1
    ollama pull nomic-embed-text
    ```

### Step-by-Step Setup

1.  **Navigate to the project directory**:
    ```bash
    cd "Module8_Advanced & Production RAG(practicle work)"
    ```

2.  **Create and activate a virtual environment** (recommended):
    ```bash
    # On macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    
    # On Windows
    python -m venv venv
    venv\Scripts\activate
    ```

3.  **Install the dependencies**:
    ```bash
    pip3 install -r requirements.txt
    ```

4.  **Prepare the Data**:
    *   Ensure the `data` directory exists and contains a text file named `enterprise.txt`.
    *   *Note: If `enterprise.txt` is missing, you must create it and add some text so the system has a knowledge base to query against.*

### Commands to Run

To start the interactive RAG application, simply execute the main script:

```bash
python3 main.py
```

### How to Verify It’s Working

1.  When you run `python main.py`, you should see startup messages indicating that the imports were successful and the models/vector store are loading.
2.  You will be presented with a prompt:
    ```text
    You:
    ```
3.  Type a question related to the content inside `data/enterprise.txt` (e.g., "What is the primary policy mentioned in the document?").
4.  *First Run Note:* The first query may take a little longer as ChromaDB embeds the document chunks, the cross-encoder model downloads from HuggingFace, and models are loaded into memory.
5.  You should see extensive debug logs detailing the retrieval, reranking, compression, and verification steps.
6.  Finally, you will receive an answer from the `Assistant:`.
7.  Type `quit` to exit the application.
