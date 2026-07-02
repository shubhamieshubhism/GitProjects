# Multi-modal RAG (text + image + audio)

## Project Structure & File Purposes

### Root files
- `main.py`
  - Primary command-line entry point for the multi-modal RAG app.
  - Accepts text queries and media commands (`/image`, `/audio`, `/clear`).
  - Maintains conversation state and invokes the LangGraph workflow.

- `ui.py`
  - Streamlit-based web interface for chat interaction.
  - Supports image and audio upload, displays assistant responses, captions, transcripts, and retrieved context.

- `graph.py`
  - Defines the state graph using `langgraph`.
  - Connects the nodes: retriever → image processor → audio processor → LLM.
  - Compiles the workflow into `app` for invocation by `main.py` and `ui.py`.

- `requirements.txt`
  - Lists Python dependencies required to run the project.
  - Includes language model, retrieval, vision, audio, and web UI libraries.

- `state.py`
  - Defines the shared `State` model used by all graph nodes.
  - Tracks conversation messages, retrieved documents, image/audio paths, captions, and transcripts.

- `summary.md`
  - Project artifact likely used for notes or a high-level summary of the prototype.

### Directories
- `.venv/`
  - Local Python virtual environment containing the installed dependencies. Not required if you create a new environment.

- `data/`
  - Contains the local knowledge base `knowledge_base.txt`.
  - Includes example media files: `test.jpeg` and `test.wav`.

- `nodes/`
  - `nodes/retriever_node.py`: Executes retrieval over the knowledge base and stores relevant passages in state.
  - `nodes/image_processor_node.py`: Generates captions for uploaded images using BLIP.
  - `nodes/audio_processor_node.py`: Transcribes uploaded audio using Whisper.
  - `nodes/llm_node.py`: Builds the final prompt with retrieved text, image caption, and audio transcript, then invokes the LLM.

- `tools/`
  - `tools/retriever.py`: Builds and caches a Chroma vector retriever from `data/knowledge_base.txt` using Ollama embeddings.

## How to Run the Project

### Prerequisites
- Python 3.13 or compatible Python 3.x runtime. [assumption]
- `pip` package manager.
- Optional: `streamlit` for the web UI.
- Optional: Ollama runtime or compatible embedding/model backend for `langchain_ollama`.
- No Docker configuration is included in this repository.

### Setup steps
1. Clone or download the project.
2. Change to the project directory:
   ```bash
   cd '/Users/techverito/llmprojects/Multi-modal RAG (text + image + audio)'
   ```
3. Create a virtual environment:
   ```bash
   python3 -m venv .venv
   ```
4. Activate the virtual environment:
   ```bash
   source .venv/bin/activate
   ```
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the CLI app
Run the main command-line interface:
```bash
python main.py
```

- Use `/image <filename>` to load an image from the local `data/` directory or a path.
- Use `/audio <filename>` to load an audio file from `data/` or a path.
- Use `/clear` to reset the conversation state.
- Enter normal text to ask a question.

### Running the Streamlit web UI
Launch the web interface with:
```bash
streamlit run ui.py
```

- Upload an image and/or audio file using the sidebar controls.
- Type a question in the chat input.
- The assistant response will include retrieved context, captions, and transcripts when available.

### How to verify it is working
- Successful setup should allow the dependencies to install without errors.
- Running `python main.py` should start the CLI and accept queries.
- Running `streamlit run ui.py` should open a local web page with the chat interface.
- Upload `data/test.jpeg` or `data/test.wav` and verify the app returns image captions or audio transcripts.
- Confirm the model responds to text queries after retrieval.

## Notes
- There is no `README.md`, `Dockerfile`, or `docker-compose.yml` in this project.
- No `.env.example` or explicit environment variable configuration file is present.
- The project relies on local media files and a local knowledge base.
