import React from 'react';
import { ViewType } from '../types';

interface ViewSwitcherProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

const views: { type: ViewType; label: string; icon: string }[] = [
    { type: 'list', label: 'List', icon: '📋' },
    { type: 'kanban', label: 'Kanban', icon: '📊' },
    { type: 'calendar', label: 'Calendar', icon: '📅' },
    { type: 'gantt', label: 'Gantt', icon: '📈' },
    { type: 'grid', label: 'Grid', icon: '⊞' },
];

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
    return (
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {views.map((view) => (
                <button
                    key={view.type}
                    onClick={() => onViewChange(view.type)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentView === view.type
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <span>{view.icon}</span>
                    <span className="hidden md:inline">{view.label}</span>
                </button>
            ))}
        </div>
    );
};

export default ViewSwitcher;
