require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function populateDatabase() {
  try {
    console.log('Starting database setup...');

    // Drop tables if they exist
    await pool.query(`
      DROP TABLE IF EXISTS messages;
      DROP TABLE IF EXISTS users;
    `);

    // Create users table
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_member BOOLEAN DEFAULT false,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create messages table
    await pool.query(`
      CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created');

    // Create sample users
    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('password123', 10);
    const password3 = await bcrypt.hash('password123', 10);

    const users = await pool.query(`
      INSERT INTO users (first_name, last_name, username, password_hash, is_member, is_admin)
      VALUES
        ('Alice', 'Johnson', 'alice@example.com', $1, false, false),
        ('Bob', 'Smith', 'bob@example.com', $2, true, false),
        ('Charlie', 'Brown', 'charlie@example.com', $3, true, true)
      RETURNING id;
    `, [password1, password2, password3]);

    console.log('Users created');

    // Create sample messages
    await pool.query(`
      INSERT INTO messages (user_id, title, text)
      VALUES
        ($1, 'Welcome!', 'Hello everyone! Excited to be here.'),
        ($2, 'My first post', 'This is my first message as a member!'),
        ($3, 'Admin message', 'Welcome to the club. Keep it respectful!');
    `, [users.rows[0].id, users.rows[1].id, users.rows[2].id]);

    console.log('Messages created');
    console.log('\nDatabase populated successfully!');
    console.log('\nTest accounts:');
    console.log('alice@example.com / password123 (user)');
    console.log('bob@example.com / password123 (member)');
    console.log('charlie@example.com / password123 (admin)');
    console.log('\nPasscodes:');
    console.log('Club: secret123');
    console.log('Admin: admin123');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

populateDatabase();