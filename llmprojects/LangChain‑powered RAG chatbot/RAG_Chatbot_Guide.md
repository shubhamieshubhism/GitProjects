# RAG Chatbot with LangChain, Ollama, and Memory – Complete Documentation

This document provides everything you need to build and run a **local, free, production‑ready RAG (Retrieval-Augmented Generation) chatbot**. It uses **Ollama** for LLMs, **Chroma** for vector storage, and **LangChain** for orchestration. No API keys required.

## Features

- Answer questions from your own documents (TXT, PDF, DOCX, MD, CSV)
- Conversation memory (remembers last 3 exchanges)
- Source citations (shows which document and page the answer came from)
- Web search fallback (DuckDuckGo) when no answer is found in documents
- Terminal and Gradio web interface
- Switch between different Ollama models at runtime
- Export chat history to a file

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Installation](#2-installation)
3. [Step-by-Step Code Files](#3-step-by-step-code-files)
   - [config.py](#configpy)
   - [model.py](#modelpy)
   - [prompt.py](#promptpy)
   - [memory.py](#memorypy)
   - [vector_store.py](#vector_storepy)
   - [web_search.py](#web_searchpy)
   - [chain.py](#chainpy)
   - [main.py (terminal)](#mainpy-terminal)
   - [gradio_app.py (web UI)](#gradio_apppy-web-ui)
4. [Requirements.txt](#requirements-txt)
5. [How to Run](#how-to-run)
6. [Troubleshooting](#troubleshooting)

---

## 1. Project Structure

Create the following folder and file layout:
my_rag_chatbot/
├── data/ # Place your documents here (.txt, .pdf, .docx, .md, .csv)
├── src/
│ ├── init.py (empty file)
│ ├── config.py
│ ├── model.py
│ ├── prompt.py
│ ├── memory.py
│ ├── vector_store.py
│ ├── web_search.py
│ ├── chain.py
│ ├── main.py
│ └── gradio_app.py
├── requirements.txt
└── chroma_db/ (auto‑created – do not modify)


---

## 2. Installation

### 2.1 Install Ollama

Download and install Ollama from [ollama.com](https://ollama.com). Then pull a model:

```bash
ollama pull llama2

Create requirements.txt with the content shown in section 5. Then run:
pip3 install -r requirements.txt

Create each file inside the src/ folder as described.

src/__init__.py
Empty file – marks the directory as a Python package.

# From the project root (my_rag_chatbot/)
python3 -m src.main --model llama2

python3 -m src.gradio_app

Then open the URL shown (usually http://127.0.0.1:7860).

Issue	                Solution
ModuleNotFoundError 	Run pip install -r requirements.txt again.
Ollama                  connection error	Ensure Ollama is running (ollama serve in the background).
Vector                  store creation fails	Delete the chroma_db/ folder and re‑run.
Slow                    responses	Use a smaller model (e.g., phi) or reduce num_predict in model.py.
No                      answer from documents	Check that your documents are placed inside the data/ folder and are not empty.
Web                     search not working	Install duckduckgo-search and check your internet connection.