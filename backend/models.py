from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = "student"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    enrollments = db.relationship('Enrollment', backref='student', cascade='all, delete-orphan')

class Course(db.Model):
    __tablename__ = "course"
    
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(250))  
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(250))
    seats_available = db.Column(db.Integer, nullable=False)
    enrollments = db.relationship('Enrollment', backref='course', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "image": self.image,
            "name": self.name,
            "department": self.department,
            "credits": self.credits,
            "description": self.description,
            "seats_available": self.seats_available
        }

class Enrollment(db.Model):
    __tablename__ = "enrollment"
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("student.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    enrollment_date = db.Column(db.DateTime, default=db.func.now())
    note = db.Column(db.String(250))  
    status = db.Column(db.String(20), nullable=True, default="ongoing")  # e.g., ongoing, deferred, dropped, complete , still not 👍

class User(db.Model):
    __tablename__ = "user"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
