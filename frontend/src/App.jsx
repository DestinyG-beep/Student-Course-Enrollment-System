// src/App.jsx
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
  // Dummy user info for demonstration; replace with real auth logic in production.
  const dummyUser = {
    id: 1,
    name: "John Doe",
    email: "john@example.com"
  };

  useEffect(() => {
    axios.get("http://localhost:5555/api/courses")
      .then(response => {
        const data = response.data.courses ? response.data.courses : response.data;
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch(error => console.error("Error fetching courses:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-16">
      <Navbar user={dummyUser} />
      <div className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<Home user={dummyUser} courses={courses} />} />
          <Route path="/courses" element={<Courses courses={courses} />} />
          <Route path="/enrollment" element={<Enrollment user={dummyUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
