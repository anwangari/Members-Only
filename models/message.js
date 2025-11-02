const pool = require('../config/db');

const Message = {
  async create({ user_id, title, text }) {
    const result = await pool.query(
      `INSERT INTO messages (user_id, title, text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, title, text]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(
      `SELECT m.id, m.title, m.text, m.created_at, m.user_id,
              u.first_name, u.last_name
       FROM messages m
       JOIN users u ON m.user_id = u.id
       ORDER BY m.created_at DESC`
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT m.*, u.first_name, u.last_name
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM messages WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = Message;