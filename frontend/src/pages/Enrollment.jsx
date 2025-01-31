import React from "react";
import { Link } from "react-router-dom";


const Enrollment = ({ enrolledCourses }) => {
  return (
    <div className="bg-gray-100 py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">Your Enrolled Courses</h1>
        {enrolledCourses.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>You have not enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-semibold mb-3">{course.name}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollment;
