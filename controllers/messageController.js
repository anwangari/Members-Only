const Message = require('../models/message');

// GET all messages
exports.index = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.render('index', { title: 'Members Only', messages });
  } catch (err) {
    res.render('error', { message: 'Could not load messages.' });
  }
};

// GET new message form
exports.new_message_get = (req, res) => {
  res.render('new_message', { title: 'Create Message' });
};

// POST new message
exports.new_message_post = async (req, res) => {
  const { title, text } = req.body;
  try {
    await Message.create({ user_id: req.user.id, title, text });
    req.flash('success_msg', 'Message created!');
    res.redirect('/');
  } catch (err) {
    res.render('error', { message: 'Could not create message.' });
  }
};

// DELETE message (admin only)
exports.delete_message = async (req, res) => {
  try {
    await Message.delete(req.params.id);
    req.flash('success_msg', 'Message deleted.');
    res.redirect('/');
  } catch (err) {
    res.render('error', { message: 'Failed to delete message.' });
  }
};