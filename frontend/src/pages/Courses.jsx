// src/pages/Courses.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const Courses = ({ courses: initialCourses = [] }) => {
  const [courses, setCourses] = useState(initialCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [minCredits, setMinCredits] = useState("");
  const [department, setDepartment] = useState("");
  const [minSeats, setMinSeats] = useState("");

  // For handling expanded course details (store course ID that is expanded)
  const [expandedCourse, setExpandedCourse] = useState(null);

  // Fetch courses from backend (if not provided via props)
  useEffect(() => {
    if (initialCourses.length === 0) {
      axios.get("http://localhost:5555/api/courses")
        .then((response) => {
          const data = response.data.courses ? response.data.courses : response.data;
          setCourses(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load courses");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [initialCourses]);

  // Apply filters
  const filteredCourses = courses.filter(course => {
    const matchesName = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCredits = minCredits === "" || course.credits >= Number(minCredits);
    const matchesDepartment = department === "" || course.department.toLowerCase().includes(department.toLowerCase());
    const matchesSeats = minSeats === "" || course.seats_available >= Number(minSeats);
    return matchesName && matchesCredits && matchesDepartment && matchesSeats;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Available Courses</h1>
      
      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/3"
        />
        <input
          type="number"
          placeholder="Minimum Credits"
          value={minCredits}
          onChange={(e) => setMinCredits(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/4"
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/4"
        />
        <input
          type="number"
          placeholder="Minimum Seats Available"
          value={minSeats}
          onChange={(e) => setMinSeats(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/4"
        />
      </div>

      {loading && <p>Loading courses...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <ul className="space-y-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <li key={course.id} className="bg-white p-4 shadow rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{course.name}</p>
                  <p>Department: {course.department}</p>
                  <p>Credits: {course.credits}</p>
                  <p>Seats Available: {course.seats_available}</p>
                </div>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  onClick={() =>
                    setExpandedCourse(expandedCourse === course.id ? null : course.id)
                  }
                >
                  {expandedCourse === course.id ? "Hide Details" : "View Details"}
                </button>
              </div>
              {expandedCourse === course.id && (
                <div className="mt-4 flex">
                  <div className="w-1/4">
                    {/* Placeholder Image */}
                    <img src="https://via.placeholder.com/150" alt={course.name} className="rounded"/>
                  </div>
                  <div className="w-3/4 pl-4">
                    <p className="text-gray-700">{course.description || "No description available."}</p>
                  </div>
                </div>
              )}
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
