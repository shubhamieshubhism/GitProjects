# AI-Augmented QA Architecture

This project provides a comprehensive AI-driven testing assistant with four core modules:
- **Test Maintenance Engine**: Auto-fixes broken tests using LLM.
- **Self-Healing Locators**: AI-powered fallback locators.
- **CI/CD Gap Analysis**: Failure classification and coverage gaps.
- **Snapshot Auto-Fixer**: Flaky test healing via visual AI.

See each module's documentation in the `src/` folder.

## Setup

1. Clone the repo.
2. Copy `.env.example` to `.env` and add your `ANTHROPIC_API_KEY`.
3. Run `docker-compose up -d`.
4. Access the API at `http://localhost:8000/docs`.

## Usage

- Use the `/api/maintenance/fix` endpoint to submit a broken test.
- Integrate the GitHub Actions workflows into your repository.

## License

MIT