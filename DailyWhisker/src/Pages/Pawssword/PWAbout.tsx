/**
 * PawsswordAbout
 * 
 * This page informs the user of the Pawssword usage, including what information is 
 * requested/stored and what the function of Pawssword is.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import GreenBackground from '../../assets/AppBackgrounds/GreenBackground';
const PWAbout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <GreenBackground />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-4">About Pawssword</h1>
        <p className="max-w-md text-center text-white mb-8">
          Pawssword was developed so users don't have to create an account to enjoy DailyWhisker. Instead, simply sign-in through
          Google or Github!
        </p>
        <p className="max-w-md text-center text-white mb-8">
          We collect user email and profile to create a DailyWhisker account for you.
        </p>
        <button
          onClick={() => navigate("/pawssword-login")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-500 focus:outline-none"
        >
          Back
        </button>
      </div>
    </>
  );
};

export default PWAbout;
