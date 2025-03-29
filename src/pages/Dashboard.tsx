import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex h-screen w-full justify-center items-center px-4">
        <div className="bg-white p-8 rounded-xl border border text-center max-w-lg">
          <h2 className="text-4xl font-bold text-gray-900">🚀 Dashboard Coming Soon!</h2>
          <p className="text-gray-600 mt-4 text-lg">
            We're working hard to bring you an awesome dashboard experience.
          </p>
          <p className="text-gray-700 mt-2">
            Until then, <Link to={"/learn"} className="text-blue-600 font-medium hover:underline">access your free course</Link> and start learning today!
          </p>
          <Link to="/learn">
            <button className="mt-6 bg-black text-white px-6 py-2 rounded-lg text-lg shadow-sm hover:bg-black-700 transition-all">
              🎓 Start Learning
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
