# Module 04: Evaluation Pipelines (Ollama)

## What
This module implements a CI/CD-style quality gate using Jest and a local Ollama judge model. It evaluates answer relevancy and demonstrates how automated pipelines can enforce acceptable model behavior.

## Why
Continuous evaluation is crucial for maintaining model quality. This module provides a repeatable gate that can fail builds when model outputs drift or become irrelevant, supporting safer iteration.

## How
- `quality_gate.test.js` contains Jest tests that call a local Ollama model to score answer relevancy.
- `evaluateRelevancy(question, answer)` asks Ollama to return a numeric score between `0.0` and `1.0`.
- The good-answer test expects a score of `>= 0.8`.
- The second test intentionally uses an irrelevant response to demonstrate how a bad model output can be detected and warned.

## Run
- Start Ollama locally: `ollama serve`
- Execute the pipeline check: `npm run module4`

## QA Impact
This module shows how to integrate automated LLM evaluation into a test suite, making it easier to catch relevance regressions and enforce quality thresholds.
