from flask import Blueprint, request, jsonify
from models import db, Student, Course, Enrollment

# ----- Student Blueprint -----
student_bp = Blueprint('students', __name__, url_prefix='/api/students')

@student_bp.route('/', methods=['GET'])
def get_students():
    students = Student.query.all()
    students_data = [{'id': s.id, 'name': s.name, 'email': s.email} for s in students]
    return jsonify({'students': students_data}), 200

@student_bp.route('/<int:student_id>/courses', methods=['GET'])
def get_student_courses(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    enrollments = Enrollment.query.filter_by(student_id=student_id).all()
    courses = [Course.query.get(enrollment.course_id) for enrollment in enrollments]
    courses_data = [course.to_dict() for course in courses if course]
    return jsonify({'courses': courses_data}), 200

# ----- Course Blueprint -----
course_bp = Blueprint('courses', __name__, url_prefix='/api/courses')

@course_bp.route('/', methods=['GET'])
def get_all_courses():
    courses = Course.query.all()
    courses_data = [course.to_dict() for course in courses]
    return jsonify({'courses': courses_data}), 200

@course_bp.route('/<int:id>', methods=['GET'])
def get_course(id):
    course = Course.query.get(id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    return jsonify({'course': course.to_dict()}), 200
