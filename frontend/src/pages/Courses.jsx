import { useState, useEffect } from "react";
import React from "react";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id} className="p-2 border-b">{course.name} - {course.credits} Credits</li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
