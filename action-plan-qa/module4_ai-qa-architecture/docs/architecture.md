# AI-Augmented QA Architecture Overview

The system consists of four modules:

1. **Test Maintenance Engine** – uses LLM to fix broken tests.
2. **Self-Healing Locators** – AI fallback for broken selectors.
3. **CI/CD Gap Analysis** – classifies failures and detects coverage gaps.
4. **Snapshot Auto-Fixer** – automatically updates snapshots based on AI analysis.

## Workflow

1. Test fails in CI.
2. Failure artifacts (logs, screenshots, DOM) are captured.
3. AI modules analyse and decide:
   - Fix the test → generate PR.
   - Heal locator → update locator repository.
   - Classify failure → post comment.
   - Update snapshot → commit new baseline.
4. Human review optional; AI suggestions are explainable.

All modules are integrated via a FastAPI backend and triggered by GitHub Actions.

```mermaid
flowchart TD
    A[Test Fails] --> B[Gather Artifacts]
    B --> C[AI Analysis]
    C --> D{Classification}
    D -->|Flaky| E[Add Retry]
    D -->|Locator Break| F[Heal Locator]
    D -->|UI Change| G[Update Snapshot]
    D -->|Bug| H[Flag for Review]
    E --> I[Re-run Tests]
    F --> I
    G --> I
    H --> J[Create Ticket]