import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public & Auth
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboards
import AdminDashboard from './pages/AdminDashboard';

// Course & Subject Management
import AddCourse from './pages/AddCourse';
import ManageCourse from './pages/ManageCourse';
import AddSubject from './pages/AddSubject';
import ManageSubject from './pages/ManageSubject'; 

// Session Management
import AddSesion from './pages/AddSession';
import ManageSession from './pages/ManageSession';

// Student & Staff Management
import AddStudent from './pages/AddStudent';
import ManageStudent from './pages/ManageStudent';
import StaffAdd from './pages/StaffAdd';
import ManageStaff from './pages/ManageStaff';

// Attendance & Communications
import ViewAttendance from './pages/ViewAttendance';
import StudentFeedback from './pages/StudentFeedback'; // Student/Staff submission page
import AdminFeedback from './pages/AdminFeedback';     // Admin reply/manage hub

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Home Dashboards */}
        <Route path="/admin-home" element={<AdminDashboard />} />

        {/* Academic Modules */}
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/manage-course" element={<ManageCourse />} />
        <Route path="/add-subject" element={<AddSubject />} />
        <Route path="/manage-subject" element={<ManageSubject />} />
        <Route path="/add-session" element={<AddSesion />} />
        <Route path="/manage-session" element={<ManageSession/>} />

        {/* User Management */}
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/manage-student" element={<ManageStudent/>} />
        <Route path="/add-staff" element={<StaffAdd />} />
        <Route path="/manage-staff" element={<ManageStaff/>} />

        {/* Attendance & Feedback */}
        <Route path="/view-attendance" element={<ViewAttendance />} />
        
        {/* FOR STUDENTS: To send their feedback */}
        <Route path="/student-feedback" element={<StudentFeedback />} />
        
        {/* FOR ADMIN: To listen and reply to everyone */}
        <Route path="/admin-feedback" element={<AdminFeedback />} />
      </Routes>
    </Router>
  );
}

export default App;