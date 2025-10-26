const { validationResult, body } = require('express-validator');
const passport = require('passport');
const User = require('../models/user');

// GET signup
exports.signup_get = (req, res) => {
  res.render('signup', { title: 'Sign Up', errors: [], formData: {} });
};

// POST signup
exports.signup_post = [
  // Validation
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('username').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars long'),
  body('confirmPassword')
    .custom((val, { req }) => val === req.body.password)
    .withMessage('Passwords do not match'),

  async (req, res) => {
    const errors = validationResult(req);
    const { first_name, last_name, username, password } = req.body;

    if (!errors.isEmpty()) {
      return res.render('signup', { title: 'Sign Up', errors: errors.array(), formData: req.body });
    }

    try {
      const existing = await User.findByUsername(username);
      if (existing) {
        req.flash('error_msg', 'Email already registered.');
        return res.redirect('/signup');
      }

      await User.create({ first_name, last_name, username, password });
      req.flash('success_msg', 'Account created! Please log in.');
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.render('error', { title: 'Error', message: 'Signup failed. Try again.' });
    }
  },
];

// GET login
exports.login_get = (req, res) => {
  res.render('login', { title: 'Log In' });
};

// POST login
exports.login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
});

// GET logout
exports.logout_get = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'You have logged out.');
    res.redirect('/');
  });
};