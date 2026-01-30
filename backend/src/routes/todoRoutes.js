const express = require('express');
const router = express.Router();
const {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    addSubtask,
    toggleSubtask,
    deleteSubtask
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
    .post(createTodo);

router.route('/:boardId')
    .get(getTodos);

router.route('/item/:id')
    .get(getTodo)
    .put(updateTodo)
    .delete(deleteTodo);

// Subtask routes
router.route('/item/:id/subtask')
    .post(addSubtask);

router.route('/item/:id/subtask/:subtaskId')
    .put(toggleSubtask)
    .delete(deleteSubtask);

module.exports = router;

