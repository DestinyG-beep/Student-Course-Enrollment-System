import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = ({ user, courses = [] }) => {
  // Optionally, you could allow searching on Home, but per requirements, we'll centralize search in Courses.
  return (
    <div className="relative pt-16"> {/* Extra top padding for fixed navbar */}
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dyrayvgch/image/upload/v1738510823/homepage_b0mwhc.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-35"></div>
      </div>
      
      <div className="relative z-10">
        {/* User Info Badge */}
        <div className="absolute top-4 right-4 flex items-center bg-white rounded-full shadow p-2">
          <img
            src="https://via.placeholder.com/40"  // Replace with actual user image if available.
            alt="User Avatar"
            className="rounded-full mr-2"
          />
          <div>
            <p className="font-bold">{user ? user.name : "John Doe"}</p>
            <p className="text-xs">{user ? user.email : "john@example.com"}</p>
          </div>
        </div>

        {/* Hero Section */}
        <section className="text-white py-24 text-center">
          <div className="max-w-7xl mx-auto px-4">
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
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-white text-center">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Ready to Enroll?</h2>
            <p className="mb-6">
              Start your learning journey with us today. Enroll in any course that interests you.
            </p>
            <Link
              to="/enrollment"
              className="bg-white text-blue-600 py-2 px-6 rounded-full text-lg font-semibold hover:bg-gray-200 transition"
            >
              Enroll Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
