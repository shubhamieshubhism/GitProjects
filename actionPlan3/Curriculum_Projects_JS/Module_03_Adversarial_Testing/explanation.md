# Module 03: Adversarial Testing (Local)

## What
This module simulates adversarial prompt injection attacks against a mock AI agent to determine whether internal data or hidden persona information can be leaked.

## Why
Adversarial input is a major security concern for AI systems, especially when models are exposed to user-controlled text. Testing prompt injection and jailbreak scenarios helps QA and security teams identify weaknesses before production use.

## How
- `mock_agent.js` defines a `MockAIAgent` with a hidden persona and a guarded system prompt.
- `injection_scanner.js` creates a list of malicious payloads that attempt to override agent behavior or extract hidden information.
- For each payload, the module checks whether the agent response contains the secret `persona` value.
- It reports payloads that succeed as vulnerabilities and counts total injection failures.

## Run
- Execute locally: `npm run module3`

## QA Impact
This module validates that the system resists instruction override and sensitive-data extraction, which is essential for safe deployment of conversational agents.
