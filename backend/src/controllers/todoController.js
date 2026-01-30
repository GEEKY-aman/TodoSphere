const Todo = require('../models/Todo');
const Board = require('../models/Board');

// Helper to format todo response
const formatTodoResponse = (todo) => ({
    id: todo._id,
    title: todo.title,
    description: todo.description || '',
    status: todo.status,
    priority: todo.priority || 'medium',
    dueDate: todo.dueDate,
    subtasks: (todo.subtasks || []).map(st => ({
        id: st._id,
        title: st.title,
        completed: st.completed
    })),
    dependencies: todo.dependencies || [],
    recurrence: todo.recurrence || { enabled: false, pattern: null, interval: 1, endDate: null },
    boardId: todo.boardId,
    userId: todo.userId,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt
});

// @desc    Get all todos for a board
// @route   GET /api/todos/:boardId
// @access  Private
const getTodos = async (req, res) => {
    try {
        const { boardId } = req.params;

        // Check if board exists and belongs to user
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        if (board.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const todos = await Todo.find({ boardId }).sort({ createdAt: -1 });

        res.json(todos.map(formatTodoResponse));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single todo
// @route   GET /api/todos/item/:id
// @access  Private
const getTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(formatTodoResponse(todo));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
    try {
        const { title, boardId, description, priority, dueDate, recurrence } = req.body;

        if (!title || !boardId) {
            return res.status(400).json({ message: 'Please provide title and boardId' });
        }

        // Check if board exists and belongs to user
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        if (board.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const todo = await Todo.create({
            title,
            description: description || '',
            priority: priority || 'medium',
            dueDate: dueDate || null,
            recurrence: recurrence || { enabled: false },
            boardId,
            userId: req.user._id,
            status: 'pending',
            subtasks: [],
            dependencies: []
        });

        res.status(201).json(formatTodoResponse(todo));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update todo (full update)
// @route   PUT /api/todos/item/:id
// @access  Private
const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update allowed fields
        const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'recurrence', 'dependencies'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                todo[field] = req.body[field];
            }
        });

        await todo.save();

        res.json(formatTodoResponse(todo));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete todo
// @route   DELETE /api/todos/item/:id
// @access  Private
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Todo.findByIdAndDelete(req.params.id);

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add subtask
// @route   POST /api/todos/item/:id/subtask
// @access  Private
const addSubtask = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Subtask title is required' });
        }

        todo.subtasks.push({ title, completed: false });
        await todo.save();

        res.status(201).json(formatTodoResponse(todo));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Toggle subtask
// @route   PUT /api/todos/item/:id/subtask/:subtaskId
// @access  Private
const toggleSubtask = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const subtask = todo.subtasks.id(req.params.subtaskId);
        if (!subtask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        subtask.completed = !subtask.completed;
        await todo.save();

        res.json(formatTodoResponse(todo));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete subtask
// @route   DELETE /api/todos/item/:id/subtask/:subtaskId
// @access  Private
const deleteSubtask = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const subtaskIndex = todo.subtasks.findIndex(
            st => st._id.toString() === req.params.subtaskId
        );

        if (subtaskIndex === -1) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        todo.subtasks.splice(subtaskIndex, 1);
        await todo.save();

        res.json(formatTodoResponse(todo));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    addSubtask,
    toggleSubtask,
    deleteSubtask
};

