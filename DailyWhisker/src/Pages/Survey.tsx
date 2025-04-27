/**
 * Survey Component
 *
 * Renders a survey form for the Daily Whisker application where users select their
 * favorite cat breed, preferred cat personality, and favorite color. The component
 * updates the survey status in Firestore for the authenticated user, and upon saving,
 * it calls the onAuthSuccess callback and navigates to the home page.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateSurveyStatus } from "../service/firestoreService";
import { getAuthenticatedUserId } from "../helper/getAuthenticatedUserId";

interface SurveyProps {
  onAuthSuccess: () => void;
}

const Survey: React.FC<SurveyProps> = ({ onAuthSuccess }) => {
  const navigate = useNavigate();

  const [responses, setResponses] = useState({
    question1: "",
    question2: "",
    question3: "",
  });

 /**
  * Updates the selected answer for a survey question.
  */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
    question: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [question]: e.target.value,
    }));
  };

 /**
  * Saves the user's survey responses to Firestore and navigates to the home page.
  */
  const handleSave = async () => {
    const userId = getAuthenticatedUserId();
    if (!userId) {
      console.warn("No authenticated user ID found.");
      return;
    }
    try {
      await updateSurveyStatus(userId, {
        completed: true,
        answers: responses,
      });
      console.log("Survey saved for user:", userId);
      onAuthSuccess();
      navigate("/home");
    } catch (error) {
      console.error("Error saving survey:", error);
    }
  };

 /**
  * Skips the survey and navigates directly to the home page.
  */
  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-blue-700 px-6 py-12">
      <h1 className="text-4xl font-bold text-white text-center">
        Daily Whisker Survey
      </h1>
      <p className="text-white text-center mt-2 max-w-md">
        Please take this survey, so we can make sure to give you the bestest
        cats. Feel free to skip, and let luck decide your cat fate.
      </p>

      <div className="mt-8 w-full max-w-2xl space-y-6">
        <div className="w-full">
          <label className="block text-white font-semibold mb-1">
            What's your favorite breed?
          </label>
          <select
            className="w-full bg-gray-200 text-black rounded-md py-3 px-4 font-semibold focus:outline-none"
            value={responses.question1}
            onChange={(e) => handleChange(e, "question1")}
          >
            <option value="">--Select one--</option>
            <option value="calico">Calico</option>
            <option value="tabby">Tabby</option>
            <option value="siamese">Siamese</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="w-full">
          <label className="block text-white font-semibold mb-1">
            Which cat personality do you prefer?
          </label>
          <select
            className="w-full bg-gray-200 text-black rounded-md py-3 px-4 font-semibold focus:outline-none"
            value={responses.question2}
            onChange={(e) => handleChange(e, "question2")}
          >
            <option value="">--Select one--</option>
            <option value="Evil">Evil</option>
            <option value="Calm/Affectionate">Calm/Affectionate</option>
            <option value="Playful">Playful</option>
            <option value="all">I love them all!</option>
          </select>
        </div>

        <div className="w-full">
          <label className="block text-white font-semibold mb-1">
            What color is your favorite?
          </label>
          <select
            className="w-full bg-gray-200 text-black rounded-md py-3 px-4 font-semibold focus:outline-none"
            value={responses.question3}
            onChange={(e) => handleChange(e, "question3")}
          >
            <option value="">--Select one--</option>
            <option value="Black">Black</option>
            <option value="Orange">Orange</option>
            <option value="White">White</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          onClick={handleSkip}
          className="bg-gray-400 hover:bg-gray-500 text-black font-semibold py-2 px-6 rounded-md"
        >
          Skip
        </button>
        <button
          onClick={handleSave}
          className="bg-black text-white font-semibold py-2 px-6 rounded-md hover:bg-gray-800"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Survey;
