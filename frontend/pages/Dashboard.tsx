
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../App';
import { Board } from '../types';

const Dashboard: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    if (!user) return;
    try {
      // API now uses token from localStorage, no need to pass userId
      const data = await api.getBoards();
      setBoards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) {
      alert("Please enter a name for your board.");
      return;
    }
    if (!user) return;
    try {
      // API now uses token from localStorage, no need to pass userId
      const board = await api.createBoard(newBoardTitle);
      setBoards([board, ...boards]);
      setNewBoardTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBoard = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this board? All todos inside will be lost.')) return;
    try {
      await api.deleteBoard(id);
      setBoards(boards.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Boards</h1>
          <p className="text-gray-500">Welcome back, {user?.name}.</p>
        </div>

        <form onSubmit={handleAddBoard} className="flex gap-2">
          <input
            type="text"
            placeholder="New board name..."
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full md:w-64"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100 whitespace-nowrap"
          >
            Create Board
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading your space...</div>
      ) : boards.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📁</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No boards yet</h3>
          <p className="text-gray-500">Create your first board to start managing your tasks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <div key={board.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <Link to={`/board/${board.id}`} className="block flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">{board.title}</h3>
                </Link>
                <button
                  onClick={() => handleDeleteBoard(board.id)}
                  className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Board"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider font-semibold">
                Created on {new Date(board.createdAt).toLocaleDateString()}
              </p>
              <Link
                to={`/board/${board.id}`}
                className="inline-flex items-center text-indigo-600 font-bold text-sm hover:underline"
              >
                Open Board
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
