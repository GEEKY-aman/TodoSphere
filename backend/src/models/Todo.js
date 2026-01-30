const mongoose = require('mongoose');

// Subtask schema (embedded)
const subtaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { _id: true });

// Recurrence schema (embedded)
const recurrenceSchema = new mongoose.Schema({
    enabled: {
        type: Boolean,
        default: false
    },
    pattern: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'custom', null],
        default: null
    },
    interval: {
        type: Number,
        default: 1
    },
    endDate: {
        type: Date,
        default: null
    }
}, { _id: false });

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Todo title is required'],
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'on-hold'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        default: null
    },
    subtasks: [subtaskSchema],
    dependencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }],
    recurrence: {
        type: recurrenceSchema,
        default: () => ({})
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Todo', todoSchema);
