import React, { useState, useEffect } from 'react';
import { LayoutGrid, BarChart, TreeDeciduous, Droplets, Ruler, Download, Trash2, Image as ImageIcon, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Dashboard = () => {
  const [analyses, setAnalyses] = useState([
    {
      id: 1,
      name: 'Sample Land Analysis 1',
      date: '2024-05-01',
      area: '2.5 ha',
      yield: '5,000 kg',
      boundary: [[0,0],[0,1],[1,1],[1,0]],
      notes: 'Optimal for coconut plantation.'
    },
    {
      id: 2,
      name: 'Sample Land Analysis 2',
      date: '2024-05-10',
      area: '1.2 ha',
      yield: '2,200 kg',
      boundary: [[0,0],[0,2],[2,2],[2,0]],
      notes: 'Suitable for mixed crops.'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const reportRef = React.useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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
        setAnalyses(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [isAuthenticated, navigate]);

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
      if (selectedAnalysis?._id === id) {
        setSelectedAnalysis(null);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete analysis. Please try again.');
    }
  };

  const handleDownloadImage = async () => {
    try {
      if (!reportRef.current) {
        throw new Error('Report content not found');
      }

      setSaving(true);
      const canvas = await html2canvas(reportRef.current, {
        scale: 1,
        backgroundColor: '#ffffff',
        logging: true,
        useCORS: true,
        allowTaint: true,
        width: reportRef.current.offsetWidth,
        height: reportRef.current.offsetHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: reportRef.current.offsetWidth,
        windowHeight: reportRef.current.offsetHeight
      });
      
      const link = document.createElement('a');
      link.download = `land-analysis-${selectedAnalysis._id}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!reportRef.current) {
        throw new Error('Report content not found');
      }

      setSaving(true);
      const canvas = await html2canvas(reportRef.current, {
        scale: 1,
        backgroundColor: '#ffffff',
        logging: true,
        useCORS: true,
        allowTaint: true,
        width: reportRef.current.offsetWidth,
        height: reportRef.current.offsetHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: reportRef.current.offsetWidth,
        windowHeight: reportRef.current.offsetHeight
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`land-analysis-${selectedAnalysis._id}.pdf`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('Failed to save PDF. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading analyses</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Land Analyses</h1>
          <button
            onClick={() => navigate('/landboundary')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Analysis
          </button>
        </div>

        {analyses.length === 0 ? (
          <div className="text-center py-12">
            <LayoutGrid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No analyses yet</h3>
            <p className="mt-2 text-gray-500">
              Create your first land analysis to get started
            </p>
            <button
              onClick={() => navigate('/landboundary')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Analysis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Analysis List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Saved Analyses</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis._id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedAnalysis?._id === analysis._id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Analysis {new Date(analysis.createdAt).toLocaleDateString()}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {analysis.totalTrees} trees • {analysis.plantableArea.toFixed(2)} m²
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this analysis?')) {
                              handleDelete(analysis._id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
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
                <div ref={reportRef} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                      Analysis from {new Date(selectedAnalysis.createdAt).toLocaleString()}
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDownloadImage}
                        disabled={saving}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        disabled={saving}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        <FileText className="h-5 w-5" />
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
                          <span className="font-medium">{selectedAnalysis.totalArea.toFixed(2)} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plantable Area:</span>
                          <span className="font-medium">{selectedAnalysis.plantableArea.toFixed(2)} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tree Spacing:</span>
                          <span className="font-medium">
                            {selectedAnalysis.spacing.horizontal}m x {selectedAnalysis.spacing.vertical}m
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Trees:</span>
                          <span className="font-medium">{selectedAnalysis.totalTrees} trees</span>
                        </div>
                      </div>
                    </div>

                    {/* Economic Analysis */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <BarChart className="h-5 w-5 mr-2 text-blue-600" />
                        <h3 className="font-medium">Economic Analysis</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual Yield:</span>
                          <span className="font-medium">{selectedAnalysis.metrics.estimatedYield.toFixed(0)} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Maintenance Cost:</span>
                          <span className="font-medium">${selectedAnalysis.metrics.maintenanceCost.toFixed(2)}/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated Revenue:</span>
                          <span className="font-medium">${selectedAnalysis.metrics.estimatedRevenue.toFixed(2)}/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROI:</span>
                          <span className="font-medium">{selectedAnalysis.metrics.roi.toFixed(1)}%</span>
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
                            {(selectedAnalysis.metrics.waterRequirement / 1000).toFixed(1)} m³/year
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Carbon Sequestration:</span>
                          <span className="font-medium">
                            {selectedAnalysis.metrics.carbonSequestration.toFixed(1)} kg CO₂/year
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visualization */}
                  <div className="bg-gray-100 rounded-lg p-4 h-64">
                    {selectedAnalysis.boundary && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          viewBox="0 0 800 400"
                          className="w-full h-full"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          {/* Draw boundary */}
                          <polygon
                            points={selectedAnalysis.boundary.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="rgba(34, 197, 94, 0.1)"
                            stroke="rgb(34, 197, 94)"
                            strokeWidth="2"
                          />
                          
                          {/* Draw tree points */}
                          {selectedAnalysis.treePoints?.map((point, index) => (
                            <circle
                              key={index}
                              cx={point.x}
                              cy={point.y}
                              r="3"
                              fill="rgb(34, 197, 94)"
                            />
                          ))}
                        </svg>
                      </div>
                    )}
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