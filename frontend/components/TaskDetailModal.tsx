import React, { useState, useEffect } from 'react';
import { Todo, Comment, Subtask, StatusType, PriorityType } from '../types';
import { api } from '../services/api';

interface TaskDetailModalProps {
    todo: Todo;
    onClose: () => void;
    onUpdate: (updatedTodo: Todo) => void;
    onDelete: (todoId: string) => void;
}

const statusOptions: { value: StatusType; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { value: 'on-hold', label: 'On Hold', color: 'bg-gray-100 text-gray-700' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
];

const priorityOptions: { value: PriorityType; label: string; color: string; icon: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-600', icon: '⚪' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-600', icon: '🔵' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-600', icon: '🟠' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-600', icon: '🔴' },
];

const recurrenceOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' },
];

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ todo, onClose, onUpdate, onDelete }) => {
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description || '');
    const [status, setStatus] = useState<StatusType>(todo.status);
    const [priority, setPriority] = useState<PriorityType>(todo.priority);
    const [dueDate, setDueDate] = useState(todo.dueDate ? todo.dueDate.split('T')[0] : '');
    const [subtasks, setSubtasks] = useState<Subtask[]>(todo.subtasks || []);
    const [newSubtask, setNewSubtask] = useState('');
    const [recurrenceEnabled, setRecurrenceEnabled] = useState(todo.recurrence?.enabled || false);
    const [recurrencePattern, setRecurrencePattern] = useState(todo.recurrence?.pattern || 'weekly');
    const [recurrenceInterval, setRecurrenceInterval] = useState(todo.recurrence?.interval || 1);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

    useEffect(() => {
        loadComments();
    }, [todo.id]);

    const loadComments = async () => {
        try {
            const data = await api.getComments(todo.id);
            setComments(data);
        } catch (err) {
            console.error('Failed to load comments:', err);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const updates = {
                title,
                description,
                status,
                priority,
                dueDate: dueDate || null,
                recurrence: {
                    enabled: recurrenceEnabled,
                    pattern: recurrenceEnabled ? recurrencePattern : null,
                    interval: recurrenceInterval,
                    endDate: null,
                },
            };
            const updated = await api.updateTodo(todo.id, updates);
            onUpdate(updated);
            onClose();
        } catch (err) {
            console.error('Failed to update todo:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubtask = async () => {
        if (!newSubtask.trim()) return;
        try {
            const updated = await api.addSubtask(todo.id, newSubtask);
            setSubtasks(updated.subtasks);
            setNewSubtask('');
            onUpdate(updated);
        } catch (err) {
            console.error('Failed to add subtask:', err);
        }
    };

    const handleToggleSubtask = async (subtaskId: string) => {
        try {
            const updated = await api.toggleSubtask(todo.id, subtaskId);
            setSubtasks(updated.subtasks);
            onUpdate(updated);
        } catch (err) {
            console.error('Failed to toggle subtask:', err);
        }
    };

    const handleDeleteSubtask = async (subtaskId: string) => {
        try {
            const updated = await api.deleteSubtask(todo.id, subtaskId);
            setSubtasks(updated.subtasks);
            onUpdate(updated);
        } catch (err) {
            console.error('Failed to delete subtask:', err);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const comment = await api.createComment(todo.id, newComment);
            setComments([comment, ...comments]);
            setNewComment('');
        } catch (err) {
            console.error('Failed to add comment:', err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await api.deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const subtaskProgress = subtasks.length > 0
        ? Math.round((subtasks.filter(s => s.completed).length / subtasks.length) * 100)
        : 0;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-2xl font-bold text-gray-900 flex-grow border-0 focus:ring-0 p-0 bg-transparent"
                        placeholder="Task title..."
                    />
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'details'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'comments'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Comments
                        {comments.length > 0 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {comments.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-6">
                    {activeTab === 'details' ? (
                        <div className="space-y-6">
                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add a description..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Status & Priority Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as StatusType)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as PriorityType)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    >
                                        {priorityOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            {/* Recurrence */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-gray-700">Recurring Task</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={recurrenceEnabled}
                                            onChange={(e) => setRecurrenceEnabled(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                                {recurrenceEnabled && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600">Repeat</span>
                                        <select
                                            value={recurrencePattern || 'weekly'}
                                            onChange={(e) => setRecurrencePattern(e.target.value as 'daily' | 'weekly' | 'monthly' | 'custom')}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        >
                                            {recurrenceOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <span className="text-sm text-gray-600">every</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={recurrenceInterval}
                                            onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                                            className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        />
                                        <span className="text-sm text-gray-600">{recurrencePattern === 'daily' ? 'day(s)' : recurrencePattern === 'weekly' ? 'week(s)' : 'month(s)'}</span>
                                    </div>
                                )}
                            </div>

                            {/* Subtasks */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-gray-700">
                                        Subtasks {subtasks.length > 0 && `(${subtaskProgress}%)`}
                                    </label>
                                    {subtasks.length > 0 && (
                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all"
                                                style={{ width: `${subtaskProgress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2 mb-3">
                                    {subtasks.map((subtask) => (
                                        <div key={subtask.id} className="flex items-center gap-3 group">
                                            <button
                                                onClick={() => handleToggleSubtask(subtask.id)}
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${subtask.completed
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'border-gray-300 hover:border-indigo-500'
                                                    }`}
                                            >
                                                {subtask.completed && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                            <span className={`flex-grow text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                {subtask.title}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteSubtask(subtask.id)}
                                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSubtask}
                                        onChange={(e) => setNewSubtask(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                                        placeholder="Add a subtask..."
                                        className="flex-grow px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    />
                                    <button
                                        onClick={handleAddSubtask}
                                        className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-xl font-medium text-sm hover:bg-indigo-200 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* File Attachments (Placeholder) */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Attachments</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                                    <div className="text-gray-400 text-2xl mb-2">📎</div>
                                    <p className="text-sm text-gray-500">Drag and drop files here, or click to browse</p>
                                    <p className="text-xs text-gray-400 mt-1">(Coming soon)</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Add Comment */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                                    You
                                </div>
                                <div className="flex-grow">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                                        rows={2}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={handleAddComment}
                                            disabled={!newComment.trim()}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Comments List */}
                            {comments.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <div className="text-3xl mb-2">💬</div>
                                    <p>No comments yet. Be the first to comment!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-3 group">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold flex-shrink-0">
                                                {comment.userName?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-gray-900 text-sm">{comment.userName || 'User'}</span>
                                                    <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
                                                    {comment.type === 'activity' && (
                                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Activity</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-700">{comment.content}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this task?')) {
                                onDelete(todo.id);
                                onClose();
                            }
                        }}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                    >
                        Delete Task
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || !title.trim()}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
