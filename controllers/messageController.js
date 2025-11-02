const { body, validationResult } = require('express-validator');
const Message = require('../models/message');

exports.index = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.render('index', { 
      title: 'Members Only', 
      messages 
    });
  } catch (err) {
    console.error(err);
    res.render('error', { 
      title: 'Error', 
      message: 'Could not load messages' 
    });
  }
};

exports.new_message_get = (req, res) => {
  res.render('new_message', { 
    title: 'New Message', 
    errors: [], 
    formData: {} 
  });
};

exports.new_message_post = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('text').trim().notEmpty().withMessage('Message text is required'),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('new_message', {
        title: 'New Message',
        errors: errors.array(),
        formData: req.body
      });
    }

    const { title, text } = req.body;

    try {
      await Message.create({ 
        user_id: req.user.id, 
        title, 
        text 
      });
      req.flash('success_msg', 'Message posted!');
      res.redirect('/messages');
    } catch (err) {
      console.error(err);
      res.render('error', { 
        title: 'Error', 
        message: 'Could not create message' 
      });
    }
  }
];

exports.delete_message = async (req, res) => {
  try {
    await Message.delete(req.params.id);
    req.flash('success_msg', 'Message deleted');
    res.redirect('/messages');
  } catch (err) {
    console.error(err);
    res.render('error', { 
      title: 'Error', 
      message: 'Could not delete message' 
    });
  }
};