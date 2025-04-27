/**
 * App Component
 *
 * The main application component for Daily Whisker. It manages global state for user authentication,
 * survey status, and user settings (e.g., app theme). Upon authentication, it retrieves the user's survey
 * status and settings from Firestore and passes the app background preference to the Layout component.
 */

import { useState, useEffect } from "react";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";
import ForgotPassword from "./Pages/ForgotPassword";
import Layout from "./components/Layout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Bookmarks from "./Pages/Bookmarks";
import Settings from "./Pages/Settings";
import Cat from "./Pages/Cat";
import PWLogin from "./Pages/Pawssword/PWLogin";
import LoginChoice from "./Pages/LoginChoice";
import PWAbout from "./Pages/Pawssword/PWAbout";
import Survey from "./Pages/Survey";
import SurveyPrompt from "./Pages/SurveyPrompt";
import BookmarkedCat from "./Pages/BookmarkedCat";
import { firestore } from "./database/firestore";
import { doc, getDoc } from "firebase/firestore";
import { updateSurveyStatus, getUserSettings } from "./service/firestoreService";
import TokenHandler from "../scripts/TokenHandler";
import { getAuthenticatedUserId } from "./helper/getAuthenticatedUserId";

interface SurveyStatus {
  skipped: boolean;
  completed: boolean;
  answers: Record<string, any>;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [surveyStatus, setSurveyStatus] = useState<SurveyStatus | null>(null);
  const [appBackground, setAppBackground] = useState<string>("Pink");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) return;

    const userId = getAuthenticatedUserId();
    if (!userId) {
      console.warn("No valid user ID found. Cannot fetch survey doc.");
      return;
    }

    (async () => {
      const surveyRef = doc(firestore, "users", userId, "survey", "status");
      const snapshot = await getDoc(surveyRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as SurveyStatus;
        setSurveyStatus(data);
      } else {
        setSurveyStatus({ skipped: false, completed: false, answers: {} });
      }
    })();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const userId = getAuthenticatedUserId();
    if (!userId) return;

    (async () => {
      const settings = await getUserSettings(userId);
      console.log("Fetched user settings:", settings);

      if (settings && settings.appTheme) {
        setAppBackground(settings.appTheme);
        console.log("Setting appBackground to:", settings.appTheme);
      } else {
        console.log("No appTheme found in settings; defaulting to Pink");
      }
    })();
  }, [isAuthenticated]);

  const shouldShowSurveyPrompt =
    surveyStatus &&
    surveyStatus.skipped === false &&
    surveyStatus.completed === false;

  const handleSurveyStart = () => {
    setSurveyStatus(null);
    navigate("/survey");
  };

  const handleSurveySkip = async () => {
    const userId = getAuthenticatedUserId();
    if (!userId) return;

    await updateSurveyStatus(userId, { skipped: true });
    setSurveyStatus((prev) => prev && { ...prev, skipped: true });
  };

  return (
    <Layout appBackground={appBackground} location={location}>
      {shouldShowSurveyPrompt && (
        <SurveyPrompt
          onSurveyStart={handleSurveyStart}
          onSkip={handleSurveySkip}
        />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/choice" />} />

        <Route
          path="/login"
          element={<Login onAuthSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/home"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/login" />
          }
        />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route
          path="/settings"
          element={
            <Settings
              onSettingsSaved={(updatedSettings) =>
                setAppBackground(updatedSettings.appTheme)
              }
            />
          }
        />
        <Route path="/cat" element={<Cat />} />

        <Route
          path="/simple-login"
          element={<Login onAuthSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/pawssword-login"
          element={<PWLogin onAuthSuccess={() => setIsAuthenticated(true)} />}
        />

        <Route path="/choice" element={<LoginChoice />} />
        <Route path="/pawssword-about" element={<PWAbout />} />

        <Route
          path="/survey"
          element={<Survey onAuthSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/survey-prompt"
          element={<SurveyPrompt onSurveyStart={handleSurveyStart} onSkip={handleSurveySkip} />}
        />
        <Route
          path="/auth/google/callback"
          element={<TokenHandler onAuthSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/auth/github/callback"
          element={<TokenHandler onAuthSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route path="/bookmarked-cat/:catId" element={<BookmarkedCat />} />
      </Routes>
    </Layout>
  );
}

export default App;
