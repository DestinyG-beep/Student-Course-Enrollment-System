
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Register = () => {
  const initialValues = { username: "", password: "" };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const onSubmit = (values, { resetForm, setSubmitting }) => {
    axios.post("https://student-course-enrollment-system-1.onrender.com/api/register", values)
      .then(response => {
        alert("Registration successful!");
        resetForm();
      })
      .catch(error => {
        alert("Registration failed.");
        console.error("Registration error:", error);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Register</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="username" className="block font-medium">Username:</label>
              <Field name="username" type="text" className="mt-1 p-2 border rounded w-full" />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="password" className="block font-medium">Password:</label>
              <Field name="password" type="password" className="mt-1 p-2 border rounded w-full" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
