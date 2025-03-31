import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserAndCourses = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        const loggedInUser = session?.user;
        if (!loggedInUser) {
          setError("You must be logged in to view courses.");
          setLoading(false);
          return;
        }

        setUser(loggedInUser);

        // Fetch enrolled courses from `enrollments` table
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from("enrollments")
          .select("course_id")
          .eq("profile_id", loggedInUser.id);  // ✅ Fixed: Use "profile_id" instead of "user_id"


        if (enrollmentsError) throw enrollmentsError;

        const enrolledCourseIds = enrollments.map((enrollment) => enrollment.course_id);

        if (enrolledCourseIds.length === 0) {
          setCourses([]);
          setLoading(false);
          return;
        }

        // Fetch only the courses the user is enrolled in
        const { data: enrolledCourses, error: coursesError } = await supabase
          .from("courses")
          .select("*")
          .in("id", enrolledCourseIds)
          .order("created_at", { ascending: false });

        if (coursesError) throw coursesError;

        if (isMounted) {
          setCourses(enrolledCourses);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserAndCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/400x200?text=No+Thumbnail";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          📚 Your Enrolled Courses
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 bg-red-50 rounded-lg max-w-md mx-auto">
            <p className="text-red-600">{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md mx-auto">
            <p className="text-gray-600">You are not enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={course.thumbnail || "https://via.placeholder.com/400x200?text=No+Thumbnail"}
                  alt={`Thumbnail for ${course.course_name}`}
                  className="w-full h-48 object-cover"
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {course.course_name}
                  </h2>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 flex">
                    {course.paid ? (
                      <>
                      <p>
                      ₹<del className="text-red-500">{course.original_price}</del>&nbsp;
                      </p>
                        <p className="text-green-500">₹{course.discounted_price}</p>
                      </>
                    ) : (
                      <p className="text-green-500">FREE</p>
                    )}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {course.course_description || "No description available"}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Created: {formatDate(course.created_at)}
                  </p>
                  <Link
                    to={`/learn/${course.id}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
                    aria-label={`Enroll in ${course.course_name}`}
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
