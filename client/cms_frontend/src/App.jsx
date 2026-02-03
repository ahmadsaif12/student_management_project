import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AddCourse from './pages/AddCourse';
import ManageCourse from './pages/ManageCourse';
import ManageSubject from './pages/ManageSubject'; 
import AddSubject from './pages/AddSubject';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-home" element={<AdminDashboard />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/manage-course" element={<ManageCourse />} />
        <Route path="/manage-subject" element={<ManageSubject />} />
        <Route path="/add-subject" element={<AddSubject />} />
      </Routes>
    </Router>
  );
}

export default App;