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

#home
@app.route('/')
def home():
    info = {
        "message": "Welcome to the CourseHub API Backend",
        "description": "This API allows you to view courses, manage enrollments, and perform user authentication.",
        "routes": {
            "/api/courses": "GET: Retrieve list of all courses.",
            "/api/enrollments": "GET: Retrieve enrollments; POST: Create an enrollment; PATCH: Update an enrollment; DELETE: Delete an enrollment.",
            "/api/register": "POST: Register a new user.",
            "/api/login": "POST: Login with credentials to receive a token.",
            "/api/students": "GET: Retrieve list of students.",
            "/api/students/<id>/courses": "GET: Retrieve courses a specific student is enrolled in."
        }
    }
    return jsonify(info), 200

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
    token = f"token-{user.id}"  # Dummy token for demo
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
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510862/mechanical_o5aa0r.jpg",
            name="Mechanical Engineering", 
            department="Engineering", 
            credits=4,
            description=("In Mechanical Engineering, students explore the fundamentals of mechanics, "
                         "materials science, thermodynamics, and energy. This course provides hands-on experience "
                         "in designing mechanical systems and solving real-world challenges in areas such as automotive, "
                         "aerospace, and robotics."),
            seats_available=50
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510863/electrical_oxzikv.jpg",
            name="Electrical Engineering", 
            department="Engineering", 
            credits=4,
            description=("Electrical Engineering focuses on the principles of electrical circuits, signals, and systems. "
                         "Students learn about power generation, control systems, and digital electronics through both theory "
                         "and practical laboratory work."),
            seats_available=45
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510845/civil_rrtexj.jpg",
            name="Civil Engineering", 
            department="Engineering", 
            credits=3,
            description=("Civil Engineering covers the design, construction, and maintenance of infrastructure. "
                         "Students gain experience in structural analysis, material properties, and environmental considerations "
                         "to build safe and sustainable structures."),
            seats_available=40
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510852/computer_qacd7c.jpg",
            name="Computer Engineering", 
            department="Engineering", 
            credits=4,
            description=("Combining aspects of electrical engineering and computer science, Computer Engineering delves into "
                         "hardware-software integration, embedded systems, and digital circuit design, preparing students for "
                         "innovative technology solutions."),
            seats_available=35
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510853/chemical_kokrzv.jpg",
            name="Chemical Engineering", 
            department="Engineering", 
            credits=4,
            description=("Chemical Engineering applies principles of chemistry, physics, and biology to solve problems related to "
                         "the production or use of chemicals, fuels, drugs, and food. Students learn to design processes that are "
                         "efficient, sustainable, and safe."),
            seats_available=30
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510854/aerospace_odj7bw.jpg",
            name="Aerospace Engineering", 
            department="Engineering", 
            credits=4,
            description=("Aerospace Engineering focuses on the design, development, and testing of aircraft and spacecraft. "
                         "Students learn about aerodynamics, propulsion, structural analysis, and materials used in high-performance "
                         "vehicles in both civil and defense sectors."),
            seats_available=25
        ),
        # Law and Administration (5 courses)
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510831/criminal_exgutv.jpg",
            name="Criminal Law", 
            department="Law and Administration", 
            credits=3,
            description=("Criminal Law provides an in-depth overview of legal principles related to criminal offenses, "
                         "the rights of the accused, and the procedures of the criminal justice system. Students analyze landmark cases "
                         "and contemporary issues in criminal justice."),
            seats_available=60
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510838/civil_law_bphn1q.jpg",
            name="Civil Law", 
            department="Law and Administration", 
            credits=3,
            description=("This course examines the principles of civil law including contracts, torts, property rights, and family law. "
                         "Students learn how legal disputes are resolved in civil courts and the role of mediation and arbitration."),
            seats_available=55
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510831/criminal_exgutv.jpg",
            name="Public Administration", 
            department="Law and Administration", 
            credits=3,
            description=("Public Administration covers the management and organization of government policies and programs. "
                         "Students explore topics such as public budgeting, ethics, and policy analysis to understand the functioning "
                         "of public institutions."),
            seats_available=50
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510828/international_xjlapq.jpg",
            name="International Law", 
            department="Law and Administration", 
            credits=3,
            description=("International Law focuses on the legal frameworks governing relations between nations. "
                         "Students study treaties, human rights, trade laws, and conflict resolution in a global context."),
            seats_available=45
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/v1738510830/constitutional_s0y5cv.jpg",
            name="Constitutional Law", 
            department="Law and Administration", 
            credits=3,
            description=("This course examines the structure and interpretation of constitutional law, including the rights "
                         "and responsibilities of citizens. Through landmark decisions and current issues, students explore the impact "
                         "of constitutional principles on modern governance."),
            seats_available=40
        ),
        # Languages (5 courses)
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1738510816/english_adzr0l.png",
            name="English Literature", 
            department="Languages", 
            credits=3,
            description=("English Literature explores a diverse range of texts from classic to contemporary literature. "
                         "Students learn critical analysis, literary theory, and historical context to appreciate influential works."),
            seats_available=70
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1738510816/spanish_hxctba.jpg",
            name="Spanish Language", 
            department="Languages", 
            credits=3,
            description=("This course offers comprehensive instruction in Spanish language, covering grammar, conversation, "
                         "and cultural studies to develop fluency and communication skills."),
            seats_available=65
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1738510832/french_de829k.png",
            name="French Language", 
            department="Languages", 
            credits=3,
            description=("French Language introduces students to the fundamentals of French communication and culture. "
                         "Emphasis is placed on speaking, listening, and understanding the nuances of everyday French."),
            seats_available=60
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1738510816/german_holea4.png",
            name="German Language", 
            department="Languages", 
            credits=3,
            description=("This course provides a solid foundation in German language, focusing on vocabulary, grammar, and practical "
                         "conversation skills, along with an introduction to German culture."),
            seats_available=55
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1738510831/Chinese_vpoyfa.png",
            name="Chinese Language", 
            department="Languages", 
            credits=3,
            description=("Introduction to Mandarin Chinese covers basic vocabulary, pronunciation, and grammar. "
                         "Students also explore cultural aspects to enhance language learning and practical communication."),
            seats_available=50
        ),
        # Business (4 courses)
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510835/buss_management_exkojr.jpg",
            name="Business Management", 
            department="Business", 
            credits=3,
            description=("Business Management provides insights into the core principles of managing a business. "
                         "Topics include leadership, strategic planning, and organizational behavior to prepare students for managerial roles."),
            seats_available=80
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510835/marketing_rfwmqa.jpg",
            name="Marketing", 
            department="Business", 
            credits=3,
            description=("The Marketing course explores consumer behavior, branding, and digital marketing strategies. "
                         "Students learn how to create effective marketing campaigns and measure their impact in a competitive marketplace."),
            seats_available=75
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510835/finance_gpbeja.jpg",
            name="Finance", 
            department="Business", 
            credits=3,
            description=("Finance covers the fundamentals of corporate finance, including financial analysis, investment strategies, "
                         "and risk management. Students gain practical skills to navigate financial markets and business financing."),
            seats_available=70
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510824/entrepreneuring_bg8zkp.jpg",
            name="Entrepreneurship", 
            department="Business", 
            credits=3,
            description=("Entrepreneurship teaches the essentials of launching and managing a startup. "
                         "Students learn about business models, funding strategies, and innovation to successfully bring ideas to market."),
            seats_available=65
        ),
        # Art (4 courses)
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510823/art_history_up3vem.jpg",
            name="Art History", 
            department="Art", 
            credits=3,
            description=("Art History provides a comprehensive overview of art movements, influential artists, and the cultural contexts "
                         "behind major works. Students develop an appreciation for how art has evolved over time and its impact on society."),
            seats_available=40
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510820/painting_osozkf.jpg",
            name="Painting", 
            department="Art", 
            credits=3,
            description=("This course covers a range of painting techniques and media, encouraging students to develop their artistic style "
                         "while exploring color theory, composition, and creative expression."),
            seats_available=35
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510830/sculpture_sya9jz.jpg",
            name="Sculpture", 
            department="Art", 
            credits=3,
            description=("Sculpture focuses on three-dimensional art techniques using various materials. "
                         "Students learn to translate ideas into form and gain hands-on experience with different sculpting methods."),
            seats_available=30
        ),
        Course(
            image="https://res.cloudinary.com/dyrayvgch/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1738510820/photography_xcxabg.jpg",
            name="Photography", 
            department="Art", 
            credits=3,
            description=("Photography teaches the fundamentals of visual composition, lighting, and camera techniques. "
                         "Students develop both technical and creative skills to capture compelling images in various styles."),
            seats_available=25
        )
    ]
    db.session.bulk_save_objects(sample_courses)
    db.session.commit()
    return jsonify({"message": "Database seeded successfully!"}), 201

# ----- Initialize Database Tables -----
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5555)
