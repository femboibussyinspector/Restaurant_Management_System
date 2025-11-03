import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage.jsx";
import RestaurantDashboard from "./Pages/Admin.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import MenuPage from "./Pages/MenuPage.jsx"; // <-- Added this import

import ProtectedRoute from "./Components/ProtectedRoutes.jsx";
import AdminProtectedRoute from "./Components/AdminProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/menu" element={<MenuPage />} /> {/* <-- Added this route */}

        {/* --- CUSTOMER (LOGGED-IN USERS) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/customer" element={<h2>Customer Dashboard Coming Soon</h2>} />
          {/* You could add a protected /cart route here */}
        </Route>

        {/* --- ADMIN ONLY ROUTES --- */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<RestaurantDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
