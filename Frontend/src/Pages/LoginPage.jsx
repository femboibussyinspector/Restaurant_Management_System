import React, { useState } from 'react';
import { Utensils, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/auth/login', formData);
      
      setSuccess(response.data.message || "Login successful! Redirecting...");

      // TODO: Save the token from response.data to localStorage
      // Example: localStorage.setItem('token', response.data.token);

      setFormData({ email: '', password: '' });

      setTimeout(() => {
        navigate('/menu');
      }, 2000);

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An unknown error occurred.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-black to-purple-900 p-8 text-white font-sans">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-xl shadow-2xl bg-[#0D0B14]">
        
        <div className="hidden md:flex md:flex-1 flex-col justify-center p-16 bg-gradient-to-br from-purple-900 via-transparent to-transparent">
          <div className="absolute top-8 left-8 flex items-center gap-3 text-2xl font-semibold">
            <Utensils className="h-8 w-8" />
            <span>RMS</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xs">
            Log in to your account to access your orders and favorites.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 rounded-lg bg-[#2A2F3D] p-4 text-gray-400">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 font-bold">1</span>
              <span className="font-semibold">Sign up your account</span>
            </li>
            <li className="flex items-center gap-4 rounded-lg bg-white p-4 text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-white font-bold">2</span>
              <span className="font-semibold">Log In</span>
            </li>
            <li className="flex items-center gap-4 rounded-lg bg-[#2A2F3D] p-4 text-gray-400">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 font-bold">3</span>
              <span className="font-semibold">Explore Dashboard</span>
            </li>
          </ul>
        </div>

        <div className="flex-1 p-8 md:p-16">
          <h2 className="text-3xl font-bold mb-2">Log In Account</h2>
          <p className="text-gray-400 mb-6">
            Enter your credentials to access your account.
          </p>
          
          <div className="flex items-center text-gray-400 my-6">
            <span className="h-px flex-1 bg-[#2A2F3D]"></span>
            <span className="px-4 text-sm">Login with Customer Account</span>
            <span className="h-px flex-1 bg-[#2A2F3D]"></span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">

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

            <div className="mb-6">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-white p-3 text-lg font-bold text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

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
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

