import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  user: 'testuser',
  host: 'localhost',
  database: 'testdb',
  password: 'testpass',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
});

export async function getClient() {
  return await pool.connect();
}

export async function closePool() {
  await pool.end();
}
