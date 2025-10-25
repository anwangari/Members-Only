// scripts/testDatabase.js
require('dotenv').config();
const pool = require('../config/db');

(async () => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    console.log('✅ Connected to PostgreSQL successfully.');
    console.log('Current time on server:', result.rows[0].current_time);
  } catch (err) {
    console.error('❌ Database connection failed:\n', err.message);
  } finally {
    await pool.end();
    console.log('🔴 Connection closed.');
  }
})();