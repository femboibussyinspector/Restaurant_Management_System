import React, { useState } from 'react';
import { Utensils, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api'; // Import our new axios instance

// This is your signup.html file, rebuilt as a React component
// with Tailwind CSS instead of a <style> tag.

const SignupPage = () => {
  // --- STATE (The "React Way") ---
  // We use state to control the form, not getElementById
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // This is a hook from react-router-dom to redirect the user
  const navigate = useNavigate();

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the form from reloading the page
    setLoading(true);
    setError(null);
    setSuccess(null);

    // --- API CALL (The "Axios Way") ---
    try {
      // Send the data to our backend:
      // POST http://localhost:3000/api/v1/auth/register
      const response = await api.post('/auth/register', formData);
      
      // Our backend sends back a 201 with data and a message
      setSuccess(response.data.message + " Redirecting to login...");

      // Clear the form
      setFormData({ name: '', email: '', password: '' });

      // After 2 seconds, redirect to the login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // This is how we get the error message from our backend's ApiError
      const errorMsg = err.response?.data?.message || 'An unknown error occurred.';
      setError(errorMsg);
    } finally {
      // This runs whether it succeeded or failed
      setLoading(false);
    }
  };

  // --- JSX (The "HTML") ---
  return (
    // We use Tailwind classes instead of CSS variables
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-black to-purple-900 p-8 text-white font-sans">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-xl shadow-2xl bg-[#0D0B14]">
        
        {/* Left Panel (Hidden on mobile) */}
        <div className="hidden md:flex md:flex-1 flex-col justify-center p-16 bg-gradient-to-br from-purple-900 via-transparent to-transparent">
          <div className="absolute top-8 left-8 flex items-center gap-3 text-2xl font-semibold">
            <Utensils className="h-8 w-8" />
            <span>RMS</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Get Started with Us</h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xs">
            Complete this easy step to register your account.
          </p>
          {/* Stepper (Simplified) */}
          <ul className="space-y-4">
            <li className="flex items-center gap-4 rounded-lg bg-white p-4 text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-white font-bold">1</span>
              <span className="font-semibold">Sign up your account</span>
            </li>
            <li className="flex items-center gap-4 rounded-lg bg-[#2A2F3D] p-4 text-gray-400">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 font-bold">2</span>
              <span className="font-semibold">Log In</span>
            </li>
            <li className="flex items-center gap-4 rounded-lg bg-[#2A2F3D] p-4 text-gray-400">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 font-bold">3</span>
              <span className="font-semibold">Explore Dashboard</span>
            </li>
          </ul>
        </div>

        {/* Right Panel (The Form) */}
        <div className="flex-1 p-8 md:p-16">
          <h2 className="text-3xl font-bold mb-2">Sign Up Account</h2>
          <p className="text-gray-400 mb-6">
            Enter your personal data to create your account.
          </p>
          
          <div className="flex items-center text-gray-400 my-6">
            <span className="h-px flex-1 bg-[#2A2F3D]"></span>
            <span className="px-4 text-sm">Create a Customer Account</span>
            <span className="h-px flex-1 bg-[#2A2F3D]"></span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="eg. John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#2A2F3D] bg-[#1F232F] p-3 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="eg. john.doe@gmail.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#2A2F3D] bg-[#1F232F] p-3 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#2A2F3D] bg-[#1F232F] p-3 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-6">Must be at least 6 characters.</p>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-white p-3 text-lg font-bold text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          {/* --- Message Area (Error/Success) --- */}
          {error && (
            <div className="mt-4 text-center text-sm text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 text-center text-sm text-green-400">
              {success}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            {/* This is a <Link> not an <a href> */}
            <Link to="/login" className="font-medium text-white hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

