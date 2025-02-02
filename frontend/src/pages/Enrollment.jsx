import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Enrollment = () => {
  // Initialize courses state as an empty array.
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5555/api/courses")
      .then((response) => {
        // If your API returns an object like { courses: [...] },
        // extract the courses array. Otherwise, use the response data directly.
        const data = response.data.courses || response.data;
        // Use Array.isArray to ensure we're setting an array.
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const initialValues = {
    student_name: "",
    student_email: "",
    course_id: ""
  };

  const validationSchema = Yup.object({
    student_name: Yup.string().required("Required"),
    student_email: Yup.string().email("Invalid email").required("Required"),
    course_id: Yup.string().required("Please select a course")
  });

  const onSubmit = (values, { resetForm, setSubmitting }) => {
    axios
      .post("http://localhost:5555/api/enrollments", values)
      .then((response) => {
        alert("Enrollment successful!");
        resetForm();
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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {formik => (
          <Form className="space-y-4 max-w-md mx-auto">
            <div>
              <label htmlFor="student_name" className="block font-medium">Name:</label>
              <Field
                name="student_name"
                type="text"
                className="mt-1 p-2 border rounded w-full"
              />
              <ErrorMessage name="student_name" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="student_email" className="block font-medium">Email:</label>
              <Field
                name="student_email"
                type="email"
                className="mt-1 p-2 border rounded w-full"
              />
              <ErrorMessage name="student_email" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="course_id" className="block font-medium">Course:</label>
              <Field as="select" name="course_id" className="mt-1 p-2 border rounded w-full">
                <option value="">Select a course</option>
                {Array.isArray(courses) &&
                  courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} - {course.department} ({course.credits} credits)
                    </option>
                  ))
                }
              </Field>
              <ErrorMessage name="course_id" component="div" className="text-red-500 text-sm" />
            </div>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Enroll
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Enrollment;
