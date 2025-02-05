# -Student-Course-Enrollment-System
frontend "https://student-course-enrollment-system.vercel.app/"
backend "https://student-course-enrollment-system-1.onrender.com"
# CourseHub - Student Course Enrollment System

## Overview
CourseHub is a full-stack web application that allows students to browse and enroll in courses from a public course catalog. The app features user authentication, course filtering, and an enrollment management system, providing an intuitive interface for students to manage their learning journey.

## Features
- **User Authentication**: Registration and login system with user-specific data storage.
- **Course Management**: Browse, filter, and search for courses based on department, credits, and availability.
- **Enrollment System**: Enroll in courses, update enrollment status (Ongoing, Deferred, Dropped, or Completed), and add personal notes.
- **User Dashboard**: Personalized dashboard displaying enrolled courses and progress.
- **Persistent Login**: User authentication persists across sessions.
- **Responsive Design**: Mobile-friendly UI using React and TailwindCSS.

## Tech Stack
### Frontend:
- React.js
- React Router
- TailwindCSS
- Formik for form handling and validation

### Backend:
- Flask (Python)
- SQLAlchemy (ORM)
- Flask-JWT-Extended for authentication
- CORS support

### Database:
- SQLite (for development)
- PostgreSQL (for production)

## Installation & Setup
### Backend Setup
1. Clone the repository:
   ```bash
   git clone git@github.com:DestinyG-beep/Student-Course-Enrollment-System.git
   cd coursehub/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # For macOS/Linux
   venv\Scripts\activate  # For Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables in a `.env` file:
   ```
   SECRET_KEY=your_secret_key
   DATABASE_URL=https://student-course-enrollment-system-1.onrender.com
   ```
5. Run database migrations and seed data:
   ```bash
   flask db upgrade
   flask seed_data  
   ```
6. Start the backend server:
   ```bash
   flask run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and set the API base URL:
   ```
   VITE_API_BASE_URL=https://student-course-enrollment-system-1.onrender.com
   ```
4. Start the frontend server:
   ```bash
   npm run dev
   ```

## Deployment
### Backend Deployment (Render)
1. Push your backend code to GitHub.
2. Create a new service on [Render](https://render.com/).
3. Connect your repository and set the build & start commands:
   ```
   gunicorn app:app
   ```
4. Configure environment variables in Render’s settings.
5. Deploy and verify your API is running.

### Frontend Deployment (Vercel)
1. Push your frontend code to GitHub.
2. Create a new site on [Vercel](https://vercel.com/).
3. Connect your repository.
4. Set the build command:
   ```
   npm run build
   ```
5. Set the publish directory to ./frontend
6. Add environment variables in Netlify settings.
7. Deploy and test.



## Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to your branch: `git push origin feature-branch`.
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any issues or inquiries, reach out to `mburugugakenga@gmail.com`.

