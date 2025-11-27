import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// React Router v6 ProtectedRoute
// Usage in routes:
//   <Route
//     path="/admin"
//     element={
//       <ProtectedRoute roles={['admin']}>
//         <AdminDashboard />
//       </ProtectedRoute>
//     }
//   />

const ProtectedRoute = ({ roles, children }) => {
  const { user, ready } = useAuth();

  // Wait until auth is hydrated to avoid false redirects
  if (!ready) return null;

  // Not logged in after ready
  if (!user) return <Navigate to="/login" replace />;

  // Role not authorized
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
