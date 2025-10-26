// models/user.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Handles CRUD operations and authentication helper methods
 */
const User = {
  // Create a new user
  async create({ first_name, last_name, username, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (first_name, last_name, username, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, last_name, username, is_member, is_admin;
    `;
    const values = [first_name, last_name, username, hashedPassword];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Find user by email/username
  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  },

  // Find user by ID
  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Update membership status
  async updateMembership(id, is_member) {
    const query = `
      UPDATE users SET is_member = $1 WHERE id = $2 RETURNING *;
    `;
    const { rows } = await pool.query(query, [is_member, id]);
    return rows[0];
  },

  // Update admin status
  async updateAdmin(id, is_admin) {
    const query = `
      UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING *;
    `;
    const { rows } = await pool.query(query, [is_admin, id]);
    return rows[0];
  },

  // Validate user password
  async validatePassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  },
};

module.exports = User;
