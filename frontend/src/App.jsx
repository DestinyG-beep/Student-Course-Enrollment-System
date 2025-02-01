import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Enrollment from './pages/Enrollment';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';

const App = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5555/api/courses")
      .then(response => setCourses(response.data))
      .catch(error => console.error("Error fetching courses:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<Home courses={courses} />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/enrollment" element={<Enrollment />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
