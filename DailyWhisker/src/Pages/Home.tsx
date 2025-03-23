import { useNavigate } from "react-router-dom";
import AppBackground from "../assets/AppBackgrounds/PinkBackground";
import SettingsIcon from "../assets/icons/SettingsIcon";
import Signout from "../assets/icons/Signout";
import { logoutUser } from "../service/firestoreService";

/**
 * Home component serves as the main hub of the Daily Whisker application.
 */
function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br ">
      <button
        className="absolute top-6 right-6 text-white"
        onClick={() => navigate("/settings")}
      >
        <SettingsIcon />
      </button>

      <button
        className="absolute top-11 right-14 text-white"
        onClick={() => logoutUser(navigate)}
      >
        <Signout />
      </button>

      <h1 className="text-4xl font-bold mb-8">Daily Whisker</h1>

      <div className="flex flex-col sm:flex-row gap-6">
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
