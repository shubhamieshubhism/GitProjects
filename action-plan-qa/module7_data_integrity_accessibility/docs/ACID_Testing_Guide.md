# ACID Testing Guide

## What is ACID?
ACID stands for **Atomicity, Consistency, Isolation, Durability** – the four properties that guarantee reliable processing of database transactions.

## How We Test Each Property

### Atomicity
- **Goal**: Ensure that a transaction is all-or-nothing.
- **Test**: Simulate a transfer that fails mid‑way and verify no partial updates occurred.
- **Code**: See `acid-transactions.test.js` – "Atomicity" test.

### Consistency
- **Goal**: Ensure data constraints (foreign keys, checks) are enforced.
- **Test**: Try to insert invalid data (e.g., a transaction for a non‑existent user) and expect an error.
- **Code**: See `acid-transactions.test.js` – "Consistency" test.

### Isolation
- **Goal**: Concurrent transactions should not interfere.
- **Test**: Run two transactions on the same row and verify snapshot isolation works.
- **Code**: See `acid-transactions.test.js` – "Isolation" test.

### Durability
- **Goal**: Committed data survives crashes or restarts.
- **Test**: Commit a transaction, restart the DB, and verify data persists.
- **Code**: See `acid-transactions.test.js` – "Durability" test.

## Running These Tests
```bash
npm run test:integrity
```

## Key Takeaways
- Always use transactions (`BEGIN` / `ROLLBACK`) in tests.
- Test edge cases: insufficient funds, constraint violations, concurrent updates.
- Use `withTransaction` helper to ensure rollback after each test.
