const User = require('../models/user');

// GET join the club
exports.join_get = (req, res) => {
  res.render('join_club', { title: 'Join the Club' });
};

// POST join the club
exports.join_post = async (req, res) => {
  const { passcode } = req.body;
  const clubPass = process.env.CLUB_PASSCODE || 'secret123';

  if (passcode === clubPass) {
    await User.updateMembership(req.user.id, true);
    req.flash('success_msg', 'You are now a club member!');
    res.redirect('/');
  } else {
    req.flash('error_msg', 'Incorrect passcode.');
    res.redirect('/member/join');
  }
};

// GET admin page
exports.admin_get = (req, res) => {
  res.render('admin', { title: 'Admin Access' });
};

// POST admin upgrade
exports.admin_post = async (req, res) => {
  const { passcode } = req.body;
  const adminPass = process.env.ADMIN_PASSCODE || 'admin123';

  if (passcode === adminPass) {
    await User.updateAdmin(req.user.id, true);
    req.flash('success_msg', 'You are now an admin!');
    res.redirect('/');
  } else {
    req.flash('error_msg', 'Incorrect admin passcode.');
    res.redirect('/member/admin');
  }
};