import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaVideo } from 'react-icons/fa';

const VideoUpload = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert("Please select a video file");
      return;
    }

    const formData = new FormData();
    formData.append("file", videoFile);

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:9000/analyze", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const resultData = res.data;

      if (!resultData || !resultData.results || !resultData.video_path) {
        alert("Server did not return expected results.");
        return;
      }

      navigate("/results", {
        state: {
          results: resultData,
          videoPath: resultData.video_path,
        }
      });

    } catch (error) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 px-6 py-8 sm:py-10 flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[80vh]">
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6 text-center">
        Upload Posture Video
      </h2>

      <div className="flex flex-col items-center justify-center w-full">
        <FaVideo className="text-7xl text-gray-400 mb-6" />

        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="mb-4 border w-full"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow-md mt-10"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      </div>
    </div>
  );
};

export default VideoUpload;
