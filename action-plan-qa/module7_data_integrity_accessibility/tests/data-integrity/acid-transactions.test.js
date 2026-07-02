// // // // import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
// // // // import { pool, getClient } from '../../config/db-config.js';
// // // // import setupDatabase from '../../scripts/setup-test-db.js';
// // // // import teardownDatabase from '../../scripts/teardown-test-db.js';
// // // // import { withTransaction, executeQuery } from '../../utils/db-utils.js';

// // // // beforeAll(async () => {
// // // //   await setupDatabase();
// // // // });

// // // // afterAll(async () => {
// // // //   await teardownDatabase();
// // // //   await pool.end();
// // // // });

// // // // describe('ACID Transactions', () => {
// // // //   test('Atomicity: failed transaction should roll back all changes', async () => {
// // // //     await withTransaction(async (client) => {
// // // //       const initialBalance = await executeQuery(client, 'SELECT balance FROM users WHERE id = $1', [1]);
// // // //       const initialAmount = parseFloat(initialBalance[0].balance);
// // // //       try {
// // // //         await executeQuery(client, "UPDATE users SET balance = balance - 1000 WHERE id = 1 AND balance >= 1000");
// // // //         throw new Error('Simulated failure after partial update');
// // // //       } catch (e) {}
// // // //       const finalBalance = await executeQuery(client, 'SELECT balance FROM users WHERE id = $1', [1]);
// // // //       expect(parseFloat(finalBalance[0].balance)).toBe(initialAmount);
// // // //     });
// // // //   });

// // // //   test('Consistency: foreign key constraints are enforced', async () => {
// // // //     await withTransaction(async (client) => {
// // // //       await expect(
// // // //         executeQuery(client, 'INSERT INTO transactions (id, user_id, amount, type) VALUES (999, 999, 100, 'credit')')
// // // //       ).rejects.toThrow();
// // // //     });
// // // //   });

// // // //   test('Isolation: concurrent transactions should not interfere', async () => {
// // // //     const client1 = await getClient();
// // // //     const client2 = await getClient();
// // // //     try {
// // // //       await client1.query('BEGIN');
// // // //       await client2.query('BEGIN');
// // // //       const res1 = await client1.query('SELECT balance FROM users WHERE id = 2');
// // // //       const balance1 = parseFloat(res1.rows[0].balance);
// // // //       await client1.query('UPDATE users SET balance = balance + 100 WHERE id = 2');
// // // //       const res2 = await client2.query('SELECT balance FROM users WHERE id = 2');
// // // //       const balance2 = parseFloat(res2.rows[0].balance);
// // // //       expect(balance2).toBe(balance1);
// // // //       await client1.query('COMMIT');
// // // //       await client2.query('COMMIT');
// // // //       const final = await pool.query('SELECT balance FROM users WHERE id = 2');
// // // //       const finalBalance = parseFloat(final.rows[0].balance);
// // // //       expect(finalBalance).toBe(balance1 + 100);
// // // //     } finally {
// // // //       client1.release();
// // // //       client2.release();
// // // //     }
// // // //   });

// // // //   test('Durability: data persists after transaction commit', async () => {
// // // //     await withTransaction(async (client) => {
// // // //       await executeQuery(client, 'UPDATE users SET balance = balance + 50 WHERE id = 3');
// // // //       await client.query('COMMIT');
// // // //       const result = await executeQuery(client, 'SELECT balance FROM users WHERE id = 3');
// // // //       expect(parseFloat(result[0].balance)).toBe(2050.00);
// // // //     });
// // // //   });
// // // // });


// // // import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
// // // import { pool, getClient } from '../../config/db-config.js';
// // // import setupDatabase from '../../scripts/setup-test-db.js';
// // // import teardownDatabase from '../../scripts/teardown-test-db.js';
// // // import { withTransaction, executeQuery } from '../../utils/db-utils.js';

// // // beforeAll(async () => {
// // //   await setupDatabase();
// // // });

// // // afterAll(async () => {
// // //   await teardownDatabase();
// // // });

// // // describe('ACID Transactions', () => {
// // //   test('Atomicity: failed transaction should roll back all changes', async () => {
// // //     await withTransaction(async (client) => {
// // //       const initialBalance = await executeQuery(client, 'SELECT balance FROM users WHERE id = $1', [1]);
// // //       const initialAmount = parseFloat(initialBalance[0].balance);
// // //       try {
// // //         await executeQuery(client, "UPDATE users SET balance = balance - 1000 WHERE id = 1 AND balance >= 1000");
// // //         throw new Error('Simulated failure after partial update');
// // //       } catch (e) {}
// // //       const finalBalance = await executeQuery(client, 'SELECT balance FROM users WHERE id = $1', [1]);
// // //       expect(parseFloat(finalBalance[0].balance)).toBe(initialAmount);
// // //     });
// // //   });

// // //   test('Consistency: foreign key constraints are enforced', async () => {
// // //     await withTransaction(async (client) => {
// // //       await expect(
// // //         executeQuery(client, "INSERT INTO transactions (id, user_id, amount, type) VALUES (999, 999, 100, 'credit')")
// // //       ).rejects.toThrow();
// // //     });
// // //   });

// // //   test('Isolation: concurrent transactions should not interfere', async () => {
// // //     const client1 = await getClient();
// // //     const client2 = await getClient();
// // //     try {
// // //       await client1.query('BEGIN');
// // //       await client2.query('BEGIN');
// // //       const res1 = await client1.query('SELECT balance FROM users WHERE id = 2');
// // //       const balance1 = parseFloat(res1.rows[0].balance);
// // //       await client1.query('UPDATE users SET balance = balance + 100 WHERE id = 2');
// // //       const res2 = await client2.query('SELECT balance FROM users WHERE id = 2');
// // //       const balance2 = parseFloat(res2.rows[0].balance);
// // //       expect(balance2).toBe(balance1);
// // //       await client1.query('COMMIT');
// // //       await client2.query('COMMIT');
// // //       const final = await pool.query('SELECT balance FROM users WHERE id = 2');
// // //       const finalBalance = parseFloat(final.rows[0].balance);
// // //       expect(finalBalance).toBe(balance1 + 100);
// // //     } finally {
// // //       client1.release();
// // //       client2.release();
// // //     }
// // //   });

// // //   test('Durability: data persists after transaction commit', async () => {
// // //     await withTransaction(async (client) => {
// // //       await executeQuery(client, 'UPDATE users SET balance = balance + 50 WHERE id = 3');
// // //       await client.query('COMMIT');
// // //       const result = await executeQuery(client, 'SELECT balance FROM users WHERE id = 3');
// // //       expect(parseFloat(result[0].balance)).toBe(2050.00);
// // //     });
// // //   });
// // // });

// // import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
// // import { pool, getClient } from '../../config/db-config.js';
// // import setupDatabase from '../../scripts/setup-test-db.js';
// // import teardownDatabase from '../../scripts/teardown-test-db.js';
// // import { withTransaction, executeQuery } from '../../utils/db-utils.js';

// // beforeAll(async () => {
// //   await setupDatabase();
// // });

// // afterAll(async () => {
// //   await teardownDatabase();
// // });

// // describe('ACID Transactions', () => {
// //   test('Atomicity: failed transaction should roll back all changes', async () => {
// //     await withTransaction(async (client) => {
// //       // Check initial balance for user 1 (should be 1000)
// //       const initialBalance = await executeQuery(client, 'SELECT balance FROM users WHERE id = $1', [1]);
// //       const initialAmount = parseFloat(initialBalance[0].balance);
// //       // Perform a partial update (e.g., subtract 100)
// //       await executeQuery(client, 'UPDATE users SET balance = balance - 100 WHERE id = 1');
// //       // Simulate a failure after the update
// //       throw new Error('Simulated failure after partial update');
// //     });
// //     // After the transaction is rolled back, verify that the balance is unchanged
// //     const finalBalance = await pool.query('SELECT balance FROM users WHERE id = $1', [1]);
// //     expect(parseFloat(finalBalance.rows[0].balance)).toBe(1000);
// //   });

// //   test('Consistency: foreign key constraints are enforced', async () => {
// //     await withTransaction(async (client) => {
// //       await expect(
// //         executeQuery(client, "INSERT INTO transactions (id, user_id, amount, type) VALUES (999, 999, 100, 'credit')")
// //       ).rejects.toThrow();
// //     });
// //   });

// //   test('Isolation: concurrent transactions should not interfere', async () => {
// //     const client1 = await getClient();
// //     const client2 = await getClient();
// //     try {
// //       await client1.query('BEGIN');
// //       await client2.query('BEGIN');
// //       const res1 = await client1.query('SELECT balance FROM users WHERE id = 2');
// //       const balance1 = parseFloat(res1.rows[0].balance);
// //       await client1.query('UPDATE users SET balance = balance + 100 WHERE id = 2');
// //       const res2 = await client2.query('SELECT balance FROM users WHERE id = 2');
// //       const balance2 = parseFloat(res2.rows[0].balance);
// //       // Snapshot isolation: client2 should still see the old balance
// //       expect(balance2).toBe(balance1);
// //       await client1.query('COMMIT');
// //       await client2.query('COMMIT');
// //       const final = await pool.query('SELECT balance FROM users WHERE id = 2');
// //       const finalBalance = parseFloat(final.rows[0].balance);
// //       expect(finalBalance).toBe(balance1 + 100);
// //     } finally {
// //       client1.release();
// //       client2.release();
// //     }
// //   });

// //   test('Durability: data persists after transaction commit', async () => {
// //     await withTransaction(async (client) => {
// //       await executeQuery(client, 'UPDATE users SET balance = balance + 50 WHERE id = 3');
// //       await client.query('COMMIT');
// //       const result = await executeQuery(client, 'SELECT balance FROM users WHERE id = 3');
// //       expect(parseFloat(result[0].balance)).toBe(2050.00);
// //     });
// //   });
// // });

// import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
// import { pool, getClient } from '../../config/db-config.js';
// import setupDatabase from '../../scripts/setup-test-db.js';
// import teardownDatabase from '../../scripts/teardown-test-db.js';
// import { withTransaction, executeQuery } from '../../utils/db-utils.js';

// beforeAll(async () => {
//   await setupDatabase();
// });

// afterAll(async () => {
//   await teardownDatabase();
// });

// describe('ACID Transactions', () => {
//   test('Atomicity: failed transaction should roll back all changes', async () => {
//     // Perform a transaction that updates and then fails
//     try {
//       await withTransaction(async (client) => {
//         await executeQuery(client, 'UPDATE users SET balance = balance - 100 WHERE id = 1');
//         throw new Error('Simulated failure after partial update');
//       });
//     } catch (e) {
//       // Expected error – we ignore it because we want to verify rollback
//     }

//     // After the transaction is rolled back, verify that the balance is unchanged
//     const finalBalance = await pool.query('SELECT balance FROM users WHERE id = $1', [1]);
//     expect(parseFloat(finalBalance.rows[0].balance)).toBe(1000);
//   });

//   test('Consistency: foreign key constraints are enforced', async () => {
//     await withTransaction(async (client) => {
//       await expect(
//         executeQuery(client, "INSERT INTO transactions (id, user_id, amount, type) VALUES (999, 999, 100, 'credit')")
//       ).rejects.toThrow();
//     });
//   });

//   test('Isolation: concurrent transactions should not interfere', async () => {
//     const client1 = await getClient();
//     const client2 = await getClient();
//     try {
//       await client1.query('BEGIN');
//       await client2.query('BEGIN');
//       const res1 = await client1.query('SELECT balance FROM users WHERE id = 2');
//       const balance1 = parseFloat(res1.rows[0].balance);
//       await client1.query('UPDATE users SET balance = balance + 100 WHERE id = 2');
//       const res2 = await client2.query('SELECT balance FROM users WHERE id = 2');
//       const balance2 = parseFloat(res2.rows[0].balance);
//       expect(balance2).toBe(balance1); // snapshot isolation
//       await client1.query('COMMIT');
//       await client2.query('COMMIT');
//       const final = await pool.query('SELECT balance FROM users WHERE id = 2');
//       const finalBalance = parseFloat(final.rows[0].balance);
//       expect(finalBalance).toBe(balance1 + 100);
//     } finally {
//       client1.release();
//       client2.release();
//     }
//   });

//   test('Durability: data persists after transaction commit', async () => {
//     await withTransaction(async (client) => {
//       await executeQuery(client, 'UPDATE users SET balance = balance + 50 WHERE id = 3');
//       await client.query('COMMIT');
//       const result = await executeQuery(client, 'SELECT balance FROM users WHERE id = 3');
//       expect(parseFloat(result[0].balance)).toBe(2050.00);
//     });
//   });
// });

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { pool, getClient } from '../../config/db-config.js';
import setupDatabase from '../../scripts/setup-test-db.js';
import teardownDatabase from '../../scripts/teardown-test-db.js';
import { executeQuery } from '../../utils/db-utils.js';

beforeAll(async () => {
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
});

describe('ACID Transactions', () => {
  test('Atomicity: failed transaction should roll back all changes', async () => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE users SET balance = balance - 100 WHERE id = 1');
      // Simulate a failure
      throw new Error('Simulated failure');
    } catch (e) {
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
    // Verify balance unchanged
    const result = await pool.query('SELECT balance FROM users WHERE id = 1');
    expect(parseFloat(result.rows[0].balance)).toBe(1000);
  });

  test('Consistency: foreign key constraints are enforced', async () => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      await expect(
        client.query("INSERT INTO transactions (id, user_id, amount, type) VALUES (999, 999, 100, 'credit')")
      ).rejects.toThrow();
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  });

  test('Isolation: concurrent transactions should not interfere', async () => {
    const client1 = await getClient();
    const client2 = await getClient();
    try {
      await client1.query('BEGIN');
      await client2.query('BEGIN');
      const res1 = await client1.query('SELECT balance FROM users WHERE id = 2');
      const balance1 = parseFloat(res1.rows[0].balance);
      await client1.query('UPDATE users SET balance = balance + 100 WHERE id = 2');
      const res2 = await client2.query('SELECT balance FROM users WHERE id = 2');
      const balance2 = parseFloat(res2.rows[0].balance);
      expect(balance2).toBe(balance1); // snapshot isolation
      await client1.query('COMMIT');
      await client2.query('COMMIT');
      const final = await pool.query('SELECT balance FROM users WHERE id = 2');
      const finalBalance = parseFloat(final.rows[0].balance);
      expect(finalBalance).toBe(balance1 + 100);
    } finally {
      client1.release();
      client2.release();
    }
  });

  test('Durability: data persists after transaction commit', async () => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE users SET balance = balance + 50 WHERE id = 3');
      await client.query('COMMIT');
      const result = await pool.query('SELECT balance FROM users WHERE id = 3');
      expect(parseFloat(result.rows[0].balance)).toBe(2050.00);
    } finally {
      client.release();
    }
  });
});