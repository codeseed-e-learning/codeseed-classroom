import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

interface Job {
  id: number;
  company_name: string;
  role: string;
  job_description: string;
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('jobs').select('*');
      if (error) {
        setError('Failed to load jobs. Please try again later.');
      } else {
        setJobs(data || []);
        setFilteredJobs(data || []);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search input
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(
        jobs.filter((job) =>
          job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.role.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, jobs]);

  return (
   <>
   <Navbar/>
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Jobs</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {loading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredJobs.length === 0 ? (
        <p className="text-gray-600 text-center">No jobs available.</p>
      ) : (
        <ul className="space-y-4">
          {filteredJobs.map((job) => (
            <li key={job.id} className="p-5 border rounded-lg shadow-md bg-white hover:shadow-lg transition duration-300 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-blue-600">{job.company_name}</h3>
                <p className="text-gray-800 font-medium">{job.role}</p>
                <p className="text-sm text-gray-600 mt-1">{job.job_description}</p>
              </div>
              <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Apply</button>
            </li>
          ))}
        </ul>
      )}
    </div>
   </>
  );
};

export default Jobs;
