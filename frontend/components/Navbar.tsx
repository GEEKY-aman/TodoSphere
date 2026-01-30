
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const navLinks = ['Product', 'Features', 'Pricing', 'API'];

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
        TodoSphere
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link key={link} to={`/coming-soon/${link}`} className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">
            {link}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
