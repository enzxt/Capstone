/**
 * Login 
 * 
 * allows users to use simple login/register
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../service/firestoreService";

interface LoginProps {
  onAuthSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await loginUser(email, password);
      onAuthSuccess();
      navigate("/home");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setErrorMessage(errorMessage);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <h2 className="text-3xl font-bold text-white mb-6">Daily Whisker Login</h2>

      <div className="w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Password"
              className="block w-full rounded-md border border-gray-300 py-2 px-3 pr-10 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 flex justify-between space-x-4">
          <Link
            to="/forgot-password"
            className="w-1/2 text-center rounded-lg bg-indigo-300 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Forgot password?
          </Link>

          <Link
            to="/register"
            className="w-1/2 text-center rounded-lg bg-indigo-300 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Register
          </Link>
        </div>

        <button
          onClick={() => navigate("/choice")}
          className="mt-8 w-full rounded-md bg-gray-300 px-3 py-2 text-gray-800 font-semibold shadow-sm hover:bg-gray-400 focus:outline-none"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Login;
