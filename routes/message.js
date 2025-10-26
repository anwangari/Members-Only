// /routes/message.js

const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

router.get('/', messageController.index);
router.get('/new', ensureAuthenticated, messageController.new_message_get);
router.post('/new', ensureAuthenticated, messageController.new_message_post);
router.post('/:id/delete', ensureAdmin, messageController.delete_message);

module.exports = router;
