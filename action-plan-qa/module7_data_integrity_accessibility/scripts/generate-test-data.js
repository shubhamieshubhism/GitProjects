import { pool } from '../config/db-config.js';

export const testUsers = [
  { id: 1, email: 'alice@example.com', balance: 1000.00 },
  { id: 2, email: 'bob@example.com', balance: 500.00 },
  { id: 3, email: 'charlie@example.com', balance: 2000.00 },
  { id: 4, email: 'diana@example.com', balance: 750.00 }
];

export const testTransactions = [
  { id: 1, user_id: 1, amount: 200.00, type: 'credit' },
  { id: 2, user_id: 2, amount: 100.00, type: 'debit' },
  { id: 3, user_id: 1, amount: 50.00, type: 'debit' },
  { id: 4, user_id: 3, amount: 300.00, type: 'credit' },
  { id: 5, user_id: 4, amount: 75.00, type: 'debit' },
  { id: 6, user_id: 2, amount: 150.00, type: 'credit' },
  { id: 7, user_id: 3, amount: 100.00, type: 'debit' }
];

export async function seedDatabase() {
  for (const user of testUsers) {
    await pool.query(
      'INSERT INTO users (id, email, balance) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
      [user.id, user.email, user.balance]
    );
  }
  for (const tx of testTransactions) {
    await pool.query(
      'INSERT INTO transactions (id, user_id, amount, type) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
      [tx.id, tx.user_id, tx.amount, tx.type]
    );
  }
  console.log('✅ Test data seeded successfully.');
}

export default { testUsers, testTransactions, seedDatabase };
