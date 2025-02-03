// src/app.js
const API_URL = "https://student-course-enrollment-system-1.onrender.com";

export async function fetchStudents() {
  const response = await fetch(`${API_URL}/api/students/`);
  return response.json();
}

export async function fetchCourses() {
  const response = await fetch(`${API_URL}/api/courses/`);
  return response.json();
}

export async function enrollStudent(studentId, courseId, note = "") {
  const response = await fetch(`${API_URL}/api/enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId, course_id: courseId, note }),
  });
  return response.json();
}
/*not in use */