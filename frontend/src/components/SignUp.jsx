import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

// Helper component for the validation checklist item
const ValidationCheck = ({ label, isMet }) => (
  <p className={`text-sm ${isMet ? 'text-green-600' : 'text-gray-500'}`}>
    {isMet ? '✓' : '•'} {label}
  </p>
);

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State to track password validation criteria
  const [validation, setValidation] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const { signUpAction } = useContext(AuthContext);
  const navigate = useNavigate();

  // Effect to validate password whenever it changes
  useEffect(() => {
    setValidation({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if all validation criteria are met before submitting
    const isPasswordValid = Object.values(validation).every(Boolean);
    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.");
      return;
    }

    setLoading(true);
    try {
      await signUpAction({ username, email, password, role: 'customer' });
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const errorMessages = Object.keys(errorData).map(key => `${key}: ${errorData[key].join(', ')}`);
        setError(errorMessages.join(' '));
      } else {
        setError("Failed to create an account. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-25 items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange-900 mb-6 text-center">Create Your CafeVerse Account</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            required
          />

          {/* Real-time validation checklist */}
          {isPasswordFocused && (
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <ValidationCheck label="At least 8 characters long" isMet={validation.minLength} />
              <ValidationCheck label="Contains an uppercase letter" isMet={validation.hasUpper} />
              <ValidationCheck label="Contains a lowercase letter" isMet={validation.hasLower} />
              <ValidationCheck label="Contains a number" isMet={validation.hasNumber} />
            </div>
          )}
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button 
            type="submit" 
            className="bg-orange-900 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-800 transition disabled:opacity-75 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-orange-900 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;