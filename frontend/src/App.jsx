import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Enrollment from "./pages/Enrollment";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Navbar */}
        <nav className="bg-blue-600 p-4 shadow-md">
          <ul className="flex justify-center space-x-6 text-white font-semibold">
            <li>
              <Link to="/" className="hover:text-gray-300 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-gray-300 transition">
                Courses
              </Link>
            </li>
            <li>
              <Link to="/enrollment" className="hover:text-gray-300 transition">
                Enrollment
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-gray-300 transition">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-gray-300 transition">
                Login
              </Link>
            </li>
          </ul>
        </nav>

        {/* Page Content */}
        <div className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/enrollment" element={<Enrollment />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
