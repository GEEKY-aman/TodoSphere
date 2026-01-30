const Comment = require('../models/Comment');
const Todo = require('../models/Todo');

// @desc    Get all comments for a todo
// @route   GET /api/comments/:todoId
// @access  Private
const getComments = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.todoId);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const comments = await Comment.find({ todoId: req.params.todoId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        const formattedComments = comments.map(comment => ({
            id: comment._id,
            content: comment.content,
            todoId: comment.todoId,
            userId: comment.userId._id,
            userName: comment.userId.name,
            type: comment.type,
            createdAt: comment.createdAt
        }));

        res.json(formattedComments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
    try {
        const { content, todoId, type } = req.body;

        if (!content || !todoId) {
            return res.status(400).json({ message: 'Please provide content and todoId' });
        }

        const todo = await Todo.findById(todoId);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const comment = await Comment.create({
            content,
            todoId,
            userId: req.user._id,
            type: type || 'comment'
        });

        // Populate user info for response
        await comment.populate('userId', 'name email');

        res.status(201).json({
            id: comment._id,
            content: comment.content,
            todoId: comment.todoId,
            userId: comment.userId._id,
            userName: comment.userId.name,
            type: comment.type,
            createdAt: comment.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getComments, createComment, deleteComment };
