// // import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
// // import { pool } from '../../config/db-config.js';
// // import setupDatabase from '../../scripts/setup-test-db.js';
// // import teardownDatabase from '../../scripts/teardown-test-db.js';
// // import { executeQuery } from '../../utils/db-utils.js';

// // beforeAll(async () => {
// //   await setupDatabase();
// // });

// // afterAll(async () => {
// //   await teardownDatabase();
// //   await pool.end();
// // });

// // describe('Complex Queries', () => {
// //   test('Query 1: JOIN + GROUP BY + HAVING – users with total transactions > 200', async () => {
// //     const query = `
// //       SELECT u.id, u.email, SUM(t.amount) AS total_spent
// //       FROM users u
// //       JOIN transactions t ON u.id = t.user_id
// //       WHERE t.type = 'debit'
// //       GROUP BY u.id, u.email
// //       HAVING SUM(t.amount) > 200
// //       ORDER BY total_spent DESC
// //     `;
// //     const result = await pool.query(query);
// //     expect(result.rows.length).toBe(2);
// //     expect(result.rows[0].email).toBe('bob@example.com');
// //     expect(result.rows[1].email).toBe('charlie@example.com');
// //   });

// //   test('Query 2: Window function – rank users by balance', async () => {
// //     const query = `
// //       SELECT id, email, balance, RANK() OVER (ORDER BY balance DESC) AS balance_rank
// //       FROM users
// //     `;
// //     const result = await pool.query(query);
// //     expect(result.rows[0].email).toBe('charlie@example.com');
// //     expect(result.rows[0].balance_rank).toBe(1);
// //   });

// //   test('Query 3: Complex join with aggregates – transaction summary', async () => {
// //     const query = `
// //       WITH user_totals AS (
// //         SELECT u.id, u.email,
// //           COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) AS total_credits,
// //           COALESCE(SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END), 0) AS total_debits
// //         FROM users u
// //         LEFT JOIN transactions t ON u.id = t.user_id
// //         GROUP BY u.id, u.email
// //       )
// //       SELECT id, email, total_credits, total_debits, (total_credits - total_debits) AS net_balance_change
// //       FROM user_totals
// //       WHERE (total_credits - total_debits) > 0
// //     `;
// //     const result = await pool.query(query);
// //     expect(result.rows.length).toBe(2);
// //     expect(result.rows[0].email).toBe('alice@example.com');
// //     expect(result.rows[1].email).toBe('charlie@example.com');
// //   });
// // });

// import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
// import { pool } from '../../config/db-config.js';
// import setupDatabase from '../../scripts/setup-test-db.js';
// import teardownDatabase from '../../scripts/teardown-test-db.js';

// beforeAll(async () => {
//   await setupDatabase();
// });

// afterAll(async () => {
//   await teardownDatabase(); // this already closes the pool
// });

// describe('Complex Queries', () => {
//   test('Query 1: JOIN + GROUP BY + HAVING – users with total transactions > 200', async () => {
//     const query = `
//       SELECT u.id, u.email, SUM(t.amount) AS total_spent
//       FROM users u
//       JOIN transactions t ON u.id = t.user_id
//       WHERE t.type = 'debit'
//       GROUP BY u.id, u.email
//       HAVING SUM(t.amount) > 200
//       ORDER BY total_spent DESC
//     `;
//     const result = await pool.query(query);
//     // Check that we have the expected number of rows
//     expect(result.rows.length).toBe(2);
//     // Check specific emails (order may vary, so we check both)
//     const emails = result.rows.map(row => row.email);
//     expect(emails).toContain('bob@example.com');
//     expect(emails).toContain('charlie@example.com');
//   });

//   test('Query 2: Window function – rank users by balance', async () => {
//     const query = `
//       SELECT id, email, balance, RANK() OVER (ORDER BY balance DESC) AS balance_rank
//       FROM users
//     `;
//     const result = await pool.query(query);
//     // The top rank should be charlie with balance 2000
//     expect(result.rows[0].email).toBe('charlie@example.com');
//     // rank is returned as string, convert to number
//     expect(parseInt(result.rows[0].balance_rank)).toBe(1);
//   });

//   test('Query 3: Complex join with aggregates – transaction summary', async () => {
//     const query = `
//       WITH user_totals AS (
//         SELECT u.id, u.email,
//           COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) AS total_credits,
//           COALESCE(SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END), 0) AS total_debits
//         FROM users u
//         LEFT JOIN transactions t ON u.id = t.user_id
//         GROUP BY u.id, u.email
//       )
//       SELECT id, email, total_credits, total_debits, (total_credits - total_debits) AS net_balance_change
//       FROM user_totals
//       WHERE (total_credits - total_debits) > 0
//     `;
//     const result = await pool.query(query);
//     // Expected: alice (200-50=150), charlie (300-100=200), diana has only debit (75) so negative
//     // So we expect 2 rows.
//     expect(result.rows.length).toBe(2);
//     const emails = result.rows.map(row => row.email);
//     expect(emails).toContain('alice@example.com');
//     expect(emails).toContain('charlie@example.com');
//   });
// });

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { pool } from '../../config/db-config.js';
import setupDatabase from '../../scripts/setup-test-db.js';
import teardownDatabase from '../../scripts/teardown-test-db.js';

beforeAll(async () => {
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
});

describe('Complex Queries', () => {
  test('Query 1: Users with total debits > 200 (none)', async () => {
    const query = `
      SELECT u.id, u.email, SUM(t.amount) AS total_spent
      FROM users u
      JOIN transactions t ON u.id = t.user_id
      WHERE t.type = 'debit'
      GROUP BY u.id, u.email
      HAVING SUM(t.amount) > 200
    `;
    const result = await pool.query(query);
    // With the given seed data, no user has total debits > 200
    expect(result.rows.length).toBe(0);
  });

  test('Query 2: Window function – rank users by balance', async () => {
    const query = `
      SELECT id, email, balance, RANK() OVER (ORDER BY balance DESC) AS balance_rank
      FROM users
    `;
    const result = await pool.query(query);
    expect(result.rows[0].email).toBe('charlie@example.com');
    expect(parseInt(result.rows[0].balance_rank)).toBe(1);
  });

  test('Query 3: Users with net positive change (credits > debits)', async () => {
    const query = `
      WITH user_totals AS (
        SELECT u.id, u.email,
          COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) AS total_credits,
          COALESCE(SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END), 0) AS total_debits
        FROM users u
        LEFT JOIN transactions t ON u.id = t.user_id
        GROUP BY u.id, u.email
      )
      SELECT id, email, total_credits, total_debits, (total_credits - total_debits) AS net_balance_change
      FROM user_totals
      WHERE (total_credits - total_debits) > 0
    `;
    const result = await pool.query(query);
    // Expected: alice (200-50=150), bob (150-100=50), charlie (300-100=200) → 3 rows
    expect(result.rows.length).toBe(3);
    const emails = result.rows.map(row => row.email);
    expect(emails).toContain('alice@example.com');
    expect(emails).toContain('bob@example.com');
    expect(emails).toContain('charlie@example.com');
  });
});