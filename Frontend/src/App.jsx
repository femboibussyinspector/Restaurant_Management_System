import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./Pages/LandingPage.jsx";
import MenuPage from "./Pages/MenuPage.jsx";
import RestaurantDashboard from "./Pages/Admin.jsx";
import AdminLoginPage from "./Pages/AdminLoginPage.jsx"; 
import TableLoginPage from "./Pages/TableLoginPage.jsx"; 

import ProtectedRoute from "./Components/ProtectedRoutes.jsx";
import AdminProtectedRoute from "./Components/AdminProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />

        {/* --- ADMIN WORLD --- */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        <Route element={<AdminProtectedRoute />}>
        
          <Route path="/admin/*" element={<RestaurantDashboard />} />
          
          {/* If someone just goes to /admin, we automatically
            redirect them to the /admin/dashboard page.
          */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* --- TABLE / CUSTOMER WORLD --- */}
        <Route path="/table/login" element={<TableLoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/menu" element={<MenuPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;