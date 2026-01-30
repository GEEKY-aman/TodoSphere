import React from 'react';
import { Todo } from '../../types';

interface ListViewProps {
    todos: Todo[];
    onToggleStatus: (todoId: string, currentStatus: string) => void;
    onDeleteTodo: (todoId: string) => void;
    onOpenTodo: (todo: Todo) => void;
}

const priorityColors: Record<string, { bg: string; text: string }> = {
    low: { bg: 'bg-gray-100', text: 'text-gray-600' },
    medium: { bg: 'bg-blue-100', text: 'text-blue-600' },
    high: { bg: 'bg-orange-100', text: 'text-orange-600' },
    urgent: { bg: 'bg-red-100', text: 'text-red-600' },
};

const statusColors: Record<string, { bg: string; text: string }> = {
    'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'completed': { bg: 'bg-green-100', text: 'text-green-700' },
    'on-hold': { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const ListView: React.FC<ListViewProps> = ({ todos, onToggleStatus, onDeleteTodo, onOpenTodo }) => {
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const isOverdue = (dateStr: string | null, status: string) => {
        if (!dateStr || status === 'completed') return false;
        return new Date(dateStr) < new Date();
    };

    const getSubtaskProgress = (todo: Todo) => {
        if (!todo.subtasks || todo.subtasks.length === 0) return null;
        const completed = todo.subtasks.filter(s => s.completed).length;
        return { completed, total: todo.subtasks.length };
    };

    if (todos.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                Your board is empty. Add a task to start!
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {todos.map((todo) => {
                const subtaskProgress = getSubtaskProgress(todo);
                const overdue = isOverdue(todo.dueDate, todo.status);
                const priority = priorityColors[todo.priority] || priorityColors.medium;
                const status = statusColors[todo.status] || statusColors.pending;

                return (
                    <div
                        key={todo.id}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all group cursor-pointer"
                        onClick={() => onOpenTodo(todo)}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-grow">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleStatus(todo.id, todo.status);
                                    }}
                                    className={`w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${todo.status === 'completed'
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-gray-200 bg-white hover:border-indigo-500'
                                        }`}
                                >
                                    {todo.status === 'completed' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>

                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className={`font-semibold text-gray-900 transition-all ${todo.status === 'completed' ? 'line-through text-gray-400' : ''
                                            }`}>
                                            {todo.title}
                                        </h4>
                                        {todo.recurrence?.enabled && (
                                            <span className="text-indigo-500 text-sm" title={`Repeats ${todo.recurrence.pattern}`}>
                                                🔄
                                            </span>
                                        )}
                                    </div>

                                    {todo.description && (
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{todo.description}</p>
                                    )}

                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                        {/* Priority Badge */}
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${priority.bg} ${priority.text}`}>
                                            {todo.priority}
                                        </span>

                                        {/* Status Badge */}
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}>
                                            {todo.status.replace('-', ' ')}
                                        </span>

                                        {/* Due Date */}
                                        {todo.dueDate && (
                                            <span className={`flex items-center gap-1 text-xs font-medium ${overdue ? 'text-red-500' : 'text-gray-500'
                                                }`}>
                                                📅 {formatDate(todo.dueDate)}
                                                {overdue && ' (Overdue)'}
                                            </span>
                                        )}

                                        {/* Subtask Progress */}
                                        {subtaskProgress && (
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <span className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <span
                                                        className="block h-full bg-indigo-500 rounded-full transition-all"
                                                        style={{ width: `${(subtaskProgress.completed / subtaskProgress.total) * 100}%` }}
                                                    />
                                                </span>
                                                {subtaskProgress.completed}/{subtaskProgress.total}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteTodo(todo.id);
                                }}
                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ListView;
