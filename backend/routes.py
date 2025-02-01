from flask import Blueprint, request, jsonify
from models import db, Student, Course, Enrollment

# ----- Student Blueprint -----
student_bp = Blueprint('students', __name__, url_prefix='/api/students')

@student_bp.route('/', methods=['POST'])
def create_student():
    data = request.get_json()
    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email are required'}), 400
    new_student = Student(name=data['name'], email=data['email'])
    db.session.add(new_student)
    db.session.commit()
    return jsonify({
        'message': 'Student created successfully',
        'student': {'id': new_student.id, 'name': new_student.name, 'email': new_student.email}
    }), 201

@student_bp.route('/', methods=['GET'])
def get_students():
    students = Student.query.all()
    students_data = [{'id': s.id, 'name': s.name, 'email': s.email} for s in students]
    return jsonify({'students': students_data}), 200

# (Other student endpoints omitted for brevity; they can be added as needed)

# ----- Course Blueprint -----
course_bp = Blueprint('courses', __name__, url_prefix='/api/courses')

@course_bp.route('/', methods=['GET'])
def get_all_courses():
    courses = Course.query.all()
    courses_data = [{
        'id': course.id,
        'name': course.name,
        'department': course.department,
        'credits': course.credits,
        'description': course.description
    } for course in courses]
    return jsonify({'courses': courses_data}), 200

@course_bp.route('/<int:id>', methods=['GET'])
def get_course(id):
    course = Course.query.get(id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    return jsonify({'course': {
        'id': course.id,
        'name': course.name,
        'department': course.department,
        'credits': course.credits,
        'description': course.description
    }}), 200
