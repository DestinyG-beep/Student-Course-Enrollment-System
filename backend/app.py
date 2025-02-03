from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from models import db, Course, Enrollment, User, Student
from werkzeug.security import generate_password_hash, check_password_hash
from routes import student_bp, course_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)

# Register blueprints
app.register_blueprint(student_bp)
app.register_blueprint(course_bp)

# ----- Enrollment Endpoints -----
@app.route('/api/enrollments', methods=['GET'])
def get_enrollments():
    enrollments = Enrollment.query.all()
    return jsonify([{
        "id": e.id,
        "student_id": e.student_id,
        "course_id": e.course_id,
        "note": e.note,
        "status": e.status,
        "enrollment_date": e.enrollment_date.isoformat() if e.enrollment_date else None
    } for e in enrollments])

@app.route('/api/enrollments', methods=['POST'])
def create_enrollment():
    data = request.get_json()
    if not data or not data.get("student_id") or not data.get("course_id"):
        return jsonify({"error": "Missing student_id or course_id"}), 400
    # If student does not exist, create one using fallback data
    student = Student.query.get(data["student_id"])
    if not student:
        student = Student(
            name=data.get("student_name", "John Doe"),
            email=data.get("student_email", "john@example.com")
        )
        db.session.add(student)
        db.session.commit()
    enrollment = Enrollment(
        student_id=student.id,
        course_id=data["course_id"],
        note=data.get("note"),
        status="ongoing"
    )
    db.session.add(enrollment)
    db.session.commit()
    return jsonify({"message": "Enrollment created successfully", "id": enrollment.id}), 201

@app.route('/api/enrollments/<int:id>', methods=['DELETE'])
def delete_enrollment(id):
    enrollment = Enrollment.query.get(id)
    if not enrollment:
        return jsonify({"error": "Enrollment not found"}), 404
    db.session.delete(enrollment)
    db.session.commit()
    return jsonify({"message": "Enrollment deleted successfully"}), 200

@app.route('/api/enrollments/<int:id>', methods=['PATCH'])
def update_enrollment(id):
    enrollment = Enrollment.query.get(id)
    if not enrollment:
        return jsonify({"error": "Enrollment not found"}), 404
    data = request.get_json()
    if "status" in data:
        enrollment.status = data["status"]
    if "note" in data:
        enrollment.note = data["note"]
    db.session.commit()
    return jsonify({"message": "Enrollment updated successfully"}), 200

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
    token = f"token-{user.id}"  # Dummy token for demo🤪
    return jsonify({
        "message": "Login successful",
        "user": {"id": user.id, "username": user.username, "email": user.email if hasattr(user, "email") else ""},
        "token": token
    }), 200

# ----- Seed Endpoint -----
@app.route('/api/seed', methods=['POST'])
def seed_database():
    if Course.query.first():
        return jsonify({"message": "Database already seeded!"}), 200

    sample_courses = [
        # Engineering Faculty (6 courses)
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510862/mechanical_o5aa0r.jpg",
               name="Mechanical Engineering", department="Engineering", credits=4,
               description="Study of mechanical systems and design.", seats_available=50),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510863/electrical_oxzikv.jpg",
               name="Electrical Engineering", department="Engineering", credits=4,
               description="Focus on electrical circuits and power systems.", seats_available=45),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510845/civil_rrtexj.jpg",
               name="Civil Engineering", department="Engineering", credits=3,
               description="Design and construction of infrastructure.", seats_available=40),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510845/civil_rrtexj.jpg",
               name="Computer Engineering", department="Engineering", credits=4,
               description="Combines electrical engineering and computer science.", seats_available=35),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510853/chemical_kokrzv.jpg",
               name="Chemical Engineering", department="Engineering", credits=4,
               description="Application of chemical processes.", seats_available=30),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510854/aerospace_odj7bw.jpg",
               name="Aerospace Engineering", department="Engineering", credits=4,
               description="Design and analysis of aircraft and spacecraft.", seats_available=25),
        # Law and Administration (5 courses)
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510831/criminal_exgutv.jpg",
               name="Criminal Law", department="Law and Administration", credits=3,
               description="Study of criminal justice and legal principles.", seats_available=60),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510838/civil_law_bphn1q.jpg",
               name="Civil Law", department="Law and Administration", credits=3,
               description="Fundamentals of civil litigation and contracts.", seats_available=55),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510831/criminal_exgutv.jpg",
               name="Public Administration", department="Law and Administration", credits=3,
               description="Principles of public management and policy.", seats_available=50),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510828/international_xjlapq.jpg",
               name="International Law", department="Law and Administration", credits=3,
               description="Legal frameworks governing international relations.", seats_available=45),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510830/constitutional_s0y5cv.jpg",
               name="Constitutional Law", department="Law and Administration", credits=3,
               description="Examination of constitutional rights.", seats_available=40),
        # Languages (5 courses)
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1738510816/english_adzr0l.png",
               name="English Literature", department="Languages", credits=3,
               description="Study of classic and modern literature.", seats_available=70),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1738510816/spanish_hxctba.jpg",
               name="Spanish Language", department="Languages", credits=3,
               description="Comprehensive Spanish language course.", seats_available=65),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1738510832/french_de829k.png",
               name="French Language", department="Languages", credits=3,
               description="Fundamentals of the French language and culture.", seats_available=60),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1738510816/german_holea4.png",
               name="German Language", department="Languages", credits=3,
               description="Basics of German language and communication.", seats_available=55),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1738510831/Chinese_vpoyfa.png",
               name="Chinese Language", department="Languages", credits=3,
               description="Introduction to Mandarin Chinese.", seats_available=50),
        # Business (4 courses)
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510835/buss_management_exkojr.jpg",
               name="Business Management", department="Business", credits=3,
               description="Core principles of managing a business.", seats_available=80),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510835/marketing_rfwmqa.jpg",
               name="Marketing", department="Business", credits=3,
               description="Study of marketing strategies.", seats_available=75),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510835/finance_gpbeja.jpg",
               name="Finance", department="Business", credits=3,
               description="Introduction to corporate finance.", seats_available=70),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510824/entrepreneuring_bg8zkp.jpg",
               name="Entrepreneurship", department="Business", credits=3,
               description="Essentials of starting and managing new ventures.", seats_available=65),
        # Art (4 courses)
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510823/art_history_up3vem.jpg",
               name="Art History", department="Art", credits=3,
               description="Overview of art movements and history.", seats_available=40),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510820/painting_osozkf.jpg",
               name="Painting", department="Art", credits=3,
               description="Techniques and theory of painting.", seats_available=35),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510830/sculpture_sya9jz.jpg",
               name="Sculpture", department="Art", credits=3,
               description="Study of sculpture techniques.", seats_available=30),
        Course(image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510820/photography_xcxabg.jpg",
               name="Photography", department="Art", credits=3,
               description="Principles of photography and visual composition.", seats_available=25)
    ]
    db.session.bulk_save_objects(sample_courses)
    db.session.commit()
    return jsonify({"message": "Database seeded successfully!"}), 201

# ----- Initialize Database Tables -----
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5555)
