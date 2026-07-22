# Module 01: RAG Evaluation (Ollama)

## What
This module implements a Retrieval-Augmented Generation (RAG) faithfulness evaluator using a local Ollama model as an automated judge. It checks whether a generated answer is grounded in a given retrieval context, preventing unsupported or invented facts.

## Why
Faithfulness is a critical metric for QA and knowledge-grounded applications. Even a coherent answer can be dangerous if it introduces details not supported by the source context. This module helps QA builders detect and reduce factual drift in model responses.

## How
- `rag_faithfulness_eval.js` loads environment settings from `../.env` and calls the Ollama chat API.
- `callOllama(prompt)` sends a deterministic prompt to the local Ollama server.
- `evaluateFaithfulness(question, answer, context)` builds a prompt instructing the judge to return only a numeric score from `0.0` to `1.0`.
- The module interprets the score and treats results `>= 0.7` as passing faithfulness.
- `runFaithfulnessTest()` demonstrates the flow using a sample retrieval context about Albert Einstein.

## Run
- Start Ollama locally: `ollama serve`
- Pull the model if needed: `ollama pull llama3`
- Execute the module: `npm run module1`

## QA Impact
This module is useful for validating that answers are evidence-backed, making it easier to qualify an LLM system for factual tasks and retrieval-augmented outputs.
