// config/db.js
require('dotenv').config();
const { Pool } = require('pg');

// Create a single shared connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Optional: Log a confirmation message when connected
pool.on('connect', () => {
  console.log('🟢 PostgreSQL connected');
});

// Optional: Handle errors globally
pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL error', err);
  process.exit(-1);
});

module.exports = pool;