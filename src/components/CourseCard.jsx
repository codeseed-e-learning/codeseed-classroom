import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border max-w-sm">
      <img
        src={course.thumbnail}
        alt={course.course_name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 truncate">{course.course_name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{course.course_description}</p>
        <p className="text-gray-400 text-xs mt-2">Created on {new Date(course.created_at).toLocaleDateString()}</p>
        <Link to={`/course/${course.id}`}>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-full hover:bg-blue-700 transition-all">
            Enroll Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
