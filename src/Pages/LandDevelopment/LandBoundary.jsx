import React, { useState } from 'react';
import { MapPin, Trees } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // for navigation

export const LandBoundary = () => {
  const [boundary, setBoundary] = useState([]);
  const [scale, setScale] = useState(1); // 1 meter per pixel
  const [spacing, setSpacing] = useState({ horizontal: 7, vertical: 7 });
  const navigate = useNavigate();

  const handleBoundaryUpdate = (points) => {
    setBoundary(points);
  };

  const handleAnalyze = () => {
    if (boundary.length > 2) {
      navigate('/analysis'); // Navigate to the analysis page
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trees className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Land Development & Tree Analysis</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Land Boundary Drawing
            </h2>
            <div className="space-y-4">
              {/* Inputs and LandCanvas component */}
              <div className="flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={boundary.length < 3}
                  className={`px-6 py-2 rounded-md text-white ${
                    boundary.length < 3
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Analyze Land
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
