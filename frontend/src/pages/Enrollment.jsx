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
    axios.get("https://student-course-enrollment-system-1.onrender.com/api/courses")
      .then((response) => {
        const data = response.data.courses || response.data;
        setAllCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, []);

  // Fetch enrolled courses for the logged-in user.
  const fetchMyCourses = () => {
    axios.get(`https://student-course-enrollment-system-1.onrender.com/api/students/${user.id}/courses`)
      .then((response) => {
        const data = response.data.courses || [];
        setMyCourses(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching my courses:", err);
      });
  };

  useEffect(() => {
    if (user && user.id) {
      fetchMyCourses();
    }
  }, [user]);

  const initialValues = {
    course_id: ""
  };

  const validationSchema = Yup.object({
    course_id: Yup.string().required("Please select a course")
  });

  const onSubmit = (values, { resetForm, setSubmitting }) => {
    const enrollmentData = {
      student_id: user.id,
      // Send fallback values for student in case not found:
      student_name: user.name,
      student_email: user.email,
      course_id: values.course_id,
      note: "" // initially empty; can be updated later via PATCH
    };
    axios.post("https://student-course-enrollment-system-1.onrender.com/api/enrollments", enrollmentData)
      .then((response) => {
        alert("Enrollment successful!");
        resetForm();
        fetchMyCourses();  // Refresh enrolled courses
      })
      .catch((error) => {
        alert("Error enrolling. Please try again.");
        console.error("Enrollment error:", error);
      })
      .finally(() => setSubmitting(false));
  };

  // Delete enrollment; assumes each myCourses object contains an enrollment_id field.
  const handleDelete = (enrollmentId) => {
    axios.delete(`hhttps://student-course-enrollment-system-1.onrender.com/api/enrollments/${enrollmentId}`)
      .then(() => {
        alert("Enrollment deleted.");
        fetchMyCourses();
      })
      .catch(err => {
        console.error("Error deleting enrollment:", err);
      });
  };

  // Update enrollment status and note (for demo, hard-coded update)
  const handleUpdate = (enrollmentId, newStatus, newNote) => {
    axios.patch(`https://student-course-enrollment-system-1.onrender.com/api/enrollments/${enrollmentId}`, {
      status: newStatus,
      note: newNote
    })
      .then(() => {
        alert("Enrollment updated.");
        fetchMyCourses();
      })
      .catch(err => {
        console.error("Error updating enrollment:", err);
      });
  };

  return (
    <div className="p-6 pt-20">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Enroll in a Course</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {formik => (
          <Form className="space-y-4 max-w-md mx-auto">
            <div>
              <label htmlFor="course_id" className="block font-medium">Course:</label>
              <Field as="select" name="course_id" className="mt-1 p-2 border rounded w-full">
                <option value="">Select a course</option>
                {Array.isArray(allCourses) &&
                  allCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} - {course.department} ({course.credits} credits, {course.seats_available} seats)
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
              <li key={course.enrollment_id || course.id} className="bg-white p-4 rounded shadow flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="font-bold">{course.name}</p>
                  <p>Department: {course.department}</p>
                  <p>Credits: {course.credits}</p>
                  <p>Status: {course.status}</p>
                  <p>Note: {course.note || "No comments"}</p>
                </div>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(course.enrollment_id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    onClick={() => handleUpdate(course.enrollment_id, "complete", "Finished successfully")}
                  >
                    Mark Complete
                  </button>
                </div>
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
