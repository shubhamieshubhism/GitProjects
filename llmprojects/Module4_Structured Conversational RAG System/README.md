# Structured Conversational Agentic RAG System

This project is an advanced, agentic AI assistant capable of answering user queries by retrieving context from internal company documents or falling back to live web searches. It uses LangGraph for state management, Chroma for local vector storage, and Ollama (or OpenAI) for language modeling.

## Prerequisites

Before running the project, ensure you have the following installed:
1. **Python 3.9+**
2. **Ollama**: For running local LLMs and embeddings. Download it from [ollama.com](https://ollama.com).

## Setup Instructions

### 1. Install Python Dependencies
First, make sure you are in the project directory, then install the required packages:
```bash
pip3 install -r requirements.txt
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the project (if you haven't already). Depending on whether you want to use local Ollama models or OpenAI, configure the following:

**For Ollama (Local - Default):**
```env
MODEL_PROVIDER=ollama
OLLAMA_MODEL=llama3.1
OLLAMA_EMBEDDINGS=nomic-embed-text
```

*(Optional) For Web Search Support:*
If you want the agent to be able to search the web, sign up for a free API key at [Tavily](https://tavily.com/) and add it to your `.env` file:
```env
TAVILY_API_KEY=your_tavily_api_key
```

### 3. Pull Required Local Models
If you are using Ollama, you must pull the specific language and embedding models before running the app. Open a new terminal window and run:

```bash
# Pull the language model
ollama pull llama3.1

# Pull the embedding model for Chroma DB
ollama pull nomic-embed-text
```

Ensure the Ollama application is running in the background.

## Running the Application

To start the interactive AI assistant, run the main Python script:

```bash
python3 main.py
```

### How to Use
1. Once the application starts, it will assign you a **Session ID** (which is saved to a local `thread_id.txt` file). This allows the assistant to remember your conversation history across reboots.
2. Type your question at the `You:` prompt and press Enter. 
3. The agent will automatically decide whether to search the internal handbook (using the vector database) or search the web to answer your question.
4. Type `quit` to exit the application.
