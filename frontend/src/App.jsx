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
  // Dummy user for demo; in a real app, use authentication state.
  const dummyUser = {
    id: 1,
    name: "John Doe",
    email: "john@example.com"
  };

  useEffect(() => {
    axios.get("http://localhost:5555/api/courses")
      .then(response => {
        // Expecting response.data to be either { courses: [...] } or a plain array.
        const data = response.data.courses ? response.data.courses : response.data;
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch(error => console.error("Error fetching courses:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow p-6">
        <Routes>
          {/* Pass dummyUser and courses as props to appropriate pages */}
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
