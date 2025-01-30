import React from "react";
import {Routes , Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Enrollment from "./pages/Enrollment";

const App = () => {
  return (
    <div className="h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <ul className="flex space-x-4 text-white">
          <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
          <li><Link to="/courses" className="hover:text-gray-200">Courses</Link></li>
          <li><Link to="/enrollment" className="hover:text-gray-200">Enrollment</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/enrollment" element={<Enrollment />} />
      </Routes>
    </div>
  );
};

export default App;
