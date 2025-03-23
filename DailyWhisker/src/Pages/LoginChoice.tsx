/**
 * LoginChoice
 * 
 * allows users to choose between Pawsssword and simple login
 */
import React from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
      <h2 className="text-3xl font-bold text-white mb-6">Daily Whisker</h2>

      <div className="space-y-4">
        <div className="relative w-48">
          <button
            onClick={() => navigate("/pawssword-login")}
            className="w-full rounded-md bg-blue-800 px-4 py-2 text-white font-semibold shadow-sm hover:bg-blue-700 focus:outline-none"
          >
            Pawssword
          </button>
          <div className="hidden sm:block absolute right-[-2rem] top-2 group">
            <span className="flex items-center justify-center w-6 h-6 bg-yellow-500 text-white font-bold rounded-full cursor-pointer">
              !
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded">
              Sign in through Google or Github!
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/simple-login")}
          className="w-48 rounded-md bg-gray-500 px-4 py-2 text-white font-semibold shadow-sm hover:bg-gray-600 focus:outline-none"
        >
          Simple Login
        </button>
      </div>
    </div>
  );
};

export default Login;
