import { pool, getClient } from '../config/db-config.js';

export async function beginTransaction(client) {
  await client.query('BEGIN');
}

export async function rollbackTransaction(client) {
  await client.query('ROLLBACK');
}

export async function commitTransaction(client) {
  await client.query('COMMIT');
}

export async function withTransaction(callback) {
  const client = await getClient();
  try {
    await beginTransaction(client);
    const result = await callback(client);
    await rollbackTransaction(client);
    return result;
  } finally {
    client.release();
  }
}

export async function executeQuery(client, query, params = []) {
  const result = await client.query(query, params);
  return result.rows;
}

export async function getTableNames() {
  const result = await pool.query(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
  `);
  return result.rows.map(row => row.tablename);
}

export async function truncateAllTables() {
  const tables = await getTableNames();
  if (tables.length === 0) return;
  const query = `TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE;`;
  await pool.query(query);
}
