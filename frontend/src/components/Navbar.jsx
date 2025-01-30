import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex space-x-4 text-white">
        <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
        <li><Link to="/courses" className="hover:text-gray-200">Courses</Link></li>
        <li><Link to="/enrollment" className="hover:text-gray-200">Enrollment</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
