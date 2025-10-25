// scripts/populateDb.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function populate() {
  try {
    console.log('🚀 Starting database population...');

    // Drop and recreate tables
    await pool.query(`
      DROP TABLE IF EXISTS messages;
      DROP TABLE IF EXISTS users;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_member BOOLEAN DEFAULT false,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Tables created.');

    // Create sample users
    const password = await bcrypt.hash('password123', 10);
    const memberPass = await bcrypt.hash('memberpass', 10);
    const adminPass = await bcrypt.hash('adminpass', 10);

    const { rows: users } = await pool.query(
      `
      INSERT INTO users (first_name, last_name, username, password_hash, is_member, is_admin)
      VALUES
        ('Alice', 'Mwangi', 'alice@example.com', $1, false, false),
        ('Brian', 'Otieno', 'brian@example.com', $2, true, false),
        ('Cynthia', 'Njoroge', 'cynthia@example.com', $3, true, true)
      RETURNING id;
      `,
      [password, memberPass, adminPass]
    );

    console.log('✅ Users inserted:', users.map(u => u.id));

    // Create sample messages
    await pool.query(
      `
      INSERT INTO messages (user_id, title, text)
      VALUES
        ($1, 'Welcome to the Club', 'Glad to have joined this awesome space!'),
        ($2, 'My First Post', 'It feels great being a member.'),
        ($3, 'Admin Note', 'Please keep posts respectful and fun.');
      `,
      [users[0].id, users[1].id, users[2].id]
    );

    console.log('✅ Messages inserted.');
    console.log('🎉 Database populated successfully.');
  } catch (err) {
    console.error('❌ Error populating database:\n', err.message);
  } finally {
    await pool.end();
    console.log('🔴 Connection closed.');
  }
}

populate();
