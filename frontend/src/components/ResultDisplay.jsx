import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#00C49F', '#FF8042', '#FFBB28', '#8884d8', '#FF6666', '#ccc'];

const ResultDisplay = ({ results, videoPath }) => {
  const [chartData, setChartData] = useState([]);
  const [showFrames, setShowFrames] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const counts = {
      good: 0,
      slouching: 0,
      forwardHead: 0,
      roundedShoulders: 0,
      badSquat: 0,
      badDesk: 0,
      unknown: 0,
    };

    results.forEach((res) => {
      const status = res.status.toLowerCase();
      if (status.includes("good")) counts.good++;
      if (status.includes("slouching")) counts.slouching++;
      if (status.includes("forward head")) counts.forwardHead++;
      if (status.includes("rounded shoulders")) counts.roundedShoulders++;
      if (status.includes("bad squat")) counts.badSquat++;
      if (status.includes("bad desk")) counts.badDesk++;
      if (status.includes("no pose") || status.trim() === "") counts.unknown++;
    });

    setChartData([
      { name: 'Good', value: counts.good },
      { name: 'Slouching', value: counts.slouching },
      { name: 'Forward Head', value: counts.forwardHead },
      { name: 'Rounded Shoulders', value: counts.roundedShoulders },
      { name: 'Bad Squat', value: counts.badSquat },
      { name: 'Bad Desk', value: counts.badDesk },
      { name: 'Unknown', value: counts.unknown },
    ]);
  }, [results]);

  const getStatusBadges = (status) => {
    const uniqueParts = [...new Set(
      status.toLowerCase().split(',').map((p) => p.trim())
    )];

    return uniqueParts.map((part, index) => {
      if (part.includes("good"))
        return <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">✔️ Good</span>;
      else if (part.includes("slouching"))
        return <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">⚠️ Slouching</span>;
      else if (part.includes("forward head"))
        return <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">⚠️ Forward Head</span>;
      else if (part.includes("rounded shoulders"))
        return <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">⚠️ Rounded Shoulders</span>;
      else if (part.includes("bad squat"))
        return <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">❌ Bad Squat</span>;
      else if (part.includes("bad desk"))
        return <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs font-medium">❌ Bad Desk</span>;
      else
        return <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium">❓ No Pose</span>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 shadow-md -m-3">
      <h3 className="text-3xl font-bold mb-10 text-center">📊 Posture Summary</h3>

      <div className="gap-10 max-w-7xl mx-auto pt-8">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} label>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[300px] mt-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full flex justify-center mt-10 gap-4 flex-wrap">
        <button
          onClick={() => setShowFrames(!showFrames)}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md"
        >
          {showFrames ? 'Hide Frame-by-Frame Analysis' : 'Show Frame-by-Frame Analysis'}
        </button>

        <button
          onClick={() => setShowVideo(!showVideo)}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-md"
        >
          {showVideo ? 'Hide Analyzed Video' : 'Show Analyzed Video'}
        </button>
      </div>

      {showVideo && videoPath && (
        <div className="mt-8 flex justify-center">
          <video
            src={`https://postureanalysis-backend.onrender.com/processed-video?path=${encodeURIComponent(videoPath)}`}
            controls
            className="rounded-lg shadow-md w-full max-w-3xl"
          />
        </div>
      )}

      {showFrames && (
        <div className="max-w-4xl mx-auto mt-8">
          <h3 className="text-xl font-semibold mb-4">Frame-by-Frame Analysis</h3>
          <ul className="space-y-2">
            {results.map((res, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-4 py-2 shadow-sm"
              >
                <strong>Frame {res.frame}:</strong> {getStatusBadges(res.status)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
