const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const memberController = require('../controllers/memberController');

router.get('/join', ensureAuthenticated, memberController.join_get);
router.post('/join', ensureAuthenticated, memberController.join_post);

router.get('/admin', ensureAuthenticated, memberController.admin_get);
router.post('/admin', ensureAuthenticated, memberController.admin_post);

module.exports = router;
