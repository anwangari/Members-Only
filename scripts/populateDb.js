require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function populateDatabase() {
  try {
    console.log('🚀 Starting database setup...');

    // Drop existing tables
    await pool.query(`
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('✅ Dropped existing tables');

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
    console.log('✅ Created users table');

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
    console.log('✅ Created messages table');

    // Hash passwords
    const hash1 = await bcrypt.hash('password123', 10);
    const hash2 = await bcrypt.hash('password123', 10);
    const hash3 = await bcrypt.hash('password123', 10);

    // Insert sample users
    const userResult = await pool.query(`
      INSERT INTO users (first_name, last_name, username, password_hash, is_member, is_admin)
      VALUES
        ('Alice', 'Johnson', 'alice@example.com', $1, false, false),
        ('Bob', 'Smith', 'bob@example.com', $2, true, false),
        ('Charlie', 'Admin', 'charlie@example.com', $3, true, true)
      RETURNING id;
    `, [hash1, hash2, hash3]);
    console.log('✅ Created sample users');

    // Insert sample messages
    await pool.query(`
      INSERT INTO messages (user_id, title, text)
      VALUES
        ($1, 'Welcome!', 'Hello everyone! Excited to be part of this community.'),
        ($2, 'First Post', 'This is my first message as a member!'),
        ($3, 'Admin Note', 'Welcome to the Members Only club. Please keep discussions respectful.');
    `, [userResult.rows[0].id, userResult.rows[1].id, userResult.rows[2].id]);
    console.log('✅ Created sample messages');

    console.log('\n🎉 Database populated successfully!');
    console.log('\nSample accounts:');
    console.log('1. alice@example.com / password123 (Regular user)');
    console.log('2. bob@example.com / password123 (Member)');
    console.log('3. charlie@example.com / password123 (Admin)');
    console.log('\nClub passcode: secret123');
    console.log('Admin passcode: admin123\n');

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
    console.log('🔴 Database connection closed');
  }
}

populateDatabase();