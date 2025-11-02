const { body, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/user');

exports.signup_get = (req, res) => {
  res.render('signup', { 
    title: 'Sign Up', 
    errors: [], 
    formData: {} 
  });
};

exports.signup_post = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('username').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),

  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render('signup', {
        title: 'Sign Up',
        errors: errors.array(),
        formData: req.body
      });
    }

    const { first_name, last_name, username, password } = req.body;

    try {
      const existingUser = await User.findByUsername(username);
      
      if (existingUser) {
        return res.render('signup', {
          title: 'Sign Up',
          errors: [{ msg: 'Email already registered' }],
          formData: req.body
        });
      }

      await User.create({ first_name, last_name, username, password });
      req.flash('success_msg', 'Registration successful! Please log in');
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.render('error', { 
        title: 'Error', 
        message: 'Registration failed' 
      });
    }
  }
];

exports.login_get = (req, res) => {
  res.render('login', { title: 'Log In' });
};

exports.login_post = passport.authenticate('local', {
  successRedirect: '/messages',
  failureRedirect: '/login',
  failureFlash: true
});

exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success_msg', 'Logged out successfully');
    res.redirect('/messages');
  });
};