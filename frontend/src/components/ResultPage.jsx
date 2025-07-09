import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultDisplay from './ResultDisplay';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract result and videoPath from location state
  const resultData = location.state?.results;
  const results = resultData?.results || null;
  const videoPath = resultData?.video_path || null;

  if (!results || !videoPath) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">No results found. Please upload a video first.</p>
        <button
          onClick={() => navigate('/video-upload')}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200"
        >
          ⬅️ Back to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ResultDisplay results={results} videoPath={videoPath} />
    </div>
  );
};

export default ResultPage;
