
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ComingSoon: React.FC = () => {
  const { feature } = useParams<{ feature: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl font-bold">
          🚀
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-6">Coming Soon</h1>
        <p className="text-xl text-gray-500 mb-2 font-semibold">
          We're working hard to bring <span className="text-indigo-600">{feature}</span> to you.
        </p>
        <p className="text-gray-400 mb-10 leading-relaxed">
          Our team is currently polishing this section to ensure you have the best experience possible. Check back later!
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
