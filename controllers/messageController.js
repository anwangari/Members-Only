const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

// GET all messages
exports.index = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.render('index', { title: 'Members Only', messages });
  } catch (err) {
    console.error('Error loading messages:', err);
    res.render('error', { title: 'Error', message: 'Could not load messages.' });
  }
};

// GET new message form
exports.new_message_get = (req, res) => {
  res.render('new_message', { title: 'Create Message' });
};

// POST new message
exports.new_message_post = [
  // Validation middleware
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 150 }).withMessage('Title must be 150 characters or less'),
  body('text')
    .trim()
    .notEmpty().withMessage('Message text is required')
    .isLength({ max: 5000 }).withMessage('Message must be 5000 characters or less'),

  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render('new_message', {
        title: 'Create Message',
        errors: errors.array(),
        formData: req.body
      });
    }

    const { title, text } = req.body;
    
    try {
      await Message.create({ user_id: req.user.id, title, text });
      req.flash('success_msg', 'Message created successfully!');
      res.redirect('/');
    } catch (err) {
      console.error('Error creating message:', err);
      res.render('error', { title: 'Error', message: 'Could not create message.' });
    }
  }
];

// DELETE message (admin only)
exports.delete_message = async (req, res) => {
  try {
    const deleted = await Message.delete(req.params.id);
    
    if (!deleted) {
      req.flash('error_msg', 'Message not found.');
      return res.redirect('/');
    }
    
    req.flash('success_msg', 'Message deleted successfully.');
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting message:', err);
    res.render('error', { title: 'Error', message: 'Failed to delete message.' });
  }
};