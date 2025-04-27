/**
 * PawsswordLogin
 * 
 * Allows users to log in through either Google or Github
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import Connect from '../../assets/icons/Connect';

interface PWLoginProps {
  onAuthSuccess?: () => void;
}

const PWLogin: React.FC<PWLoginProps> = ({ })=> {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3000/auth/github";
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <h2 className="text-4xl font-bold text-white mb-8">Pawssword - Beta, Local Only</h2>

      <div className="flex flex-col space-y-4 w-48">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-between rounded-md bg-gray-200 px-4 py-2 text-gray-800 font-semibold shadow-sm hover:bg-gray-300 focus:outline-none"
        >
          Google
          <Connect />
        </button>

        <button
          onClick={handleGitHubLogin}
          className="flex items-center justify-between rounded-md bg-gray-200 px-4 py-2 text-gray-800 font-semibold shadow-sm hover:bg-gray-300 focus:outline-none"
        >
          GitHub
          <Connect />
        </button>

        <button
          onClick={() => navigate("/pawssword-about")}
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 font-semibold shadow-sm hover:bg-gray-300 focus:outline-none"
        >
          About
        </button>
      </div>

      <button
        onClick={() => navigate("/choice")}
        className="mt-2 w-48 rounded-md bg-gray-200 px-4 py-2 text-gray-800 font-semibold shadow-sm hover:bg-gray-300 focus:outline-none"
      >
        Back
      </button>
    </div>
  );
};

export default PWLogin;
