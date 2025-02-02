// src/pages/Enrollment.jsx
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Enrollment = ({ user }) => {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all courses for the enrollment dropdown.
  useEffect(() => {
    axios.get("http://localhost:5555/api/courses")
      .then((response) => {
        const data = response.data.courses || response.data;
        setAllCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  // Fetch enrolled courses for the logged-in user.
  useEffect(() => {
    if (user && user.id) {
      axios.get(`http://localhost:5555/api/students/${user.id}/courses`)
        .then((response) => {
          const data = response.data.courses || [];
          setMyCourses(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error("Error fetching my courses:", error);
        });
    }
  }, [user]);

  const initialValues = {
    student_name: user ? user.name : "",
    student_email: user ? user.email : "",
    course_id: ""
  };

  const validationSchema = Yup.object({
    student_name: Yup.string().required("Required"),
    student_email: Yup.string().email("Invalid email").required("Required"),
    course_id: Yup.string().required("Please select a course")
  });

  const onSubmit = (values, { resetForm, setSubmitting }) => {
    axios.post("http://localhost:5555/api/enrollments", values)
      .then((response) => {
        alert("Enrollment successful!");
        resetForm();
        // Refresh "My Courses" list after enrollment
        if (user && user.id) {
          axios.get(`http://localhost:5555/api/students/${user.id}/courses`)
            .then((response) => {
              const data = response.data.courses || [];
              setMyCourses(Array.isArray(data) ? data : []);
            })
            .catch((error) => console.error("Error fetching my courses:", error));
        }
      })
      .catch((error) => {
        alert("Error enrolling. Please try again.");
        console.error("Enrollment error:", error);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Enroll in a Course</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {formik => (
          <Form className="space-y-4 max-w-md mx-auto">
            <div>
              <label htmlFor="student_name" className="block font-medium">Name:</label>
              <Field name="student_name" type="text" className="mt-1 p-2 border rounded w-full" />
              <ErrorMessage name="student_name" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="student_email" className="block font-medium">Email:</label>
              <Field name="student_email" type="email" className="mt-1 p-2 border rounded w-full" />
              <ErrorMessage name="student_email" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="course_id" className="block font-medium">Course:</label>
              <Field as="select" name="course_id" className="mt-1 p-2 border rounded w-full">
                <option value="">Select a course</option>
                {Array.isArray(allCourses) &&
                  allCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} - {course.department} ({course.credits} credits)
                    </option>
                  ))
                }
              </Field>
              <ErrorMessage name="course_id" component="div" className="text-red-500 text-sm" />
            </div>
            <button type="submit" disabled={formik.isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
              Enroll
            </button>
          </Form>
        )}
      </Formik>

      {/* My Courses Section */}
      <div className="mt-12 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">My Courses</h2>
        {myCourses.length > 0 ? (
          <ul className="space-y-2">
            {myCourses.map(course => (
              <li key={course.id} className="bg-white p-4 rounded shadow">
                <p className="font-bold">{course.name}</p>
                <p>Department: {course.department}</p>
                <p>Credits: {course.credits}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default Enrollment;
