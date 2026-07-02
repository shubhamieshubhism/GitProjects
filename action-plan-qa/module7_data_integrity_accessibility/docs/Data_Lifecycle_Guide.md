# Data Lifecycle Guide

## What is Test Data Lifecycle?
It refers to the creation, usage, and cleanup of test data in a repeatable and isolated manner.

## Our Approach

### 1. Ephemeral Database
- A fresh PostgreSQL container is spun up for each test run.
- Data is cleaned after all tests finish.

### 2. Seeding
- `setup-test-db.js` creates tables and populates with known data.
- Data is realistic and covers edge cases.

### 3. Isolation
- Each test runs inside a transaction that is rolled back.
- No test affects another.

### 4. Teardown
- `teardown-test-db.js` drops all tables after the suite.

## Scripts
- `npm run setup-db` – creates schema + seeds.
- `npm run teardown-db` – cleans everything.
- `npm run generate-data` – produces test data (used by setup).

## Benefits
- No manual cleanup.
- Tests are deterministic (same seed each run).
- Fast execution (transaction rollback is cheap).
