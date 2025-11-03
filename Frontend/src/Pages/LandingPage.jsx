import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const restaurantName = "The Corner Bistro";
  const logoPlaceholder = (
    <div className="w-20 h-20 bg-red-700 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white shadow-md">
      B
    </div>
  );

  return (
    <div className="relative min-h-screen font-sans">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 w-full h-full bg-black/60" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center transform transition-all duration-300">
          {logoPlaceholder}

          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {restaurantName}
          </h1>
          <p className="text-lg text-gray-600 mb-8 font-light">
            Order online for pickup or delivery
          </p>

          <div className="flex flex-col gap-4">
            <Link
              to="/login"
              className="w-full px-6 py-4 bg-red-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Log In to Order
            </Link>
            <Link
              to="/signup"
              className="w-full px-6 py-4 bg-gray-100 text-gray-800 text-lg font-semibold rounded-full border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200 transition duration-300 ease-in-out"
            >
              Create an Account
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <Link
              to="/menu"
              className="font-medium text-red-600 hover:text-red-500 transition-colors"
            >
              or continue as a guest to browse the menu
            </Link>
          </div>
        </div>

        <footer className="absolute bottom-6 text-center w-full text-sm text-white/80">
          <p>
            Powered by <span className="font-semibold">Restauro</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;