const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true
    },
    todoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['comment', 'activity'],
        default: 'comment'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
