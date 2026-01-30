import React, { useState } from 'react';
import { Todo, StatusType, PriorityType } from '../../types';

interface GridViewProps {
    todos: Todo[];
    onUpdateTodo: (todoId: string, updates: Partial<Todo>) => void;
    onDeleteTodo: (todoId: string) => void;
    onOpenTodo: (todo: Todo) => void;
}

const statusOptions: StatusType[] = ['pending', 'in-progress', 'completed', 'on-hold'];
const priorityOptions: PriorityType[] = ['low', 'medium', 'high', 'urgent'];

const statusColors: Record<string, string> = {
    'pending': 'text-yellow-600 bg-yellow-50',
    'in-progress': 'text-blue-600 bg-blue-50',
    'completed': 'text-green-600 bg-green-50',
    'on-hold': 'text-gray-600 bg-gray-50',
};

const priorityColors: Record<string, string> = {
    low: 'text-gray-600 bg-gray-50',
    medium: 'text-blue-600 bg-blue-50',
    high: 'text-orange-600 bg-orange-50',
    urgent: 'text-red-600 bg-red-50',
};

const GridView: React.FC<GridViewProps> = ({ todos, onUpdateTodo, onDeleteTodo, onOpenTodo }) => {
    const [sortBy, setSortBy] = useState<'title' | 'status' | 'priority' | 'dueDate'>('dueDate');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const handleSort = (column: typeof sortBy) => {
        if (sortBy === column) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDir('asc');
        }
    };

    const sortedTodos = [...todos].sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
            case 'status':
                comparison = statusOptions.indexOf(a.status) - statusOptions.indexOf(b.status);
                break;
            case 'priority':
                comparison = priorityOptions.indexOf(a.priority) - priorityOptions.indexOf(b.priority);
                break;
            case 'dueDate':
                if (!a.dueDate && !b.dueDate) comparison = 0;
                else if (!a.dueDate) comparison = 1;
                else if (!b.dueDate) comparison = -1;
                else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                break;
        }
        return sortDir === 'asc' ? comparison : -comparison;
    });

    const getSubtaskProgress = (todo: Todo) => {
        if (!todo.subtasks || todo.subtasks.length === 0) return null;
        const completed = todo.subtasks.filter(s => s.completed).length;
        const percent = Math.round((completed / todo.subtasks.length) * 100);
        return { completed, total: todo.subtasks.length, percent };
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const SortIcon = ({ column }: { column: typeof sortBy }) => (
        <span className={`ml-1 ${sortBy === column ? 'text-indigo-600' : 'text-gray-300'}`}>
            {sortBy === column && sortDir === 'asc' ? '↑' : sortBy === column && sortDir === 'desc' ? '↓' : '↕'}
        </span>
    );

    if (todos.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-4">⊞</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-500">Add tasks to see them in the grid view</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left p-3 font-semibold text-gray-700 text-sm w-8">
                                <input type="checkbox" className="rounded border-gray-300" disabled />
                            </th>
                            <th
                                className="text-left p-3 font-semibold text-gray-700 text-sm cursor-pointer hover:text-indigo-600"
                                onClick={() => handleSort('title')}
                            >
                                Title <SortIcon column="title" />
                            </th>
                            <th
                                className="text-left p-3 font-semibold text-gray-700 text-sm cursor-pointer hover:text-indigo-600"
                                onClick={() => handleSort('status')}
                            >
                                Status <SortIcon column="status" />
                            </th>
                            <th
                                className="text-left p-3 font-semibold text-gray-700 text-sm cursor-pointer hover:text-indigo-600"
                                onClick={() => handleSort('priority')}
                            >
                                Priority <SortIcon column="priority" />
                            </th>
                            <th
                                className="text-left p-3 font-semibold text-gray-700 text-sm cursor-pointer hover:text-indigo-600"
                                onClick={() => handleSort('dueDate')}
                            >
                                Due Date <SortIcon column="dueDate" />
                            </th>
                            <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                                Progress
                            </th>
                            <th className="text-left p-3 font-semibold text-gray-700 text-sm w-12">

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTodos.map((todo) => {
                            const progress = getSubtaskProgress(todo);
                            const statusColor = statusColors[todo.status] || statusColors.pending;
                            const priorityColor = priorityColors[todo.priority] || priorityColors.medium;

                            return (
                                <tr
                                    key={todo.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                >
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={todo.status === 'completed'}
                                            onChange={() => onUpdateTodo(todo.id, {
                                                status: todo.status === 'completed' ? 'pending' : 'completed'
                                            })}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <div
                                            className={`font-medium cursor-pointer hover:text-indigo-600 ${todo.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
                                                }`}
                                            onClick={() => onOpenTodo(todo)}
                                        >
                                            {todo.title}
                                            {todo.recurrence?.enabled && (
                                                <span className="ml-1 text-indigo-500" title={`Repeats ${todo.recurrence.pattern}`}>🔄</span>
                                            )}
                                        </div>
                                        {todo.description && (
                                            <div className="text-xs text-gray-500 truncate max-w-xs">{todo.description}</div>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <select
                                            value={todo.status}
                                            onChange={(e) => onUpdateTodo(todo.id, { status: e.target.value as StatusType })}
                                            className={`text-xs font-medium rounded-lg px-2 py-1 border-0 cursor-pointer ${statusColor}`}
                                        >
                                            {statusOptions.map(s => (
                                                <option key={s} value={s}>{s.replace('-', ' ')}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <select
                                            value={todo.priority}
                                            onChange={(e) => onUpdateTodo(todo.id, { priority: e.target.value as PriorityType })}
                                            className={`text-xs font-medium rounded-lg px-2 py-1 border-0 cursor-pointer ${priorityColor}`}
                                        >
                                            {priorityOptions.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <span className={`text-sm ${todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'completed'
                                                ? 'text-red-500 font-medium'
                                                : 'text-gray-600'
                                            }`}>
                                            {formatDate(todo.dueDate)}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {progress ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${progress.percent === 100 ? 'bg-green-500' : 'bg-indigo-500'
                                                            }`}
                                                        style={{ width: `${progress.percent}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {progress.percent}%
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => onDeleteTodo(todo.id)}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GridView;
