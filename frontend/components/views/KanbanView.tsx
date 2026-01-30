import React from 'react';
import { Todo, StatusType } from '../../types';

interface KanbanViewProps {
    todos: Todo[];
    onToggleStatus: (todoId: string, currentStatus: string) => void;
    onDeleteTodo: (todoId: string) => void;
    onOpenTodo: (todo: Todo) => void;
    onUpdateStatus: (todoId: string, newStatus: StatusType) => void;
}

const columns: { status: StatusType; label: string; color: string }[] = [
    { status: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { status: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
    { status: 'on-hold', label: 'On Hold', color: 'bg-gray-500' },
    { status: 'completed', label: 'Completed', color: 'bg-green-500' },
];

const priorityColors: Record<string, string> = {
    low: 'border-l-gray-400',
    medium: 'border-l-blue-400',
    high: 'border-l-orange-400',
    urgent: 'border-l-red-500',
};

const KanbanView: React.FC<KanbanViewProps> = ({ todos, onDeleteTodo, onOpenTodo, onUpdateStatus }) => {
    const [draggedTodo, setDraggedTodo] = React.useState<Todo | null>(null);

    const handleDragStart = (e: React.DragEvent, todo: Todo) => {
        setDraggedTodo(todo);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetStatus: StatusType) => {
        e.preventDefault();
        if (draggedTodo && draggedTodo.status !== targetStatus) {
            onUpdateStatus(draggedTodo.id, targetStatus);
        }
        setDraggedTodo(null);
    };

    const handleDragEnd = () => {
        setDraggedTodo(null);
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getSubtaskProgress = (todo: Todo) => {
        if (!todo.subtasks || todo.subtasks.length === 0) return null;
        const completed = todo.subtasks.filter(s => s.completed).length;
        return { completed, total: todo.subtasks.length };
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => {
                const columnTodos = todos.filter(t => t.status === column.status);

                return (
                    <div
                        key={column.status}
                        className="bg-gray-50 rounded-2xl p-4 min-h-[400px]"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.status)}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${column.color}`}></span>
                                <h3 className="font-bold text-gray-700">{column.label}</h3>
                            </div>
                            <span className="bg-white px-2 py-0.5 rounded-lg text-sm font-medium text-gray-500">
                                {columnTodos.length}
                            </span>
                        </div>

                        {/* Column Cards */}
                        <div className="space-y-3">
                            {columnTodos.map((todo) => {
                                const subtaskProgress = getSubtaskProgress(todo);
                                const priorityBorder = priorityColors[todo.priority] || priorityColors.medium;

                                return (
                                    <div
                                        key={todo.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, todo)}
                                        onDragEnd={handleDragEnd}
                                        onClick={() => onOpenTodo(todo)}
                                        className={`bg-white p-3 rounded-xl shadow-sm border border-gray-100 border-l-4 ${priorityBorder} cursor-pointer hover:shadow-md transition-all group ${draggedTodo?.id === todo.id ? 'opacity-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className={`font-medium text-gray-900 text-sm ${todo.status === 'completed' ? 'line-through text-gray-400' : ''
                                                }`}>
                                                {todo.title}
                                            </h4>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteTodo(todo.id);
                                                }}
                                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>

                                        {todo.description && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{todo.description}</p>
                                        )}

                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            {/* Priority Badge */}
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${todo.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                                                    todo.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                                                        todo.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-gray-100 text-gray-600'
                                                }`}>
                                                {todo.priority}
                                            </span>

                                            {/* Due Date */}
                                            {todo.dueDate && (
                                                <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                                                    📅 {formatDate(todo.dueDate)}
                                                </span>
                                            )}

                                            {/* Recurrence */}
                                            {todo.recurrence?.enabled && (
                                                <span className="text-indigo-500 text-[10px]" title={`Repeats ${todo.recurrence.pattern}`}>
                                                    🔄
                                                </span>
                                            )}
                                        </div>

                                        {/* Subtask Progress */}
                                        {subtaskProgress && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="flex-grow h-1 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-500 rounded-full transition-all"
                                                        style={{ width: `${(subtaskProgress.completed / subtaskProgress.total) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-gray-500">
                                                    {subtaskProgress.completed}/{subtaskProgress.total}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {columnTodos.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    Drop tasks here
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default KanbanView;
