from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    credits = db.Column(db.Integer, nullable=False)

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    student_name = db.Column(db.String(100), nullable=False)
    student_email = db.Column(db.String(100), nullable=False)

@app.route("/api/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()
    return jsonify([{"id": c.id, "name": c.name, "department": c.department, "credits": c.credits} for c in courses])

@app.route("/api/enrollments", methods=["GET"])
def get_enrollments():
    enrollments = Enrollment.query.all()
    return jsonify([{
        "id": e.id,
        "course_id": e.course_id,
        "student_name": e.student_name,
        "student_email": e.student_email
    } for e in enrollments])

@app.route("/api/enrollments", methods=["POST"])
def create_enrollment():
    data = request.get_json()
    # Expecting keys: student_name, student_email, course_id
    if not data or not data.get("student_name") or not data.get("student_email") or not data.get("course_id"):
        return jsonify({"error": "Missing data"}), 400
    enrollment = Enrollment(
        student_name=data["student_name"],
        student_email=data["student_email"],
        course_id=data["course_id"]
    )
    db.session.add(enrollment)
    db.session.commit()
    return jsonify({"message": "Enrollment created successfully", "id": enrollment.id}), 201

@app.route("/")
def index():
    return "Welcome to the Student Course Enrollment API!"



@app.route("/api/courses/<int:course_id>", methods=["GET"])
def get_course(course_id):
    course = Course.query.get_or_404(course_id)
    return jsonify({"id": course.id, "name": course.name, "department": course.department, "credits": course.credits})

@app.route("/api/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()
    return jsonify([{"id": c.id, "name": c.name, "department": c.department, "credits": c.credits} for c in courses])

@app.route("/students")
def students():
    return "Students"

@app.route("/api/seed", methods=["POST"])
def seed_database():
    sample_courses = [
        Course(name="Introduction to Programming", department="Computer Science", credits=3),
        Course(name="Data Structures and Algorithms", department="Computer Science", credits=4),
        Course(name="Calculus I", department="Mathematics", credits=3)
    ]
    db.session.bulk_save_objects(sample_courses)
    db.session.commit()
    return jsonify({"message": "Database seeded successfully!"}), 201

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5555)
