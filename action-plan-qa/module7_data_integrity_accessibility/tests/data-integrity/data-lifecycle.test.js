// import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
// import { pool } from '../../config/db-config.js';
// import setupDatabase from '../../scripts/setup-test-db.js';
// import teardownDatabase from '../../scripts/teardown-test-db.js';
// import { truncateAllTables, executeQuery } from '../../utils/db-utils.js';

// describe('Data Lifecycle', () => {
//   beforeAll(async () => {
//     await setupDatabase();
//   });

//   afterAll(async () => {
//     await teardownDatabase();
//     await pool.end();
//   });

//   test('Isolation: test data should be clean between runs', async () => {
//     const users = await executeQuery(pool, 'SELECT COUNT(*) FROM users');
//     expect(parseInt(users[0].count)).toBe(4);
//     const transactions = await executeQuery(pool, 'SELECT COUNT(*) FROM transactions');
//     expect(parseInt(transactions[0].count)).toBe(7);
//   });

//   test('Teardown should clean tables completely', async () => {
//     await truncateAllTables();
//     const users = await executeQuery(pool, 'SELECT COUNT(*) FROM users');
//     expect(parseInt(users[0].count)).toBe(0);
//     const transactions = await executeQuery(pool, 'SELECT COUNT(*) FROM transactions');
//     expect(parseInt(transactions[0].count)).toBe(0);
//   });

//   test('Ephemeral DB: fresh seed after setup', async () => {
//     await setupDatabase();
//     const users = await executeQuery(pool, 'SELECT COUNT(*) FROM users');
//     expect(parseInt(users[0].count)).toBe(4);
//   });
// });


import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { pool } from '../../config/db-config.js';
import setupDatabase from '../../scripts/setup-test-db.js';
import teardownDatabase from '../../scripts/teardown-test-db.js';
import { truncateAllTables, executeQuery } from '../../utils/db-utils.js';

beforeAll(async () => {
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase(); // this already closes the pool
});

describe('Data Lifecycle', () => {
  test('Isolation: test data should be clean between runs', async () => {
    const users = await executeQuery(pool, 'SELECT COUNT(*) FROM users');
    expect(parseInt(users[0].count)).toBe(4);
    const transactions = await executeQuery(pool, 'SELECT COUNT(*) FROM transactions');
    expect(parseInt(transactions[0].count)).toBe(7);
  });

  test('Teardown should clean tables completely', async () => {
    await truncateAllTables();
    const users = await executeQuery(pool, 'SELECT COUNT(*) FROM users');
    expect(parseInt(users[0].count)).toBe(0);
    const transactions = await executeQuery(pool, 'SELECT COUNT(*) FROM transactions');
    expect(parseInt(transactions[0].count)).toBe(0);
  });

  test('Ephemeral DB: fresh seed after setup', async () => {
    await setupDatabase(); // re-seed
    const users = await executeQuery(pool, 'SELECT COUNT(*) FROM users');
    expect(parseInt(users[0].count)).toBe(4);
  });
});