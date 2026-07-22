# Module 02: Hallucination Detection (Ollama)

## What
This module evaluates model outputs against a golden dataset to detect hallucinations. It uses a local Ollama judge model to score whether an answer contains unsupported claims or contradictions relative to provided context.

## Why
Hallucinations are a core reliability issue for LLM systems. Detecting them with a trusted dataset enables QA teams to quantify model safety and reliability, especially when models are used in information-sensitive applications.

## How
- `hallucination_scanner.js` reads `golden_dataset.json`, which contains question/context/expected output objects.
- `callOllama(prompt)` invokes the local Ollama chat API with deterministic options.
- `evaluateHallucination(question, answer, context)` sends a prompt asking the judge to return a numeric score between `0.0` (no hallucination) and `1.0` (full hallucination).
- The script iterates over the dataset, logs each hallucination score, and computes an average hallucination rate.

## Run
- Ensure Ollama is running locally: `ollama serve`
- Pull a model if needed: `ollama pull llama3`
- Execute the module: `npm run module2`

## QA Impact
This module makes hallucination risk measurable so teams can compare model versions, identify regression, and enforce trust metrics during evaluation.
