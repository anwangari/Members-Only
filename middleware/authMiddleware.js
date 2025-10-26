// middleware/authMiddleware.js
exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash('error_msg', 'Please log in to view this page.');
    res.redirect('/login');
};
  
exports.ensureMember = (req, res, next) => {
    if (req.user && req.user.is_member) return next();
    req.flash('error_msg', 'Only club members can view authors.');
    res.redirect('/');
};
  
exports.ensureAdmin = (req, res, next) => {
    if (req.user && req.user.is_admin) return next();
    req.flash('error_msg', 'Admin privileges required.');
    res.redirect('/');
};