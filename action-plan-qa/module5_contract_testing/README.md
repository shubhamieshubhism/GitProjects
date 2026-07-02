# Module 5: Advanced Service & Contract Testing

This module demonstrates robust API validation and microservice integration using consumer-driven contracts, OpenAPI validation, functional testing, and gRPC.

## Setup
1. `npm install`
2. `npm run start:product` (starts the product service)
3. Run tests:
   - `npm run test:pact` – runs Pact consumer & provider verification
   - `npm run test:functional` – REST/GraphQL/gRPC functional tests
   - `npm run test:openapi` – validates API against OpenAPI spec

## Exercises Covered
- ✅ Consumer-Driven Contract (Pact) between E‑Store frontend and Product API
- ✅ OpenAPI schema validation
- ✅ CI/CD quality gates (GitHub Actions)
- ✅ REST & GraphQL functional testing (status codes, idempotency, pagination, rate limiting)
- ✅ gRPC unary & streaming examples
- ✅ OAuth2/JWT/API Keys authentication flows (see functional tests)

## Pact Workflow
1. Consumer writes tests → generates Pact file
2. Provider verifies Pact file → ensures compliance
3. Pact Broker stores contracts (optional)

## CI Integration
The GitHub Actions workflow runs all checks on every push.

## Resources
- [Pact Documentation](https://docs.pact.io/)
- [OpenAPI Specification](https://swagger.io/specification/)