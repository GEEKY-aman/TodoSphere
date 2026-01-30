import React, { useState, useMemo } from 'react';
import { Todo } from '../../types';

interface GanttViewProps {
    todos: Todo[];
    onOpenTodo: (todo: Todo) => void;
}

const priorityColors: Record<string, string> = {
    low: 'bg-gray-400',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500',
};

const statusColors: Record<string, string> = {
    'pending': 'opacity-60',
    'in-progress': 'opacity-100',
    'completed': 'opacity-40',
    'on-hold': 'opacity-30',
};

const GanttView: React.FC<GanttViewProps> = ({ todos, onOpenTodo }) => {
    const todosWithDates = todos.filter(t => t.dueDate);

    // Calculate date range
    const { startDate, endDate, totalDays, dates } = useMemo(() => {
        if (todosWithDates.length === 0) {
            const today = new Date();
            const start = new Date(today);
            start.setDate(start.getDate() - 3);
            const end = new Date(today);
            end.setDate(end.getDate() + 14);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const dateArray = [];
            for (let i = 0; i < days; i++) {
                const d = new Date(start);
                d.setDate(d.getDate() + i);
                dateArray.push(d);
            }
            return { startDate: start, endDate: end, totalDays: days, dates: dateArray };
        }

        const dueDates = todosWithDates.map(t => new Date(t.dueDate!));
        const createdDates = todosWithDates.map(t => new Date(t.createdAt));
        const allDates = [...dueDates, ...createdDates];

        const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));

        // Add some padding
        minDate.setDate(minDate.getDate() - 2);
        maxDate.setDate(maxDate.getDate() + 5);

        const days = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const dateArray = [];
        for (let i = 0; i < days; i++) {
            const d = new Date(minDate);
            d.setDate(d.getDate() + i);
            dateArray.push(d);
        }

        return { startDate: minDate, endDate: maxDate, totalDays: days, dates: dateArray };
    }, [todosWithDates]);

    const getBarPosition = (todo: Todo) => {
        const created = new Date(todo.createdAt);
        const due = new Date(todo.dueDate!);

        const startOffset = Math.max(0, Math.ceil((created.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const endOffset = Math.ceil((due.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const width = Math.max(1, endOffset - startOffset);

        return {
            left: `${(startOffset / totalDays) * 100}%`,
            width: `${(width / totalDays) * 100}%`,
        };
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (todosWithDates.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No tasks with due dates</h3>
                <p className="text-gray-500">Add due dates to your tasks to see them in the Gantt view</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header with dates */}
            <div className="flex border-b border-gray-200">
                <div className="w-48 flex-shrink-0 p-3 bg-gray-50 font-semibold text-gray-700 text-sm border-r border-gray-200">
                    Task
                </div>
                <div className="flex-grow overflow-x-auto">
                    <div className="flex min-w-max">
                        {dates.map((date, i) => (
                            <div
                                key={i}
                                className={`flex-shrink-0 w-12 p-2 text-center text-xs border-r border-gray-100 ${isToday(date) ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-500'
                                    }`}
                            >
                                <div>{date.getDate()}</div>
                                <div className="text-[10px]">
                                    {date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Task rows */}
            <div className="max-h-[500px] overflow-y-auto">
                {todosWithDates.map((todo) => {
                    const barPos = getBarPosition(todo);
                    const priorityColor = priorityColors[todo.priority] || priorityColors.medium;
                    const statusOpacity = statusColors[todo.status] || statusColors.pending;

                    return (
                        <div
                            key={todo.id}
                            className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                        >
                            <div
                                className="w-48 flex-shrink-0 p-3 border-r border-gray-200 cursor-pointer"
                                onClick={() => onOpenTodo(todo)}
                            >
                                <div className={`font-medium text-sm truncate ${todo.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
                                    }`}>
                                    {todo.title}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`w-2 h-2 rounded-full ${priorityColor}`}></span>
                                    <span className="text-[10px] text-gray-400 uppercase">
                                        {todo.priority}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-grow relative h-16 overflow-hidden">
                                {/* Today marker */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 z-10"
                                    style={{
                                        left: `${(Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays) * 100}%`
                                    }}
                                />

                                {/* Task bar */}
                                <div
                                    className={`absolute top-3 h-10 rounded-lg cursor-pointer transition-all hover:scale-105 ${priorityColor} ${statusOpacity}`}
                                    style={barPos}
                                    onClick={() => onOpenTodo(todo)}
                                    title={`${todo.title} - Due: ${formatDate(new Date(todo.dueDate!))}`}
                                >
                                    <div className="px-2 py-1 text-white text-xs font-medium truncate h-full flex items-center">
                                        {todo.title}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center gap-6 text-xs">
                <span className="font-medium text-gray-600">Priority:</span>
                {Object.entries(priorityColors).map(([priority, color]) => (
                    <div key={priority} className="flex items-center gap-1">
                        <span className={`w-3 h-3 rounded ${color}`}></span>
                        <span className="text-gray-500 capitalize">{priority}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GanttView;
