import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

interface Job {
    id: number;
    company_name: string;
    role: string;
    job_description: string;
    application_link: string;
    is_active: boolean;
    location: string;
    remote: boolean; // Remote field (true or false)
}

const Jobs: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
    const [showRemoteOnly, setShowRemoteOnly] = useState<boolean>(false);
    const [locationFilter, setLocationFilter] = useState<string>(''); 
    const [locations, setLocations] = useState<string[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('jobs').select('*');
            if (error) {
                setError('Failed to load jobs. Please try again later.');
            } else {
                setJobs(data || []);
                setFilteredJobs(data || []);

                // Extract unique locations excluding remote
                const uniqueLocations = [...new Set(data.filter(job => !job.remote).map((job) => job.location))];
                setLocations(uniqueLocations);
            }
            setLoading(false);
        };

        fetchJobs();
    }, []);

    // Filter jobs based on search, active status, remote status, and location
    useEffect(() => {
        const filtered = jobs.filter((job) =>
            (showActiveOnly ? job.is_active : true) &&
            (showRemoteOnly ? job.remote : true) && // Filter by remote field
            (searchTerm.trim() === '' ||
                job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (locationFilter === '' || job.location === locationFilter)
        );
        setFilteredJobs(filtered);
    }, [searchTerm, jobs, showActiveOnly, showRemoteOnly, locationFilter]);

    return (
        <>
            <Navbar />
            <div className="max-w-6xl mx-auto p-6 flex gap-6">
                {/* Sidebar for Filters */}
                <div className="w-1/4 p-4 border-r">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Filters</h3>

                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-md mb-4  focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {/* Active Jobs Toggle */}
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={showActiveOnly}
                            onChange={(e) => setShowActiveOnly(e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-gray-700">Show Active Jobs Only</label>
                    </div>

                    {/* Remote Jobs Toggle */}
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={showRemoteOnly}
                            onChange={(e) => setShowRemoteOnly(e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-gray-700">Show Remote Jobs Only</label>
                    </div>

                    {/* Location Filter */}
                    <label className="block text-gray-700 mb-2">Location</label>
                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled={showRemoteOnly} // Disable if "Remote" is selected
                    >
                        <option value="">All Locations</option>
                        {locations.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Job Listings */}
                <div className="w-3/4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Jobs</h2>

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
                                <li
                                    key={job.id}
                                    className="p-5 border rounded-lg bg-white  transition duration-300 flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-600">{job.company_name}</h3>
                                        <p className="text-gray-800 font-medium">{job.role}</p>
                                        <p className="text-sm text-gray-600 mt-1">{job.job_description}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {job.remote ? "Remote" : job.location}
                                        </p>
                                        <p className={`text-sm font-semibold mt-1 ${job.is_active ? "text-green-600" : "text-red-600"}`}>
                                            {job.is_active ? "Active" : "Inactive"}
                                        </p>
                                    </div>

                                    {/* Apply Button */}
                                    <a
                                        href={job.is_active ? job.application_link : undefined}
                                        target={job.is_active ? "_blank" : undefined}
                                        className={`ml-4 px-4 py-2 rounded-md transition duration-300 ${job.is_active
                                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                                : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                            }`}
                                        onClick={(e) => !job.is_active && e.preventDefault()}
                                    >
                                        {job.is_active ? "Apply" : "Closed"}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default Jobs;
