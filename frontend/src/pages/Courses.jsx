import { useEffect, useState } from 'react';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5555/courses')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">{course.name}</h2>
            <p className="text-gray-600">{course.department}</p>
            <p className="text-sm text-gray-500">{course.credits} credits</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
