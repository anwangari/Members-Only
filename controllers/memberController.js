const User = require('../models/user');

// GET join club page
exports.join_get = (req, res) => {
  res.render('join_club', { title: 'Join the Club' });
};

// POST join club
exports.join_post = async (req, res) => {
  const { passcode } = req.body;
  const correctPasscode = process.env.CLUB_PASSCODE || 'secret123';

  if (passcode === correctPasscode) {
    try {
      await User.updateMembership(req.user.id, true);
      req.flash('success_msg', 'Welcome to the club! You can now see message authors.');
      res.redirect('/');
    } catch (err) {
      console.error('Join club error:', err);
      res.render('error', { title: 'Error', message: 'Failed to join club' });
    }
  } else {
    req.flash('error_msg', 'Incorrect passcode');
    res.redirect('/member/join');
  }
};

// GET admin page
exports.admin_get = (req, res) => {
  res.render('admin', { title: 'Become Admin' });
};

// POST admin upgrade
exports.admin_post = async (req, res) => {
  const { passcode } = req.body;
  const correctPasscode = process.env.ADMIN_PASSCODE || 'admin123';

  if (passcode === correctPasscode) {
    try {
      await User.updateAdmin(req.user.id, true);
      req.flash('success_msg', 'Admin privileges granted! You can now delete messages.');
      res.redirect('/');
    } catch (err) {
      console.error('Admin upgrade error:', err);
      res.render('error', { title: 'Error', message: 'Failed to upgrade to admin' });
    }
  } else {
    req.flash('error_msg', 'Incorrect admin passcode');
    res.redirect('/member/admin');
  }
};