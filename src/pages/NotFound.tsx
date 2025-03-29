import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-gray-800 dark:text-gray-200">404</h1>
        <p className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          But don't worry, you can go back to the homepage.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
