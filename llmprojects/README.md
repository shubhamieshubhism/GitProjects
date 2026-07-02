# llmprojects

A multi-project workspace for AI, retrieval-augmented generation (RAG), and LangChain-style experimentation.

## Overview
This repository contains a set of independent Python-based AI prototypes and lab projects that explore conversational agents, knowledge retrieval, tool-enabled workflows, and advanced RAG architectures.

## Workspace Projects
Each folder in the workspace is a separate prototype or module. Most projects include their own local README and dependency list.

- `FinanceOrlegal domain expert using embeddings + RAG`
  - A finance/legal expert assistant with embedded knowledge retrieval and a LangGraph-style workflow.
- `Hybrid Retrieval QA`
  - A hybrid retrieval-based question answering system.
- `LangChain‑powered RAG chatbot`
  - A chatbot prototype built on LangChain and RAG principles.
- `Module3/`
  - Educational module or lab focused on RAG and AI workflows.
- `Module4_.../`
  - Series of module folders exploring structured conversational RAG and tool-enabled agents.
- `Module5_.../`
  - More advanced agent workflow experiments and stateful multi-agent orchestration.
- `Module6_.../`
  - Self-correcting and tool-calling RAG system experiments.
- `Module8_Advanced & Production RAG(practicle work)/`
  - Advanced production-oriented RAG experimentation.
- `Module9_HnadsOn/`
  - Hands-on experimentation with RAG or agent workflows.
- `Tool-enabled LangChain agent/`
  - A focused project for LangChain agents that call external tools.

## Getting Started
Because this is a workspace of separate projects, there is no single top-level runtime. Instead, choose the project you want to run and follow its local setup instructions.

### General steps
1. Change into the project directory:
   ```bash
   cd '/Users/techverito/llmprojects/FinanceOrlegal domain expert using embeddings + RAG'
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install the project dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Read the local `README.md` or `DOCUMENTATION.md` for project-specific details.

## Example: Run the Finance/Legal RAG Expert
```bash
cd 'FinanceOrlegal domain expert using embeddings + RAG'
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

## Structure and Expectations
- Each project is self-contained and typically includes:
  - `main.py` or another entry point
  - `requirements.txt`
  - project-specific documentation
- This workspace is intended for research, experimentation, and learning rather than production deployment.
- Some projects rely on local model runtimes or external tools such as Ollama.

## Tips
- Use `ls` to inspect the files in each subdirectory.
- Open individual project documentation before running code.
- Keep each project's virtual environment isolated to avoid dependency conflicts.

## Contributing
If you add a new experiment or module:
- Add a short README in the new folder.
- Document setup and usage steps.
- Keep dependencies local to the module.

## License
No license is specified at the workspace root. Add a `LICENSE` file if you want to make this repository reusable by others.
