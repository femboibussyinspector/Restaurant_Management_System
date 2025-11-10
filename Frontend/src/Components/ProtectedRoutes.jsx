import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const tableToken = localStorage.getItem("tableToken");

  return tableToken ? <Outlet /> : <Navigate to="/table/login" replace />;
};

export default ProtectedRoute;