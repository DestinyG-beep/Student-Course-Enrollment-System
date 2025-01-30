import React, { useState } from 'react';
import './App.css';
import CourseCard from './CourseCard.jsx';
import SearchFilter from './SearchFilter.jsx';

const sampleCourses = [
  { id: 1, name: 'Math 101', department: 'Mathematics', credits: 3, availableSeats: 10 },
  { id: 2, name: 'History 201', department: 'History', credits: 4, availableSeats: 5 },
  { id: 3, name: 'Computer Science 101', department: 'Computer Science', credits: 3, availableSeats: 15 },
  // Add more courses as needed
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ department: '', credits: '' });

  const filteredCourses = sampleCourses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters =
      (filters.department ? course.department === filters.department : true) &&
      (filters.credits ? course.credits === Number(filters.credits) : true);

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="App">
      <h1>Course Catalog</h1>
      <SearchFilter
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="course-list">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default App;
