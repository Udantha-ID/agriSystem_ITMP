import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapPin, Trees, ArrowLeft, Ruler, LayoutGrid, Info, RotateCw, Download } from 'lucide-react';
import { LandCanvas } from './LandCanvas';
import { TreeAnalysis } from './TreeAnalysis';
import Navbar from '../../Components/Navbar';

function LandBoundary() {
  const [boundary, setBoundary] = useState([]);
  const [scale, setScale] = useState(0.6);
  const [spacing, setSpacing] = useState({ horizontal: 7, vertical: 7 });
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const handleBoundaryUpdate = (points) => {
    setBoundary(points);
    setIsDrawing(points.length > 0);
  };

  const handleAnalyze = () => {
    if (boundary.length > 2) {
      setShowAnalysis(true);
    }
  };

  const handleBack = () => {
    setShowAnalysis(false);
  };

  const handleReset = () => {
    setBoundary([]);
    setIsDrawing(false);
  };

  const showTooltip = (content, x, y) => {
    setTooltip({ show: true, content, x, y });
  };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, show: false });
  };

  useEffect(() => {
    if (boundary.length < 3) {
      setShowAnalysis(false);
    }
  }, [boundary]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-25 to-gray-75 font-sans">
      {/* Sticky header with glass morphism effect */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-8xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                <Trees className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Land Development Suite</h1>
                <p className="text-xs text-gray-500">Precision planning for optimal land utilization</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {showAnalysis ? (
                <button
                  onClick={handleBack}
                  className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 transition-all duration-300 hover:shadow-sm group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  <span>Back to Editor</span>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  disabled={!isDrawing}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                    isDrawing 
                      ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-6 py-8">
        {!showAnalysis ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left sidebar - Controls */}
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Boundary Configuration
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">Drawing Scale</label>
                      <div 
                        className="relative"
                        onMouseEnter={(e) => showTooltip('Sets the real-world meters represented by each pixel', e.clientX, e.clientY)}
                        onMouseLeave={hideTooltip}
                      >
                        <Info className="h-4 w-4 text-gray-400 hover:text-blue-500 cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <span className="text-sm font-medium text-gray-700 min-w-[40px]">
                        {scale}m
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <LayoutGrid className="h-4 w-4 mr-2 text-blue-500" />
                      Tree Spacing Configuration
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Horizontal</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={spacing.horizontal}
                            onChange={(e) => setSpacing({ ...spacing, horizontal: Number(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            min="1"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">m</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Vertical</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={spacing.vertical}
                            onChange={(e) => setSpacing({ ...spacing, vertical: Number(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            min="1"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">m</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleAnalyze}
                      disabled={boundary.length < 3}
                      className={`w-full flex justify-center items-center px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                        boundary.length < 3
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {boundary.length < 3 ? (
                        'Draw boundary to analyze'
                      ) : (
                        <>
                          <span>Generate Analysis</span>
                          <svg className="w-4 h-4 ml-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Quick Tips</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">1</span>
                      Click to place boundary points
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">2</span>
                      Connect back to the first point to complete
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">3</span>
                      Adjust spacing for optimal tree placement
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main canvas area */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
                <div className="p-1 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div className="px-4 py-2 text-sm text-gray-500">
                    {isDrawing ? `${boundary.length} points placed` : 'Click to start drawing boundary'}
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <LandCanvas
                    width={1200}
                    height={700}
                    onBoundaryUpdate={handleBoundaryUpdate}
                    drawingActive={!showAnalysis}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <TreeAnalysis
            boundary={boundary}
            spacing={spacing}
            scale={scale}
            onBack={handleBack}
          />
        )}
      </main>

      {/* Tooltip component */}
      {tooltip.show && (
        <div 
          className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y + 10}px`,
            transform: 'translateX(0) translateY(0)',
            opacity: 1,
            transition: 'opacity 0.2s ease, transform 0.2s ease'
          }}
        >
          {tooltip.content}
          <div className="absolute w-3 h-3 bg-gray-800 rotate-45 -left-1 top-1/2 -mt-1.5"></div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-8xl mx-auto px-6 py-6 border-t border-gray-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Land Development Suite
            </div>
            <div className="hidden md:block w-px h-4 bg-gray-200"></div>
            <div className="text-sm text-gray-500">
              Version 2.1.0
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
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