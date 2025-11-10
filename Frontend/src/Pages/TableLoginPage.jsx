import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';

const TableLoginPage = () => {
  const [tableId, setTableId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/sessions/start', { tableId });
      
      const { token } = response.data.data;

      if (token) {
        setSuccess(`Session for ${tableId} started! Loading menu...`);
        localStorage.setItem('tableToken', token);
        setTableId('');

        setTimeout(() => {
          navigate('/menu');
        }, 1500);
      } else {
         setError("Session start failed: No token received.");
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An unknown error occurred.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-black to-blue-900 p-8 text-white font-sans">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-xl shadow-2xl bg-[#0D0B14]">
        
        <div className="hidden md:flex md:flex-1 flex-col justify-center p-16 bg-gradient-to-br from-blue-900 via-transparent to-transparent">
          <div className="absolute top-8 left-8 flex items-center gap-3 text-2xl font-semibold">
            <Utensils className="h-8 w-8" />
            <span>RMS</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Restaurant</h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xs">
            A waiter will start your session to begin ordering.
          </p>
        </div>

        <div className="flex-1 p-8 md:p-16">
          <h2 className="text-3xl font-bold mb-2">Start Table Session</h2>
          <p className="text-gray-400 mb-6">
            Enter the Table ID to begin.
          </p>
          
          <div className="flex items-center text-gray-400 my-6">
            <span className="h-px flex-1 bg-[#2A2F3D]"></span>
            <span className="px-4 text-sm">Waiter Use Only</span>
            <span className="h-px flex-1 bg-[#2A2F3D]"></span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-4">
              <label htmlFor="tableId" className="block text-sm font-medium text-gray-400 mb-2">
                Table ID
              </label>
              <input
                type="text"
                id="tableId"
                placeholder="e.g. T101"
                required
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                className="w-full rounded-lg border border-[#2A2F3D] bg-[#1F232F] p-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-white p-3 text-lg font-bold text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Starting...' : 'Start Session'}
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

        </div>
      </div>
    </div>
  );
};

export default TableLoginPage;