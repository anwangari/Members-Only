const User = require('../models/user');

exports.join_get = (req, res) => {
  res.render('join_club', { title: 'Join the Club' });
};

exports.join_post = async (req, res) => {
  const { passcode } = req.body;
  const correctPasscode = process.env.CLUB_PASSCODE || 'secret123';

  if (passcode === correctPasscode) {
    try {
      await User.updateMembership(req.user.id, true);
      req.flash('success_msg', 'Welcome to the club!');
      res.redirect('/messages');
    } catch (err) {
      console.error(err);
      res.render('error', { 
        title: 'Error', 
        message: 'Failed to join club' 
      });
    }
  } else {
    req.flash('error_msg', 'Incorrect passcode');
    res.redirect('/member/join');
  }
};

exports.admin_get = (req, res) => {
  res.render('admin', { title: 'Become Admin' });
};

exports.admin_post = async (req, res) => {
  const { passcode } = req.body;
  const correctPasscode = process.env.ADMIN_PASSCODE || 'admin123';

  if (passcode === correctPasscode) {
    try {
      await User.updateAdmin(req.user.id, true);
      req.flash('success_msg', 'Admin privileges granted!');
      res.redirect('/messages');
    } catch (err) {
      console.error(err);
      res.render('error', { 
        title: 'Error', 
        message: 'Failed to become admin' 
      });
    }
  } else {
    req.flash('error_msg', 'Incorrect admin passcode');
    res.redirect('/member/admin');
  }
};