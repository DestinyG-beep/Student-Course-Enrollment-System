from flask import Blueprint, request, jsonify
from models import db, Student, Course, Enrollment

student_bp = Blueprint('students', __name__, url_prefix='/students')

# 🟢 Create a Student
@student_bp.route('/', methods=['POST'])
def create_student():
    data = request.get_json()
    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email are required'}), 400

    new_student = Student(name=data['name'], email=data['email'])
    db.session.add(new_student)
    db.session.commit()
    
    return jsonify({'message': 'Student created successfully', 'student': {'id': new_student.id, 'name': new_student.name, 'email': new_student.email}}), 201

# 🟢 Get all Students
@student_bp.route('/', methods=['GET'])
def get_students():
    students = Student.query.all()
    students_data = [{'id': student.id, 'name': student.name, 'email': student.email} for student in students]
    if not students_data:
        return jsonify({'message': 'No students found'}), 200
    
    return jsonify({'students': students_data}), 200

# 🟢 Get a Student by ID
@student_bp.route('/<int:id>', methods=['GET'])
def get_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    return jsonify({'student': {'id': student.id, 'name': student.name, 'email': student.email}}), 200

# 🟢 Update a Student by ID
@student_bp.route('/<int:id>', methods=['PUT'])
def update_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    data = request.get_json()
    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email are required'}), 400

    student.name = data['name']
    student.email = data['email']
    db.session.commit()

    return jsonify({'message': 'Student updated successfully', 'student': {'id': student.id, 'name': student.name, 'email': student.email}}), 200

# 🟢 Delete a Student by ID
@student_bp.route('/<int:id>', methods=['DELETE'])
def delete_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    db.session.delete(student)
    db.session.commit()

    return jsonify({'message': 'Student deleted successfully'}), 200

# 🟢 Enroll a Student in a Course
@student_bp.route('/<int:student_id>/enroll/<int:course_id>', methods=['POST'])
def enroll_student(student_id, course_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    enrollment = Enrollment(student_id=student_id, course_id=course_id)
    db.session.add(enrollment)
    db.session.commit()

    return jsonify({'message': 'Student enrolled in course successfully', 'enrollment': {'student_id': enrollment.student_id, 'course_id': enrollment.course_id}}), 201

# 🟢 Get all Courses a Student is Enrolled in
@student_bp.route('/<int:student_id>/courses', methods=['GET'])
def get_student_courses(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    enrollments = Enrollment.query.filter_by(student_id=student_id).all()
    courses = [Course.query.get(enrollment.course_id) for enrollment in enrollments]
    courses_data = [{'id': course.id, 'name': course.name, 'description': course.description} for course in courses]

    return jsonify({'courses': courses_data}), 200

course_bp = Blueprint('courses', __name__, url_prefix='/courses')

# 🔵 Get All Courses
@course_bp.route('/', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    courses_data = [{'id': course.id, 'name': course.name, 'description': course.description} for course in courses]
    return jsonify({'courses': courses_data}), 200

# 🔵 Get a Course by ID
@course_bp.route('/<int:id>', methods=['GET'])
def get_course(id):
    course = Course.query.get(id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    return jsonify({'course': {'id': course.id, 'name': course.name, 'description': course.description}}), 200

    
