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

@app.route("/api/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()
    return jsonify([{"id": c.id, "name": c.name, "department": c.department, "credits": c.credits} for c in courses])

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

if __name__ == "__main__":
    app.run(debug=True, port=5555)
