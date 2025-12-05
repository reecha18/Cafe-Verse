import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAction } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginAction({ username, password });
      navigate("/");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-25 items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange-900 mb-6 text-center">Login to CafeVerse</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* --- Restored Input Fields --- */}
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* --- End of Restored Fields --- */}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            className="bg-orange-900 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-700 transition disabled:opacity-75 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-orange-900 hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;