# Summary: Multi‑modal RAG (Text + Image + Audio)

## Project Overview
Built a conversational AI system that can answer questions using a text knowledge base, understand uploaded images (via BLIP captioning), and transcribe audio files (via Whisper). All orchestrated with **LangGraph** and **Ollama** (local LLM). The final system includes a terminal interface and a **Streamlit web UI**.

---

## Step-by-Step Implementation

### Step 1: Basic Graph with a Single LLM Node
- **Concept**: LangGraph state, nodes, edges, START/END.
- **Files**: `state.py`, `nodes/llm_node.py`, `graph.py`, `main.py`.
- **Outcome**: Simple text‑only chatbot that remembers conversation.

### Step 2: Add Text‑based Retriever (RAG)
- **Concept**: Vector store (Chroma) + embeddings (Ollama `nomic-embed-text`).
- **Files**: `data/knowledge_base.txt`, `tools/retriever.py`, `nodes/retriever_node.py`.
- **Outcome**: Agent retrieves relevant text chunks and uses them as context.

### Step 3: Add Image Understanding (CLIP + BLIP)
- **Concept**: Image captioning with BLIP. Convert image to text description.
- **Files**: `nodes/image_processor_node.py` (BLIP model), updated `graph.py` and `state.py`.
- **Outcome**: Assistant can describe uploaded images.

### Step 4: Add Audio Understanding (Whisper)
- **Concept**: Speech‑to‑text with OpenAI Whisper.
- **Files**: `nodes/audio_processor_node.py` (Whisper model), updated `graph.py`, `state.py`, `main.py`.
- **Outcome**: Assistant transcribes audio files and uses transcript as context.

### Step 5: Web UI (Streamlit)
- **Concept**: Interactive web interface with file upload, chat history, and real‑time responses.
- **File**: `ui.py`.
- **Outcome**: User can upload images/audio, ask questions, and see captions/transcripts alongside answers.




## How to Run (inside text block)
1. Install dependencies:
   - pip install -r requirements.txt

2. Install ffmpeg (for Whisper):
   - brew install ffmpeg          # macOS

3. Pull Ollama models:
   - ollama pull llama3.1
   - ollama pull nomic-embed-text

4. Start terminal version:
   - python main.py

5. Start web UI:
   - streamlit run ui.py
---

## Key Features (inside text block)
✅ Local LLM (Ollama) – runs offline, free.
✅ Text retrieval (RAG) from custom knowledge base.
✅ Image captioning (BLIP) – converts images to text.
✅ Audio transcription (Whisper) – converts speech to text.
✅ LangGraph orchestrates all modalities in a single stateful graph.
✅ Streamlit UI with file upload, chat history, and media preview.

## Example Interaction (Web UI) (inside text block)
1. Upload test.jpg (field with blue lights) → caption: "a field with blue lights and grass".
2. Upload test.wav (speech: "Hello, this is a test") → transcript: "hello this is a test recording".
3. Type: "What do you see and hear?"
4. Assistant: "The image shows a field with blue lights and grass. The audio says 'hello this is a test recording'."

## Final Project Structure

```text
multi_modal_rag/
├── requirements.txt
├── main.py                     # Terminal interface
├── ui.py                       # Streamlit web interface
├── state.py
├── graph.py
├── nodes/
│   ├── __init__.py
│   ├── llm_node.py
│   ├── retriever_node.py
│   ├── image_processor_node.py
│   └── audio_processor_node.py
├── tools/
│   ├── __init__.py
│   └── retriever.py
├── data/
│   ├── knowledge_base.txt
│   ├── test.jpg
│   └── test.wav
└── utils/
    └── eval.py




