import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 fixed top-0 left-0 right-0 z-50">
      <ul className="flex space-x-4 text-white justify-center">
        <li>
          <Link to="/" className="hover:text-gray-200 transition">Home</Link>
        </li>
        <li>
          <Link to="/courses" className="hover:text-gray-200 transition">Courses</Link>
        </li>
        <li>
          <Link to="/enrollment" className="hover:text-gray-200 transition">Enrollment</Link>
        </li>
        <li>
          <Link to="/register" className="hover:text-gray-200 transition">Register</Link>
        </li>
        <li>
          <Link to="/login" className="hover:text-gray-200 transition">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
