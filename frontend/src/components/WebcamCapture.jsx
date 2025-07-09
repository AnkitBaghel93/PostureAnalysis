import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'q' && recording) {
        stopRecording();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recording]);

  const startCamera = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = localStream;
    setStream(localStream);
    setCameraOn(true);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      const currentVideo = videoRef.current;
      if (currentVideo && currentVideo.srcObject) {
        currentVideo.srcObject = null;
      }
    }
    setStream(null);
    setCameraOn(false);
  };

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setVideoBlob(blob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    stopCamera();
  };

  const handleUpload = async () => {
    if (!videoBlob) return;

    const formData = new FormData();
    formData.append('file', videoBlob, 'webcam_video.webm');

    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:9000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/results', {
        state: {
          results: res.data,
          videoPath: res.data.video_path,
        },
      });
    } catch (err) {
      alert('Error analyzing video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 px-6 py-10 flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6 text-center">
        Webcam Posture Capture
      </h2>

      <div className="mb-4 w-full max-w-[500px] aspect-video relative bg-black rounded shadow-md overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover rounded"
        />
        {!cameraOn && (
          <FaCamera className="text-white text-6xl md:text-7xl opacity-60 z-10" />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between w-full max-w-xl mb-4">
        {!cameraOn ? (
          <button
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md"
            onClick={startCamera}
          >
            Start Camera
          </button>
        ) : (
          <button
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md"
            onClick={stopCamera}
          >
            Stop Camera
          </button>
        )}

        {!recording ? (
          <button
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
            onClick={startRecording}
            disabled={!cameraOn}
          >
            Start Recording
          </button>
        ) : (
          <button
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md"
            onClick={stopRecording}
          >
            Stop Recording
          </button>
        )}
      </div>

      {videoBlob && (
        <button
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md"
          onClick={handleUpload}
        >
          {loading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      )}
    </div>
  );
};

export default WebcamCapture;
