// src/pages/AnalyzePage.jsx
import React from 'react';
import VideoUpload from '../components/VideoUpload';
import WebcamCapture from '../components/WebcamCapture';

const AnalyzePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700 mt-8">📷 Analyze Your Posture</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
        <div className="bg-white shadow-md rounded p-4">
          <VideoUpload />
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <WebcamCapture />
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;
