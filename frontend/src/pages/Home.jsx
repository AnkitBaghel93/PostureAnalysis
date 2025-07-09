import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const animatedTexts = [
  "Welcome to CorrectPosture",
  "Improve your health with better posture",
  "Detect slouching, forward head, and more",
  "Use webcam or upload videos to analyze posture",
];

const Home = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % animatedTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-6 py-12 text-center">
      <section className="max-w-2xl">
       
        <h1
          key={currentTextIndex}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-700 mb-6 transition-opacity duration-1000 ease-in-out opacity-100"
        >
          {animatedTexts[currentTextIndex]}
        </h1>

   
        <p className="text-gray-700 text-lg sm:text-xl mb-8 leading-relaxed">
          CorrectPosture helps you detect poor posture habits like slouching, forward head tilt,
          and rounded shoulders using AI-powered video and webcam analysis. See frame-by-frame
          posture feedback and actionable insights to correct your form.
        </p>

       
        <button
          onClick={() => navigate('/signup')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-300"
        >
          Analyze Your Posture →
        </button>
      </section>
    </main>
  );
};

export default Home;
