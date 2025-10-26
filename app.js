// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');

// Initialize app
const app = express();

// Passport config
require('./config/passportConfig')(passport);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables (for templates)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // Passport errors
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const memberRoutes = require('./routes/member');

app.use('/', authRoutes);
app.use('/messages', messageRoutes);
app.use('/member', memberRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page Not Found' });
});

module.exports = app;
