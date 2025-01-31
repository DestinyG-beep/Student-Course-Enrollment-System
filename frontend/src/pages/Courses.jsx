import React, { useEffect, useState } from "react";
import axios from "axios";

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
      .catch((err) => {
        setError("Failed to load courses");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Courses</h1>
      {loading && <p>Loading courses...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-4">
        {courses.map((course) => (
          <li key={course.id} className="border p-2 mb-2 bg-white rounded-md">
            <p><strong>{course.name}</strong></p>
            <p>Department: {course.department}</p>
            <p>Credits: {course.credits}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
