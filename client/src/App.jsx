import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import EditStudent from './pages/EditStudent';
import EditMarks from './pages/EditMarks';
import AddStudent from './pages/AddStudent';
import AdminTeachers from './pages/AdminTeachers';
import AdminEvents from './pages/AdminEvents';
import AdminLibrary from './pages/AdminLibrary';
import AdminInfrastructure from './pages/AdminInfrastructure';
import AdminLeaves from './pages/AdminLeaves';
import TeacherLeaves from './pages/TeacherLeaves';
import AdminSalary from './pages/AdminSalary';
import TeacherSalary from './pages/TeacherSalary';
import AdminNotices from './pages/AdminNotices';
import TeacherNotices from './pages/TeacherNotices';
import AddTeacher from './pages/AddTeacher';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="cc-app-root">
          <div className="cc-app-shell">
            <Navbar />
            <main className="cc-main">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/teachers"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminTeachers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/add-teacher"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AddTeacher />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminEvents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/library"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminLibrary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/infrastructure"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminInfrastructure />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/leaves"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminLeaves />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/salary"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminSalary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/notices"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminNotices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher"
                  element={
                    <ProtectedRoute roles={['teacher']}>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/leaves"
                  element={
                    <ProtectedRoute roles={['teacher']}>
                      <TeacherLeaves />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/salary"
                  element={
                    <ProtectedRoute roles={['teacher']}>
                      <TeacherSalary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/notices"
                  element={
                    <ProtectedRoute roles={['teacher']}>
                      <TeacherNotices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/edit-marks/:id"
                  element={
                    <ProtectedRoute roles={['teacher']}>
                      <EditMarks />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-student"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AddStudent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-student/:id"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <EditStudent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-marks/:id"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <EditMarks />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
