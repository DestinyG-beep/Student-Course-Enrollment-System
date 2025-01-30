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
