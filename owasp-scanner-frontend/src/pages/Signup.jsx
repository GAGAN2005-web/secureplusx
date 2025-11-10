// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (auth.currentUser) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/signin"); // redirect to signin after signup
    } catch (err) {
      console.error(err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md bg-[#111] p-6 rounded-xl border border-cyan-500/20 shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-400 text-center mb-6">
          Sign Up
        </h2>

        {error && <p className="text-red-400 text-center mb-3">{error}</p>}

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full p-3 mb-4 bg-[#0a0a0a] border border-cyan-500/30 rounded-md text-white focus:border-cyan-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full p-3 mb-4 bg-[#0a0a0a] border border-cyan-500/30 rounded-md text-white focus:border-cyan-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 mb-4 bg-[#0a0a0a] border border-cyan-500/30 rounded-md text-white focus:border-cyan-400 outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-500 text-black font-semibold rounded-xl hover:bg-cyan-400 shadow-md shadow-cyan-500/30 transition-all disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-gray-400 text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-cyan-400 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
