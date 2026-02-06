import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- PUBLIC & AUTH ---
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// --- DASHBOARDS ---
import AdminDashboard from './pages/AdminDashboard';
import StaffHome from './pages/StaffHome';
import StudentHome from './pages/StudentHome';

// --- COURSE & SUBJECT MANAGEMENT ---
import AddCourse from './pages/AddCourse';
import ManageCourse from './pages/ManageCourse';
import AddSubject from './pages/AddSubject';
import ManageSubject from './pages/ManageSubject'; 

// --- SESSION MANAGEMENT ---
import AddSesion from './pages/AddSession';
import ManageSession from './pages/ManageSession';

// --- STUDENT & STAFF MANAGEMENT ---
import AddStudent from './pages/AddStudent';
import ManageStudent from './pages/ManageStudent';
import StaffAdd from './pages/StaffAdd';
import ManageStaff from './pages/ManageStaff';

// --- ATTENDANCE, LEAVES & COMMUNICATIONS ---
import ViewAttendance from './pages/ViewAttendance';
import TakeAttendance from './pages/TakeAttendance';
import AdminStudentLeave from './pages/AdminStudentLeave';     
import AdminStaffLeave from './pages/AdminStaffLeave'; 
import AdminFeedback from './pages/AdminFeedback'; 
import StudentLeave from './pages/StudentLeave'; 
import StaffLeave from './pages/StaffLeave'; 
import FeedbackPanel from './pages/FeedbackPanel';

// --- RESULTS ---
import AddResult from "./pages/AddResult";
import ViewResult from "./pages/ViewResult";

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('user_role');
  const token = localStorage.getItem('access_token');

  if (!token) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    const redirects = {
      '1': '/admin-home',
      '2': '/staff-home',
      '3': '/student-home'
    };
    return <Navigate to={redirects[role] || '/login'} />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- ADMIN ONLY (Role 1) --- */}
        <Route path="/admin-home" element={<ProtectedRoute allowedRoles={['1']}><AdminDashboard /></ProtectedRoute>} />
        
        <Route path="/add-course" element={<ProtectedRoute allowedRoles={['1']}><AddCourse /></ProtectedRoute>} />
        <Route path="/add-subject" element={<ProtectedRoute allowedRoles={['1']}><AddSubject /></ProtectedRoute>} />
        <Route path="/add-session" element={<ProtectedRoute allowedRoles={['1']}><AddSesion /></ProtectedRoute>} />
        <Route path="/add-student" element={<ProtectedRoute allowedRoles={['1']}><AddStudent /></ProtectedRoute>} />
        <Route path="/add-staff" element={<ProtectedRoute allowedRoles={['1']}><StaffAdd /></ProtectedRoute>} />

        <Route path="/edit-course/:id" element={<ProtectedRoute allowedRoles={['1']}><AddCourse isEdit={true} /></ProtectedRoute>} />
        <Route path="/edit-subject/:id" element={<ProtectedRoute allowedRoles={['1']}><AddSubject isEdit={true} /></ProtectedRoute>} />
        <Route path="/edit-session/:id" element={<ProtectedRoute allowedRoles={['1']}><AddSesion isEdit={true} /></ProtectedRoute>} />
        <Route path="/edit-student/:id" element={<ProtectedRoute allowedRoles={['1']}><AddStudent isEdit={true} /></ProtectedRoute>} />
        <Route path="/edit-staff/:id" element={<ProtectedRoute allowedRoles={['1']}><StaffAdd isEdit={true} /></ProtectedRoute>} />
        
        <Route path="/manage-course" element={<ProtectedRoute allowedRoles={['1']}><ManageCourse /></ProtectedRoute>} />
        <Route path="/manage-subject" element={<ProtectedRoute allowedRoles={['1']}><ManageSubject /></ProtectedRoute>} />
        <Route path="/manage-session" element={<ProtectedRoute allowedRoles={['1']}><ManageSession/></ProtectedRoute>} />
        <Route path="/manage-student" element={<ProtectedRoute allowedRoles={['1']}><ManageStudent/></ProtectedRoute>} />
        <Route path="/manage-staff" element={<ProtectedRoute allowedRoles={['1']}><ManageStaff/></ProtectedRoute>} />
        
        {/* UPDATED ADMIN LEAVE ROUTES */}
        <Route path="/manage-staff-leaves" element={<ProtectedRoute allowedRoles={['1']}><AdminStaffLeave /></ProtectedRoute>} />
        <Route path="/manage-student-leaves" element={<ProtectedRoute allowedRoles={['1']}><AdminStudentLeave /></ProtectedRoute>} />
        
        <Route path="/feedback" element={<ProtectedRoute allowedRoles={['1']}><AdminFeedback /></ProtectedRoute>} />

        {/* --- STAFF ONLY (Role 2) --- */}
        <Route path="/staff-home" element={<ProtectedRoute allowedRoles={['2']}><StaffHome /></ProtectedRoute>} />
        <Route path="/take-attendance" element={<ProtectedRoute allowedRoles={['2']}><TakeAttendance /></ProtectedRoute>} />
        <Route path="/staff-view-attendance" element={<ProtectedRoute allowedRoles={['2']}><ViewAttendance /></ProtectedRoute>} />
        <Route path="/staff-add-result" element={<ProtectedRoute allowedRoles={['2']}><AddResult /></ProtectedRoute>} />
        <Route path="/staff-view-results" element={<ProtectedRoute allowedRoles={['2']}><ViewResult /></ProtectedRoute>} />
        <Route path="/staff-leave" element={<ProtectedRoute allowedRoles={['2']}><StaffLeave /></ProtectedRoute>} /> 
        <Route path="/staff-feedback" element={<ProtectedRoute allowedRoles={['2']}><FeedbackPanel /></ProtectedRoute>} />

        {/* --- STUDENT ONLY (Role 3) --- */}
        <Route path="/student-home" element={<ProtectedRoute allowedRoles={['3']}><StudentHome /></ProtectedRoute>} />
        <Route path="/student-view-attendance" element={<ProtectedRoute allowedRoles={['3']}><ViewAttendance /></ProtectedRoute>} />
        <Route path="/student-view-results" element={<ProtectedRoute allowedRoles={['3']}><ViewResult /></ProtectedRoute>} />
        <Route path="/apply-leave" element={<ProtectedRoute allowedRoles={['3']}><StudentLeave /></ProtectedRoute>} />
        <Route path="/student-feedback" element={<ProtectedRoute allowedRoles={['3']}><FeedbackPanel /></ProtectedRoute>} />

        {/* --- SHARED PROTECTED ROUTES --- */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* --- FALLBACK --- */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;