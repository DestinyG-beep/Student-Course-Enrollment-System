from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from backend.models import db
from backend.config import Config
from backend.routes import student_bp
from flask import jsonify

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(student_bp)

@app.route('/')
def home():
     return jsonify({"message": "Welcome to the Student Course Enrollment API"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5555)
