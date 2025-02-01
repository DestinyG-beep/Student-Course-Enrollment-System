from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from models import db, Course, Enrollment, User, Student
from werkzeug.security import generate_password_hash, check_password_hash
from routes import student_bp, course_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize the database
db.init_app(app)

# Register blueprints for students and courses
app.register_blueprint(student_bp)
app.register_blueprint(course_bp)

# ----- Enrollment Endpoints (Standalone) -----
@app.route('/api/enrollments', methods=['GET'])
def get_enrollments():
    enrollments = Enrollment.query.all()
    return jsonify([{
        "id": e.id,
        "student_id": e.student_id,
        "course_id": e.course_id,
        "enrollment_date": e.enrollment_date.isoformat() if e.enrollment_date else None
    } for e in enrollments])

@app.route('/api/enrollments', methods=['POST'])
def create_enrollment():
    data = request.get_json()
    if not data or not data.get("student_name") or not data.get("student_email") or not data.get("course_id"):
        return jsonify({"error": "Missing data"}), 400
    # Find an existing student by email; create one if not exists.
    student = Student.query.filter_by(email=data["student_email"]).first()
    if not student:
        student = Student(name=data["student_name"], email=data["student_email"])
        db.session.add(student)
        db.session.commit()
    enrollment = Enrollment(student_id=student.id, course_id=data["course_id"])
    db.session.add(enrollment)
    db.session.commit()
    return jsonify({"message": "Enrollment created successfully", "id": enrollment.id}), 201

# ----- User Authentication Endpoints -----
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    hashed_pw = generate_password_hash(password)
    user = User(username=username, password_hash=hashed_pw)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"message": "Login successful"}), 200

# ----- Seed Endpoint -----
@app.route('/api/seed', methods=['POST'])
def seed_database():
    # Only seed if no courses exist (production-style: run once)
    if Course.query.first():
        return jsonify({"message": "Database already seeded!"}), 200

    sample_courses = [
        # Engineering (6 courses)
        Course(name="Mechanical Engineering", department="Engineering", credits=4, description="Study of mechanical systems."),
        Course(name="Electrical Engineering", department="Engineering", credits=4, description="Focus on electrical systems and circuits."),
        Course(name="Civil Engineering", department="Engineering", credits=3, description="Design and construction of infrastructure."),
        Course(name="Computer Engineering", department="Engineering", credits=4, description="Combines electrical engineering and computer science."),
        Course(name="Chemical Engineering", department="Engineering", credits=4, description="Application of chemical processes."),
        Course(name="Aerospace Engineering", department="Engineering", credits=4, description="Design of aircraft and spacecraft."),
        # Law and Administration (5 courses)
        Course(name="Criminal Law", department="Law and Administration", credits=3, description="Study of criminal justice system."),
        Course(name="Civil Law", department="Law and Administration", credits=3, description="Fundamentals of civil law."),
        Course(name="Public Administration", department="Law and Administration", credits=3, description="Principles of public management."),
        Course(name="International Law", department="Law and Administration", credits=3, description="Legal aspects of international relations."),
        Course(name="Constitutional Law", department="Law and Administration", credits=3, description="Study of constitutional frameworks."),
        # Languages (5 courses)
        Course(name="English Literature", department="Languages", credits=3, description="Study of English literary works."),
        Course(name="Spanish Language", department="Languages", credits=3, description="Learning Spanish language and culture."),
        Course(name="French Language", department="Languages", credits=3, description="Study of French language."),
        Course(name="German Language", department="Languages", credits=3, description="Study of German language."),
        Course(name="Chinese Language", department="Languages", credits=3, description="Introduction to Mandarin Chinese."),
        # Business (4 courses)
        Course(name="Business Management", department="Business", credits=3, description="Fundamentals of managing a business."),
        Course(name="Marketing", department="Business", credits=3, description="Principles of marketing."),
        Course(name="Finance", department="Business", credits=3, description="Basics of corporate finance."),
        Course(name="Entrepreneurship", department="Business", credits=3, description="Start-up management and innovation."),
        # Art (4 courses)
        Course(name="Art History", department="Art", credits=3, description="Study of art through the ages."),
        Course(name="Painting", department="Art", credits=3, description="Techniques and theory of painting."),
        Course(name="Sculpture", department="Art", credits=3, description="Techniques in sculpture."),
        Course(name="Photography", department="Art", credits=3, description="Principles of photography and composition.")
    ]
    db.session.bulk_save_objects(sample_courses)
    db.session.commit()
    return jsonify({"message": "Database seeded successfully!"}), 201

# ----- Initialize Database Tables -----
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5555)
