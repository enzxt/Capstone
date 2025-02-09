import { useNavigate } from "react-router-dom";
import AppBackground from "../assets/AppBackground.tsx";
import { SettingsIcon } from "../assets/icons/index.ts";
import Signout from '../assets/icons/Signout.tsx';
import { logoutUser } from "../service/firestoreService.ts";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center text-white">
      <AppBackground />

      {/* Settings Icon */}
      <button
        className="absolute top-6 right-6 text-white"
        onClick={() => navigate("/settings")}
      >
        <SettingsIcon />
      </button>

      {/* Logout Button */}
      <button className="absolute top-11 right-14 text-white" onClick={() => logoutUser(navigate)}>
        <Signout />
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8">Daily Whisker</h1>

      {/* Functional Buttons */}
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/bookmarks")}
          className="w-32 h-32 rounded-lg bg-gray-300 bg-opacity-40 border border-gray-500 shadow-lg flex items-center justify-center text-lg font-semibold hover:scale-105 transition-transform"
        >
          Bookmarks
        </button>

        <button
          onClick={() => navigate("/cat")}
          className="w-32 h-32 rounded-lg bg-gray-300 bg-opacity-40 border border-gray-500 shadow-lg flex items-center justify-center text-lg font-semibold hover:scale-105 transition-transform"
        >
          Cat
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="w-32 h-32 rounded-lg bg-gray-300 bg-opacity-40 border border-gray-500 shadow-lg flex items-center justify-center text-lg font-semibold hover:scale-105 transition-transform"
        >
          Settings
        </button>
      </div>
    </div>
  );
}

export default Home;
