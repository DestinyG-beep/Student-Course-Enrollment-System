// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = ({ user, courses = [] }) => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dyrayvgch/image/upload/v1738510823/homepage_b0mwhc.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 py-24">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">Welcome to CourseHub</h1>
        <p className="text-xl text-white max-w-2xl mx-auto mb-6">
          Discover a world of learning opportunities! Whether you want to upskill, explore new interests, or advance your career, we have the perfect course for you.
        </p>
        <Link
          to="/courses"
          className="bg-blue-600 text-white py-3 px-8 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-500 transition"
        >
          Explore Courses
        </Link>
      </div>
      
      <div className="relative z-10 text-center py-16">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Enroll?</h2>
        <p className="text-lg text-white max-w-xl mx-auto mb-6">
          Begin your journey today and take the first step towards a brighter future.
        </p>
        <Link
          to="/enrollment"
          className="bg-white text-blue-600 py-3 px-8 rounded-full text-xl font-semibold shadow-lg hover:bg-gray-200 transition"
        >
          Enroll Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
