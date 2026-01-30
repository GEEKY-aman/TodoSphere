import React, { useState } from 'react';
import { Todo } from '../../types';

interface CalendarViewProps {
    todos: Todo[];
    onOpenTodo: (todo: Todo) => void;
}

const priorityColors: Record<string, string> = {
    low: 'bg-gray-200 text-gray-700',
    medium: 'bg-blue-200 text-blue-700',
    high: 'bg-orange-200 text-orange-700',
    urgent: 'bg-red-200 text-red-700',
};

const CalendarView: React.FC<CalendarViewProps> = ({ todos, onOpenTodo }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        return { daysInMonth, startingDay, year, month };
    };

    const { daysInMonth, startingDay, year, month } = getDaysInMonth(currentDate);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getTodosForDate = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return todos.filter(todo => {
            if (!todo.dueDate) return false;
            const todoDate = new Date(todo.dueDate).toISOString().split('T')[0];
            return todoDate === dateStr;
        });
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;
    };

    const goToPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const renderCalendarDays = () => {
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="p-2 bg-gray-50 min-h-[100px]"></div>
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayTodos = getTodosForDate(day);
            const today = isToday(day);

            days.push(
                <div
                    key={day}
                    className={`p-2 border border-gray-100 min-h-[100px] ${today ? 'bg-indigo-50' : 'bg-white'
                        }`}
                >
                    <div className={`text-sm font-medium mb-1 ${today ? 'text-indigo-600' : 'text-gray-700'
                        }`}>
                        {day}
                    </div>
                    <div className="space-y-1">
                        {dayTodos.slice(0, 3).map((todo) => (
                            <div
                                key={todo.id}
                                onClick={() => onOpenTodo(todo)}
                                className={`text-xs p-1 rounded cursor-pointer truncate ${priorityColors[todo.priority] || priorityColors.medium
                                    } ${todo.status === 'completed' ? 'line-through opacity-60' : ''}`}
                                title={todo.title}
                            >
                                {todo.title}
                            </div>
                        ))}
                        {dayTodos.length > 3 && (
                            <div className="text-xs text-gray-500 font-medium">
                                +{dayTodos.length - 3} more
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                    {monthNames[month]} {year}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevMonth}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Day Names Header */}
            <div className="grid grid-cols-7 bg-gray-50">
                {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center text-xs font-semibold text-gray-500 uppercase">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {renderCalendarDays()}
            </div>
        </div>
    );
};

export default CalendarView;
