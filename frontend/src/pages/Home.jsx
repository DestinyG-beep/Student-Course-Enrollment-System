import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = ({ courses = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-24 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl mb-4">Welcome to CourseHub</h1>
        <p className="text-lg sm:text-xl mb-6">
          Find the best courses and start learning today.
        </p>
        <Link
          to="/courses"
          className="bg-white text-blue-600 py-2 px-6 rounded-full text-lg font-semibold hover:bg-gray-200 transition"
        >
          Explore Courses
        </Link>
      </section>

      {/* Search Bar */}
      <section className="py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <input
            type="text"
            placeholder="Search for courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 w-full sm:w-1/2 mx-auto border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 px-4 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Featured Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.slice(0, 6).map((course) => (
              <div
                key={course.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-semibold mb-3">{course.name}</h3>
                <p className="text-gray-600 mb-4">
                  {course.description || "No description available."}
                </p>
                <Link
                  to={`/course/${course.id}`}
                  className="text-blue-600 font-semibold hover:text-blue-800"
                >
                  Learn more
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Ready to Enroll?</h2>
        <p className="mb-6">
          Start your learning journey with us today. Enroll in any course that interests you.
        </p>
        <Link
          to="/courses"
          className="bg-white text-blue-600 py-2 px-6 rounded-full text-lg font-semibold hover:bg-gray-200 transition"
        >
          Browse All Courses
        </Link>
      </section>
    </div>
  );
};

export default Home;
