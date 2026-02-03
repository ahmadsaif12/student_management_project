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
import AddSesion from './pages/AddSession'
import ManageSession from './pages/ManageSession'
import AddStudent from './pages/AddStudent'
import ManageStudent from './pages/ManageStudent'
import StaffAdd from './pages/StaffAdd'
import ManageStaff from './pages/ManageStaff'


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
        <Route path="/add-session" element={<AddSesion />} />
        <Route path="/manage-session" element={<ManageSession/>} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/manage-student" element={<ManageStudent/>} />
        <Route path="/add-staff" element={<StaffAdd />} />
        <Route path="/manage-staff" element={<ManageStaff/>} />
      </Routes>
    </Router>
  );
}

export default App;