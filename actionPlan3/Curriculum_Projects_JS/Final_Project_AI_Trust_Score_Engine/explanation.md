# Final Capstone: The AI Trust-Score Engine (Ollama)

## What
This capstone combines the earlier modules into a single trust scoring engine. It computes a composite trust score for AI outputs by measuring faithfulness, hallucination risk, and security resilience.

## Why
A composite trust score enables QA teams to assess overall model quality with a single metric and report. It helps compare model variants, track regressions, and make deployment decisions based on multiple quality dimensions.

## How
- `trust_engine.js` imports `evaluateFaithfulness` from Module 1 and `evaluateHallucination` from Module 2.
- It defines a local `SecurityScanner` to detect adversarial injection patterns, representing Module 3.
- `computeCompositeScore(question, answer, context)` calculates:
  - `faithfulness` from Ollama,
  - `antiHallucination` as `1 - hallucinationScore`,
  - `securityScore` from the local scanner.
- The scores are weighted as `0.4` faithfulness, `0.3` anti-hallucination, and `0.3` security.
- `batchEvaluate()` processes `full_golden_dataset.json` and `generateReport()` writes `final_report.json`.

## Run
- Start Ollama locally: `ollama serve`
- Execute the engine: `npm run final`

## QA Impact
This module consolidates evaluation into one report, making it easier to verify trustworthiness across factual accuracy, hallucination control, and adversarial robustness.
