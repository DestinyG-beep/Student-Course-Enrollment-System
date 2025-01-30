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
    return jsonify({'students': students_data}), 200