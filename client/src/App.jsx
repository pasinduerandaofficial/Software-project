import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import NoticeBanner from './components/common/NoticeBanner';

// Auth
import Login from './pages/auth/Login';

// Student
import StudentOverview from './pages/student/Overview';
import StudentResults from './pages/student/Results';
import StudentTimetable from './pages/student/Timetable';
import StudentMedical from './pages/student/Medical';

// Lecturer
import LecturerOverview from './pages/lecturer/Overview';
import LecturerResultsEntry from './pages/lecturer/ResultsEntry';
import LecturerAnalytics from './pages/lecturer/Analytics';
import LecturerTimetable from './pages/lecturer/Timetable';
import LecturerMedicalReviews from './pages/lecturer/MedicalReviews';

// Admin
import AdminOverview from './pages/admin/Dashboard';
import AdminNotices from './pages/admin/Notices';
import AdminUsers from './pages/admin/Users';
import AdminTimetable from './pages/admin/Timetable';
import AdminCourses from './pages/admin/Courses';
import AdminMedical from './pages/admin/Medical';

const studentLinks = [
  { label: 'Overview', path: '/student/overview' },
  { label: 'Results', path: '/student/results' },
  { label: 'Timetable', path: '/student/timetable' },
  { label: 'Medical', path: '/student/medical' },
];

const lecturerLinks = [
  { label: 'Overview', path: '/lecturer/overview' },
  { label: 'Results Entry', path: '/lecturer/results-entry' },
  { label: 'Analytics', path: '/lecturer/analytics' },
  { label: 'Timetable', path: '/lecturer/timetable' },
  { label: 'Medical Reviews', path: '/lecturer/medical-reviews' },
];

const adminLinks = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Courses', path: '/admin/courses' },
  { label: 'Timetable', path: '/admin/timetable' },
  { label: 'Notices', path: '/admin/notices' },
  { label: 'Medical', path: '/admin/medical' },
];

// Layout wrappers
const Layout = ({ links, notice }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0, padding: 0 }}>
    <Navbar />
    <NoticeBanner message={notice} />
    <div style={{ display: 'flex', flex: 1 }}>
      <Sidebar links={links} />
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<Layout links={studentLinks} notice="Important: End of semester exams start next week!" />}>
              <Route path="/student/overview" element={<StudentOverview />} />
              <Route path="/student/results" element={<StudentResults />} />
              <Route path="/student/timetable" element={<StudentTimetable />} />
              <Route path="/student/medical" element={<StudentMedical />} />
            </Route>
          </Route>

          {/* Lecturer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['lecturer']} />}>
            <Route element={<Layout links={lecturerLinks} notice="Reminder: Grade submission deadline is Friday." />}>
              <Route path="/lecturer/overview" element={<LecturerOverview />} />
              <Route path="/lecturer/results-entry" element={<LecturerResultsEntry />} />
              <Route path="/lecturer/analytics" element={<LecturerAnalytics />} />
              <Route path="/lecturer/timetable" element={<LecturerTimetable />} />
              <Route path="/lecturer/medical-reviews" element={<LecturerMedicalReviews />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<Layout links={adminLinks} notice={null} />}>
              <Route path="/admin/dashboard" element={<AdminOverview />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/timetable" element={<AdminTimetable />} />
              <Route path="/admin/notices" element={<AdminNotices />} />
              <Route path="/admin/medical" element={<AdminMedical />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
