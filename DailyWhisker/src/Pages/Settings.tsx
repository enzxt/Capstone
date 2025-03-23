/**
 * Settings Component
 *
 * Provides a user interface for customizing the Daily Whisker application.
 * Users can choose their preferred cat border style, cat background, and app theme.
 * The component loads existing user settings from Firestore and updates them upon saving.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/icons/HomeIcon";
import {
  logoutUser,
  updateSurveyStatus,
  updateUserSettings,
  getUserSettings,
} from "../service/firestoreService";
import { getAuthenticatedUserId } from "../helper/getAuthenticatedUserId";

interface SettingsProps {
  onSettingsSaved: (updatedSettings: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSettingsSaved }) => {
  const navigate = useNavigate();
  const userId = getAuthenticatedUserId();

  const [catBorder, setCatBorder] = useState("Default");
  const [catBackground, setCatBackground] = useState("Solid");
  const [appTheme, setAppTheme] = useState("Light");

  useEffect(() => {
    const loadSettings = async () => {
      if (userId) {
        const savedSettings = await getUserSettings(userId);
        if (savedSettings) {
          setCatBorder(savedSettings.catBorder || "Default");
          setCatBackground(savedSettings.catBackground || "Solid");
          setAppTheme(savedSettings.appTheme || "Light");
        }
      }
    };
    loadSettings();
  }, [userId]);

  const handleRetakeSurvey = async () => {
    if (!userId) {
      console.warn("No authenticated user ID found. Cannot retake survey.");
      return;
    }
    await updateSurveyStatus(userId, { retaking: true });
    navigate("/survey");
  };

  const handleSaveSettings = async () => {
    if (!userId) {
      console.warn("No authenticated user ID found. Cannot save settings.");
      return;
    }
    const settings = {
      catBorder,
      catBackground,
      appTheme,
      updatedAt: Date.now(),
    };
    try {
      const updatedSettings = await updateUserSettings(userId, settings);
      if (updatedSettings) {
        onSettingsSaved(updatedSettings);
      }
      navigate("/home");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-white bg-gray-900 px-4 py-8 sm:px-6 lg:px-8">
      <button
        className="absolute top-6 left-6 text-white"
        onClick={() => navigate("/home")}
      >
        <HomeIcon />
      </button>

      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Settings</h1>

      <div className="w-full max-w-md bg-gray-800 bg-opacity-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="mb-1 text-sm">Cat Border</span>
            <select
              className="p-2 rounded-md bg-gray-200 text-black"
              value={catBorder}
              onChange={(e) => setCatBorder(e.target.value)}
            >
              <option>Rainbow</option>
              <option>Dark</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1 text-sm">Cat Background</span>
            <select
              className="p-2 rounded-md bg-gray-200 text-black"
              value={catBackground}
              onChange={(e) => setCatBackground(e.target.value)}
            >
              <option>Bows</option>
              <option>Fancy</option>
              <option>Paws</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1 text-sm">App Theme</span>
            <select
              className="p-2 rounded-md bg-gray-200 text-black"
              value={appTheme}
              onChange={(e) => setAppTheme(e.target.value)}
            >
              <option>Pink/Purple</option>
              <option>Green/Purple</option>
              <option>Dark</option>
            </select>
          </label>
        </div>
      </div>

      <div className="w-full max-w-md bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-8 text-center">
        <h2 className="text-lg font-semibold mb-2">Import/Export</h2>
        <p className="text-sm text-gray-300 mb-4">
          Import or export your settings as JSON or XML.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-2">
          <label className="flex items-center gap-1">
            <input type="radio" name="format" value="json" defaultChecked className="hidden" /> JSON
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="format" value="xml" className="hidden" /> XML
          </label>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-700">
            Import
          </button>
          <button className="bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-700">
            Export
          </button>
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-4 mb-8">
        <button
          className="w-full bg-yellow-500 px-6 py-2 rounded-md text-white hover:bg-yellow-700"
          onClick={handleRetakeSurvey}
        >
          Retake Survey
        </button>
        <button className="w-full bg-purple-500 px-6 py-2 rounded-md text-white hover:bg-purple-700">
          Share
        </button>
      </div>

      <div className="absolute bottom-6 right-6 flex flex-row sm:flex-row gap-4">
        <button
          className="bg-red-500 px-6 py-2 rounded-md text-white hover:bg-red-700"
          onClick={() => logoutUser(navigate)}
        >
          Logout
        </button>
        <button
          className="bg-indigo-500 px-6 py-2 rounded-md text-white hover:bg-indigo-700"
          onClick={handleSaveSettings}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Settings;
