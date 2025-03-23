/**
 * SurveyPrompt Component
 *
 * Displays a modal overlay prompting the user to take a survey to improve their experience.
 * It renders two buttons: one to skip the survey and one to begin the survey process.
 */
import React from "react";

interface SurveyPromptProps {
  onSurveyStart: () => void;
  onSkip: () => void;
}

const SurveyPrompt: React.FC<SurveyPromptProps> = ({ onSurveyStart, onSkip }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
        <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
        <p className="text-gray-700 mt-2">Would you like to take a short survey to improve your experience?</p>
        <div className="mt-6 flex justify-between space-x-4">
          <button
            onClick={onSkip}
            className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-md"
          >
            Skip
          </button>
          <button
            onClick={onSurveyStart}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Take Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyPrompt;
