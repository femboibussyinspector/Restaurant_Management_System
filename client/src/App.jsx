import { useState, useEffect } from "react";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    // Check backend
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then(() => setBackendReady(true))
      .catch(() => setBackendReady(false));
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  if (!backendReady) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(/assets/rest_img_1.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-3xl font-bold mb-4 text-[#eee4da]">
          SmartDine RMS
        </h1>
        <div className="text-center p-8 rounded-3xl shadow-2xl bg-[#4d0e1d]/90 backdrop-blur-md border border-[#c8a49f]/50 max-w-md mx-auto">
          <p className="text-[#eee4da] text-lg">
            Starting backend... Run{" "}
            <code className="bg-[#d8a4ac] text-[#4d0e1d] px-2 py-1 rounded font-mono">
              cd server && venv\Scripts\activate.bat && python app.py
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {token ? (
        <div
          className="min-h-screen"
          style={{
            backgroundImage: `url(/assets/rest_img.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Dashboard token={token} />
        </div>
      ) : (
        <div
          className="min-h-screen flex items-center justify-center p-8"
          style={{
            backgroundImage: `url(/assets/rest_img_1.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Login onLogin={handleLogin} />
        </div>
      )}
    </>
  );
}

export default App;
