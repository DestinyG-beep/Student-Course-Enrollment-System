import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5555/api/courses")
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Available Courses</h1>

      {loading && <p className="text-gray-500">Loading courses...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {courses.length > 0 ? (
          courses.map((course) => (
            <li key={course.id} className="bg-white p-4 shadow rounded">
              <strong>{course.name}</strong> - {course.department} ({course.credits} credits)
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
