// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-600 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: App Name */}
        <Link to="/" className="text-2xl font-bold">CourseHub</Link>
        {/* Center: Navigation Links */}
        <ul className="flex space-x-4 text-lg">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/courses" className="hover:underline">Courses</Link>
          </li>
          <li>
            <Link to="/enrollment" className="hover:underline">Enrollment</Link>
          </li>
          <li>
            <Link to="/register" className="hover:underline">Register</Link>
          </li>
          <li>
            <Link to="/login" className="hover:underline">Login</Link>
          </li>
        </ul>
        {/* Right: User Info Badge */}
        <div className="flex items-center bg-white rounded-full shadow p-2">
          <img
            src="https://res.cloudinary.com/dyrayvgch/image/upload/c_thumb,w_40,g_face/v1738510819/user_icon_pkyxja.jpg"
            alt="User Avatar"
            className="rounded-full w-10 h-10 mr-2"
          />
          <div className="text-black">
            <p className="font-bold">{user ? user.name : "User101"}</p>
            <p className="text-xs">{user ? user.email : "User101@gmail.com"}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
