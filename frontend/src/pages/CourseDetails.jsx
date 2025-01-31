import React from "react";
import { useParams } from "react-router-dom";

const CourseDetail = ({ courses }) => {
  const { id } = useParams();
  const course = courses.find(course => course.id === parseInt(id));

  if (!course) {
    return <div className="text-center">Course not found.</div>;
  }

  return (
    <div className="bg-gray-100 py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-4">{course.name}</h1>
        <p className="text-lg mb-6">{course.description}</p>
        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;
