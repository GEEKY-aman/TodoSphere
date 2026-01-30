const Board = require('../models/Board');
const Todo = require('../models/Todo');

// @desc    Get all boards for current user
// @route   GET /api/boards
// @access  Private
const getBoards = async (req, res) => {
    try {
        const boards = await Board.find({ userId: req.user._id }).sort({ createdAt: -1 });

        // Format response to match frontend expectations
        const formattedBoards = boards.map(board => ({
            id: board._id,
            title: board.title,
            userId: board.userId,
            createdAt: board.createdAt
        }));

        res.json(formattedBoards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single board
// @route   GET /api/boards/:id
// @access  Private
const getBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Check if user owns the board
        if (board.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json({
            id: board._id,
            title: board.title,
            userId: board.userId,
            createdAt: board.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create board
// @route   POST /api/boards
// @access  Private
const createBoard = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Please provide a title' });
        }

        const board = await Board.create({
            title,
            userId: req.user._id
        });

        res.status(201).json({
            id: board._id,
            title: board.title,
            userId: board.userId,
            createdAt: board.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
const updateBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Check if user owns the board
        if (board.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedBoard = await Board.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title },
            { new: true }
        );

        res.json({
            id: updatedBoard._id,
            title: updatedBoard.title,
            userId: updatedBoard.userId,
            createdAt: updatedBoard.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Check if user owns the board
        if (board.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete all todos in this board
        await Todo.deleteMany({ boardId: req.params.id });

        // Delete the board
        await Board.findByIdAndDelete(req.params.id);

        res.json({ message: 'Board deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getBoards, getBoard, createBoard, updateBoard, deleteBoard };
