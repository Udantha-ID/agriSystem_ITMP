import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MapPin, Trees } from 'lucide-react';
import { LandCanvas } from '../../Pages/LandDevelopment/LandCanvas';
import { TreeAnalysis } from '../../Pages/LandDevelopment/TreeAnalysis';

function LandBoundary() {
  const [boundary, setBoundary] = useState([]);
  const [scale, setScale] = useState(1); // 1 meter per pixel
  const [spacing, setSpacing] = useState({
    horizontal: 7,
    vertical: 7
  });
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleBoundaryUpdate = (points) => {
    setBoundary(points);
  };

  const handleAnalyze = () => {
    if (boundary.length > 2) {
      setShowAnalysis(true);
    }
  };

  const handleBack = () => {
    setShowAnalysis(false);
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
            {showAnalysis && (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Back to Drawing
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!showAnalysis ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Land Boundary Drawing
              </h2>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Scale (meters/pixel)</label>
                    <input
                      type="number"
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Tree Spacing (m)</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={spacing.horizontal}
                        onChange={(e) => setSpacing({ ...spacing, horizontal: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="1"
                      />
                      <span className="mt-1">×</span>
                      <input
                        type="number"
                        value={spacing.vertical}
                        onChange={(e) => setSpacing({ ...spacing, vertical: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                <LandCanvas
                  width={800}
                  height={600}
                  onBoundaryUpdate={handleBoundaryUpdate}
                />
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
        ) : (
          <TreeAnalysis
            boundary={boundary}
            spacing={spacing}
            scale={scale}
          />
        )}
      </main>
    </div>
  );
}

LandBoundary.propTypes = { 
  boundary: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })),
  spacing: PropTypes.shape({
    horizontal: PropTypes.number,
    vertical: PropTypes.number
  }),
  scale: PropTypes.number
};


export default LandBoundary;
