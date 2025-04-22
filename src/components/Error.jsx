import React from 'react';
import { useNavigate } from 'react-router-dom';
 // If you use shadcn/ui or you can replace it with a normal button

const Error = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="bg-[#14182A] min-h-screen flex flex-col items-center justify-center px-4 text-white text-center">
      <h1 className="text-6xl font-bold text-cyan-500 mb-4">404</h1>
      <p className="text-2xl font-semibold mb-2">Oops! Page not found.</p>
      <p className="text-md text-gray-400 mb-6 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button onClick={handleBackHome} className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-2 rounded-xl shadow-lg transition">
        Go to Homepage
      </button>
    </div>
  );
};

export default Error;
