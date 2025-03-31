import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { LogOut, User, BookOpen, ChevronDown } from "lucide-react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
        setUserName(user.user_metadata?.full_name || "User");
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();
    return initials.length > 2 ? initials.slice(0, 2) : initials;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <Link to={"/dashboard"}>
              <img
                src="https://codeseed.in/images/logo.png"
                alt="Codeseed Logo"
                className="h-8"
              />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">CodeSeed</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition duration-150">Dashboard</Link>
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 transition duration-150">Jobs</Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition duration-150"
            >
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full text-lg font-bold">
                {getInitials(userName)}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                <div className="px-4 py-2 text-xl font-semibold text-gray-900">
                  {userName}
                </div>
                <hr />
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 w-full text-gray-700 hover:bg-gray-100 transition duration-150"
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                <Link
                  to="/my-courses"
                  className="flex items-center px-4 py-2 w-full text-gray-700 hover:bg-gray-100 transition duration-150"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  My Courses
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 w-full text-red-600 hover:bg-gray-100 transition duration-150"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;