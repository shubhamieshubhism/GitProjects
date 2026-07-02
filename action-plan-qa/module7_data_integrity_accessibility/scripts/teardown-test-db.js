// import { pool, closePool } from '../config/db-config.js';

// async function teardownDatabase() {
//   console.log('🔄 Tearing down test database...');
//   await pool.query('DROP TABLE IF EXISTS transactions CASCADE');
//   await pool.query('DROP TABLE IF EXISTS users CASCADE');
//   console.log('✅ Database teardown complete.');
//   await closePool();
// }

// if (import.meta.url === `file://${process.argv[1]}`) {
//   teardownDatabase().catch(console.error);
// }

// export default teardownDatabase;


import { pool, closePool } from '../config/db-config.js';

async function teardownDatabase() {
  console.log('🔄 Tearing down test database...');
  await pool.query('DROP TABLE IF EXISTS transactions CASCADE');
  await pool.query('DROP TABLE IF EXISTS users CASCADE');
  console.log('✅ Database teardown complete.');
  await closePool(); // Close the pool after teardown
}

if (import.meta.url === `file://${process.argv[1]}`) {
  teardownDatabase().catch(console.error);
}

export default teardownDatabase;