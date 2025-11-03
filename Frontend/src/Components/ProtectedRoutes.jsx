import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../Store/useAuthStore'; // Make sure this path is correct

const ProtectedRoute = () => {
  // ✅ Correct: Return a primitive value (boolean) from the store
  const isAuthenticated = useAuthStore((state) => !!state.user);

  // ✅ Render based on authentication
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
