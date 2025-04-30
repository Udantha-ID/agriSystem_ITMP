import React, { useState, useEffect } from 'react';
import { LayoutGrid, BarChart, TreeDeciduous, Droplets, Ruler, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/analyses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch analyses');
        
        const data = await response.json();
        setAnalyses(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/analyses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete analysis');
      
      setAnalyses(analyses.filter(analysis => analysis._id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Land Development Dashboard</h1>
          <button 
            onClick={() => navigate('/land-boundary')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Analysis
          </button>
        </div>

        {analyses.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No analyses found</h3>
            <p className="text-gray-500 mb-4">Create your first land development analysis to get started</p>
            <button 
              onClick={() => navigate('/landboundary')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start Analyzing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Analysis List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-lg mb-4 flex items-center">
                  <LayoutGrid className="h-5 w-5 mr-2 text-blue-500" />
                  My Analyses
                </h3>
                <div className="space-y-3">
                  {analyses.map((analysis) => (
                    <div 
                      key={analysis._id}
                      onClick={() => setSelectedAnalysis(analysis)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAnalysis?._id === analysis._id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {new Date(analysis.createdAt).toLocaleDateString()}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {analysis.totalTrees} trees
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(analysis._id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis Detail */}
            <div className="lg:col-span-2">
              {selectedAnalysis ? (
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                      Analysis from {new Date(selectedAnalysis.createdAt).toLocaleString()}
                    </h2>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Land Metrics */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <TreeDeciduous className="h-5 w-5 mr-2 text-green-600" />
                        <h3 className="font-medium">Land Metrics</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Area:</span>
                          <span className="font-medium">
                            {selectedAnalysis.totalArea.toFixed(2)} m²
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plantable Area:</span>
                          <span className="font-medium">
                            {selectedAnalysis.plantableArea.toFixed(2)} m²
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tree Spacing:</span>
                          <span className="font-medium">
                            {selectedAnalysis.treeSpacingHorizontal}m × {selectedAnalysis.treeSpacingVertical}m
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Trees:</span>
                          <span className="font-medium">
                            {selectedAnalysis.totalTrees}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Environmental Impact */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <Droplets className="h-5 w-5 mr-2 text-blue-600" />
                        <h3 className="font-medium">Environmental Impact</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Water Requirement:</span>
                          <span className="font-medium">
                            {(selectedAnalysis.totalTrees * 50 * 365 / 1000).toFixed(1)} m³/year
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Carbon Sequestration:</span>
                          <span className="font-medium">
                            {(selectedAnalysis.totalTrees * 21.7).toFixed(1)} kg CO₂/year
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visualization Placeholder */}
                  <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center text-gray-400">
                    <p>Visualization of the land boundary and tree placement would appear here</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Select an analysis</h3>
                  <p className="text-gray-500">Choose one of your saved analyses from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;