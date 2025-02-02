import React, { useState, useEffect } from "react";
import axios from "axios";

const Courses = ({ courses: initialCourses = [] }) => {
  const [courses, setCourses] = useState(initialCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters state for search by name, credits, department, and minimum seats.
  const [searchTerm, setSearchTerm] = useState("");
  const [minCredits, setMinCredits] = useState("");
  const [department, setDepartment] = useState("");
  const [minSeats, setMinSeats] = useState("");

  // For expanded course details view
  const [expandedCourse, setExpandedCourse] = useState(null);

  // Fetch courses if not provided via props
  useEffect(() => {
    if (initialCourses.length === 0) {
      axios.get("http://localhost:5555/api/courses")
        .then(response => {
          const data = response.data.courses ? response.data.courses : response.data;
          setCourses(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(error => {
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
    const matchesDepartment = department === "" || course.department.toLowerCase() === department.toLowerCase();
    const matchesSeats = minSeats === "" || course.seats_available >= Number(minSeats);
    return matchesName && matchesCredits && matchesDepartment && matchesSeats;
  });

  return (
    <div className="p-6 pt-20"> {/* Extra top padding for fixed navbar */}
      {/* Fixed Horizontal Search Bar */}
      <div className="fixed top-16 left-0 right-0 bg-white shadow z-40 p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:w-1/3"
          />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:w-1/4"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Law and Administration">Law and Administration</option>
            <option value="Languages">Languages</option>
            <option value="Business">Business</option>
            <option value="Art">Art</option>
          </select>
          <input
            type="number"
            placeholder="Min Credits"
            value={minCredits}
            onChange={(e) => setMinCredits(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:w-1/4"
          />
          <input
            type="number"
            placeholder="Min Seats Available"
            value={minSeats}
            onChange={(e) => setMinSeats(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:w-1/4"
          />
        </div>
      </div>

      <div className="mt-24"> {/* Margin-top to account for fixed search bar */}
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Available Courses</h1>
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
                    onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                  >
                    {expandedCourse === course.id ? "Hide Details" : "View Details"}
                  </button>
                </div>
                {expandedCourse === course.id && (
                  <div className="mt-4 flex">
                    <div className="w-1/4">
                      <img
                        src={course.image}
                        alt={course.name}
                        className="rounded object-cover h-32 w-full"
                      />
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
    </div>
  );
};

export default Courses;
