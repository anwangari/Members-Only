// models/message.js
const pool = require('../config/db');

/**
 * Message Model
 * Handles CRUD operations for messages
 */
const Message = {
  // Create a new message
  async create({ user_id, title, text }) {
    const query = `
      INSERT INTO messages (user_id, title, text)
      VALUES ($1, $2, $3)
      RETURNING id, title, text, created_at, user_id;
    `;
    const values = [user_id, title, text];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Get all messages
  async findAll() {
    const query = `
      SELECT m.*, u.first_name, u.last_name
      FROM messages m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Get message by ID
  async findById(id) {
    const query = `
      SELECT m.*, u.first_name, u.last_name
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Delete a message (admin only)
  async delete(id) {
    const query = 'DELETE FROM messages WHERE id = $1 RETURNING id;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },
};

module.exports = Message;