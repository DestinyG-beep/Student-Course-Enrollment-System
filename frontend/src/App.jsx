import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Enrollment from "./pages/Enrollment";

const App = () => {
  const courses = [
    { id: 1, name: 'Introduction to Programming', description: 'Learn the basics of programming in Python.' },
    { id: 2, name: 'Web Development with React', description: 'Build modern web applications using React.js.' },
    { id: 3, name: 'Data Science with Python', description: 'Analyze data using Python and machine learning techniques.' },
    { id: 4, name: 'Database Management', description: 'Learn about relational databases and SQL.' },
    { id: 5, name: 'Mobile App Development', description: 'Create mobile applications for Android and iOS.' },
    { id: 6, name: 'Machine Learning 101', description: 'Understand the foundations of machine learning.' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 shadow-md">
        <ul className="flex justify-center space-x-6 text-white font-semibold">
          <li>
            <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          </li>
          <li>
            <Link to="/courses" className="hover:text-gray-300 transition">Courses</Link>
          </li>
          <li>
            <Link to="/enrollment" className="hover:text-gray-300 transition">Enrollment</Link>
          </li>
        </ul>
      </nav>

      {/* Page Content */}
      <div className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<Home courses={courses} />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/enrollment" element={<Enrollment />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
