import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../Store/useAuthStore";

const AdminProtectedRoute = () => {
  const { user } = useAuthStore();
  const isAdmin = user && user.role === "admin";

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminProtectedRoute;
