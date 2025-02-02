import React, { useEffect, useState } from "react";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5555/api/courses")
      .then((response) => {
        // If the response contains a 'courses' key, use that array.
        const data = response.data.courses ? response.data.courses : response.data;
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load courses");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Available Courses</h1>
      {loading && <p>Loading courses...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {courses.length > 0 ? (
          courses.map((course) => (
            <li key={course.id} className="bg-white p-4 shadow rounded flex justify-between items-center">
              <div>
                <p className="font-bold">{course.name}</p>
                <p>Department: {course.department}</p>
                <p>Credits: {course.credits}</p>
              </div>
              <button 
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                onClick={() => alert(`Viewing details for ${course.name}`)}
              >
                View Details
              </button>
            </li>
          ))
        ) : (
          !loading && <p className="text-gray-500">No courses available.</p>
        )}
      </ul>
    </div>
  );
};

export default Courses;
