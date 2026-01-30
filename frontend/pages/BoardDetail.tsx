import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../App';
import { Todo, Board, ViewType, StatusType, PriorityType } from '../types';
import ViewSwitcher from '../components/ViewSwitcher';
import ListView from '../components/views/ListView';
import KanbanView from '../components/views/KanbanView';
import CalendarView from '../components/views/CalendarView';
import GanttView from '../components/views/GanttView';
import GridView from '../components/views/GridView';
import TaskDetailModal from '../components/TaskDetailModal';

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchBoardAndTodos();
    }
  }, [id]);

  const fetchBoardAndTodos = async () => {
    if (!id || !user) return;
    try {
      const currentBoard = await api.getBoard(id);
      setBoard(currentBoard);
      const taskList = await api.getTodos(id);
      setTodos(taskList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !id || !user) return;
    try {
      const todo = await api.createTodo(newTodoTitle, id);
      setTodos([todo, ...todos]);
      setNewTodoTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTodo = async (todoId: string, updates: Partial<Todo>) => {
    try {
      // Optimistic update
      const updatedTodos = todos.map(t => t.id === todoId ? { ...t, ...updates } : t);
      setTodos(updatedTodos);

      // API call
      // Note: for deep objects like recurrence, you might need a more robust merge strategy
      // or simply rely on the modal's full update mechanism
      await api.updateTodo(todoId, updates);
    } catch (err) {
      console.error(err);
      // Revert on error (could re-fetch)
      fetchBoardAndTodos();
    }
  };

  const handleToggleStatus = async (todoId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await handleUpdateTodo(todoId, { status: newStatus as StatusType });
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.deleteTodo(todoId);
      setTodos(todos.filter(t => t.id !== todoId));
      if (selectedTodo?.id === todoId) setSelectedTodo(null);
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = todos.filter(t => t.status === 'completed').length;
  const progressPercent = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  const filteredTodos = todos.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderView = () => {
    const commonProps = {
      todos: filteredTodos,
      onOpenTodo: setSelectedTodo,
      onDeleteTodo: handleDeleteTodo,
    };

    switch (currentView) {
      case 'kanban':
        return (
          <KanbanView
            {...commonProps}
            onToggleStatus={handleToggleStatus}
            onUpdateStatus={(id, status) => handleUpdateTodo(id, { status })}
          />
        );
      case 'calendar':
        return <CalendarView {...commonProps} />;
      case 'gantt':
        return <GanttView {...commonProps} />;
      case 'grid':
        return (
          <GridView
            {...commonProps}
            onUpdateTodo={handleUpdateTodo}
          />
        );
      case 'list':
      default:
        return (
          <ListView
            {...commonProps}
            onToggleStatus={handleToggleStatus}
          />
        );
    }
  };

  if (loading) return <div className="text-center py-20">Loading board...</div>;
  if (!board) return <div className="text-center py-20">Board not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-6 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{board.title}</h1>
          <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center">
            Progress: {completedCount} / {todos.length} Done
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-100 rounded-full h-3 mb-8 overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-grow md:w-64">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>

            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
          </div>

          <div className="flex flex-col items-end w-full lg:w-auto">
            <form onSubmit={handleAddTodo} className="flex gap-2 w-full">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full md:w-64"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 whitespace-nowrap"
              >
                Add
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2 mr-1 font-medium select-none">
              💡 Tip: Click on any task to add details, due dates & more
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        {renderView()}
      </div>

      {selectedTodo && (
        <TaskDetailModal
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onUpdate={(updated) => {
            setTodos(todos.map(t => t.id === updated.id ? updated : t));
            setSelectedTodo(updated);
          }}
          onDelete={handleDeleteTodo}
        />
      )}
    </div>
  );
};

export default BoardDetail;

