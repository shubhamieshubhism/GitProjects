// import { pool, closePool } from '../config/db-config.js';
// import { seedDatabase } from './generate-test-data.js';

// async function setupDatabase() {
//   console.log('🔄 Setting up test database...');

//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY,
//       email TEXT UNIQUE NOT NULL,
//       balance DECIMAL(10,2) CHECK (balance >= 0)
//     )
//   `);

//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS transactions (
//       id INTEGER PRIMARY KEY,
//       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//       amount DECIMAL(10,2) NOT NULL,
//       type TEXT CHECK (type IN ('debit', 'credit'))
//     )
//   `);

//   await pool.query(`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`);

//   await seedDatabase();

//   console.log('✅ Database setup complete.');
//   await closePool();
// }

// if (import.meta.url === `file://${process.argv[1]}`) {
//   setupDatabase().catch(console.error);
// }

// export default setupDatabase;


import { pool, closePool } from '../config/db-config.js';
import { seedDatabase } from './generate-test-data.js';

async function setupDatabase() {
  console.log('🔄 Setting up test database...');

  // Drop tables if they exist to ensure a clean state (idempotent)
  await pool.query(`DROP TABLE IF EXISTS transactions CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS users CASCADE`);

  await pool.query(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      balance DECIMAL(10,2) CHECK (balance >= 0)
    )
  `);

  await pool.query(`
    CREATE TABLE transactions (
      id INTEGER PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL,
      type TEXT CHECK (type IN ('debit', 'credit'))
    )
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`);

  await seedDatabase();

  console.log('✅ Database setup complete.');
  // Do not close pool here – let the test handle it or keep it open
  // We'll close it in teardown
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase().catch(console.error);
}

export default setupDatabase;