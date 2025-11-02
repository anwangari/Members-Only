const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create({ first_name, last_name, username, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, username, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, username, is_member, is_admin`,
      [first_name, last_name, username, hashedPassword]
    );
    return result.rows[0];
  },

  async findByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async updateMembership(id, is_member) {
    const result = await pool.query(
      'UPDATE users SET is_member = $1 WHERE id = $2 RETURNING *',
      [is_member, id]
    );
    return result.rows[0];
  },

  async updateAdmin(id, is_admin) {
    const result = await pool.query(
      'UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING *',
      [is_admin, id]
    );
    return result.rows[0];
  }
};

module.exports = User;