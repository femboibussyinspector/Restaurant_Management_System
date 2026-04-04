import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const url = isRegister
      ? "http://localhost:5000/register"
      : "http://localhost:5000/login";
    const body = isRegister
      ? { username, email: username + "@example.com", password }
      : { username, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#4d0e1d]/60 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-[#800000] p-12">
      <h1 className="text-5xl font-black text-center mb-8 text-[#eee4da] drop-shadow-lg">
        Welcome to SmartDine
      </h1>
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#d8a4ac] to-[#c8a49f] bg-clip-text text-transparent drop-shadow-md">
        {isRegister ? "Register" : "Login"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-4 mb-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#eee4da] focus:border-transparent"
          required
        />
        {!isRegister || (
          <input
            type="email"
            placeholder="Email"
            value={username + "@example.com"}
            readOnly
            className="w-full p-4 mb-4 border border-gray-300 rounded-xl bg-gray-50"
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 mb-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#eee4da] focus:border-transparent"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#eee4da] text-[#4d0e1d] py-4 rounded-xl font-semibold text-lg hover:bg-[#800000] hover:text-[#eee4da] ease-in-out transition-all duration-300 shadow-lg"
        >
          {isRegister ? "Register" : "Login"}
        </button>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
      <p className="text-center mt-6 text-[#eee4da]">
        {isRegister ? "Already have account?" : "Don't have account?"}{" "}
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="font-semibold text-[#c8a49f] hover:text-[#e8ecef]"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}
