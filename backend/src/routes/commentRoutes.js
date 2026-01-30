const express = require('express');
const router = express.Router();
const { getComments, createComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
    .post(createComment);

router.route('/:todoId')
    .get(getComments);

router.route('/item/:id')
    .delete(deleteComment);

module.exports = router;
