
import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Manage tasks like <span className="text-indigo-600">magic.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 leading-relaxed">
          TodoSphere helps you organize your work through beautiful boards,
          tracking progress effortlessly so you can focus on what matters.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
            Get Started for Free
          </Link>
          <Link to="/login" className="w-full sm:w-auto bg-gray-50 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all">
            View Live Demo
          </Link>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">1</div>
            <h3 className="text-xl font-bold mb-4">Create Boards</h3>
            <p className="text-gray-500">Group your tasks by projects, goals, or categories. Keep everything organized in one place.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">2</div>
            <h3 className="text-xl font-bold mb-4">Add Todos</h3>
            <p className="text-gray-500">Quickly jot down things you need to do. Mark them as completed with a single click.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">3</div>
            <h3 className="text-xl font-bold mb-4">Track Progress</h3>
            <p className="text-gray-500">See your productivity at a glance with beautiful progress indicators for every board.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
