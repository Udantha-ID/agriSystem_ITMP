import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  TreeDeciduous,
  Calendar,
  Trash2,
  Eye,
  Download,
  Search,
  AlertCircle,
  RefreshCw,
  Database,
  HardDrive
} from 'lucide-react';
import apiClient from '../../utils/axios';
import { BarLoader } from 'react-spinners';
import { useAuth } from '../../context/AuthContext';
import AnalysisDetailModal from '../../Components/AnalysisDetailModal';

const SavedAnalyses = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [localAnalyses, setLocalAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [dataSource, setDataSource] = useState('server'); // Default to server data instead of 'all'
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailAnalysis, setDetailAnalysis] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalyses();
    } else {
      setLoading(false);
    }
    // Always load local analyses
    loadLocalAnalyses();
  }, [isAuthenticated]);

  const loadLocalAnalyses = () => {
    try {
      const savedAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
      
      // If user is authenticated, only show local analyses for this user
      const filteredAnalyses = isAuthenticated && currentUser?.id
        ? savedAnalyses.filter(analysis => analysis.userId === currentUser.id)
        : savedAnalyses;
        
      setLocalAnalyses(filteredAnalyses);
    } catch (error) {
      console.error('Error loading local analyses:', error);
      setLocalAnalyses([]);
    }
  };

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Attempting to fetch analyses from server...');
      const response = await apiClient.get('/api/analyses');
      
      if (response.data.success) {
        setAnalyses(response.data.data);
        console.log('Successfully loaded analyses from server:', response.data.data.length);
      } else {
        setError('Failed to load analyses from server: ' + (response.data.message || 'Unknown error'));
        console.error('Server response error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching analyses:', error);
      const errorMessage = error.response ? 
        `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown'}` :
        `Connection error: ${error.message}`;
      setError(`Failed to load analyses from server: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id, isLocalAnalysis = false) => {
    try {
      setLoading(true);
      
      if (isLocalAnalysis) {
        // Delete from localStorage
        const savedAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
        const updatedAnalyses = savedAnalyses.filter(analysis => analysis.id !== id);
        localStorage.setItem('savedAnalyses', JSON.stringify(updatedAnalyses));
        setLocalAnalyses(updatedAnalyses);
      } else {
        // Delete from server
        const response = await apiClient.delete(`/api/analyses/${id}`);
        
        if (response.data.success) {
          // Remove deleted analysis from state
          setAnalyses(analyses.filter(analysis => analysis._id !== id));
        } else {
          setError('Failed to delete analysis from server');
        }
      }
      
      setDeleteModalOpen(false);
      setSelectedAnalysis(null);
    } catch (error) {
      console.error('Error deleting analysis:', error);
      setError('Failed to delete analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get combined analyses based on selected data source
  const getCombinedAnalyses = () => {
    if (dataSource === 'server') return analyses;
    if (dataSource === 'local') return localAnalyses;
    
    // For 'all', combine both sources
    return [
      ...analyses,
      ...localAnalyses
    ];
  };

  // Filter and sort analyses
  const filteredAnalyses = getCombinedAnalyses()
    .filter(analysis => {
      // Convert to date for comparing creation dates
      const createdAt = new Date(analysis.createdAt).toLocaleDateString();
      
      // Create a string with all searchable properties
      const searchString = `
        ${createdAt}
        ${analysis.totalArea}
        ${analysis.totalTrees}
      `.toLowerCase();
      
      return searchString.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      
      return sortOrder === 'newest' 
        ? dateB - dateA  // Newest first
        : dateA - dateB; // Oldest first
    });

  const openDeleteModal = (analysis, isLocal = false) => {
    setSelectedAnalysis({ ...analysis, isLocal });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedAnalysis(null);
  };

  const openDetailModal = (analysis) => {
    setDetailAnalysis(analysis);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setDetailAnalysis(null);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && analyses.length === 0 && localAnalyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <BarLoader color="#36D7B7" />
        <p className="mt-4 text-gray-600">Loading your saved analyses...</p>
      </div>
    );
  }

  const hasNoAnalyses = filteredAnalyses.length === 0;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Land Analyses</h1>
            <p className="text-gray-600 mt-1">View and manage your land development analyses</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search analyses..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <select
              className="py-2 pl-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            
            <select
              className="py-2 pl-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
            >
              <option value="all">All Sources</option>
              <option value="server">Server Only</option>
              <option value="local">Local Only</option>
            </select>
            
            <button 
              onClick={() => {
                fetchAnalyses();
                loadLocalAnalyses();
              }}
              className="flex items-center justify-center py-2 px-4 bg-teal-100 text-teal-800 rounded-lg hover:bg-teal-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {hasNoAnalyses ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <TreeDeciduous className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved analyses yet</h3>
            <p className="text-gray-600 mb-6">Start by creating a new land development analysis.</p>
            <Link 
              to="/land-development" 
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Create New Analysis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnalyses.map((analysis) => {
              const isLocalAnalysis = !analysis._id; // Local analyses don't have MongoDB _id
              const analysisId = analysis._id || analysis.id;
              
              return (
                <div 
                  key={analysisId} 
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={() => openDetailModal(analysis)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${isLocalAnalysis ? 'bg-blue-100' : 'bg-teal-100'}`}>
                          {isLocalAnalysis ? (
                            <HardDrive className={`h-6 w-6 ${isLocalAnalysis ? 'text-blue-700' : 'text-teal-700'}`} />
                          ) : (
                            <Database className="h-6 w-6 text-teal-700" />
                          )}
                        </div>
                        {isLocalAnalysis && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                            Local
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(analysis.createdAt)}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mt-4">Land Analysis Report</h3>
                    
                    {/* Tree Visualization Preview */}
                    <div className="mt-4 bg-gray-50 rounded-lg p-2 h-32 flex items-center justify-center overflow-hidden">
                      {analysis.boundary && analysis.boundary.length > 0 ? (
                        <svg 
                          viewBox="0 0 400 200" 
                          className="w-full h-full" 
                          preserveAspectRatio="xMidYMid meet"
                        >
                          {/* Draw boundary */}
                          <polygon
                            points={analysis.boundary.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="rgba(34, 197, 94, 0.1)"
                            stroke="rgb(34, 197, 94)"
                            strokeWidth="2"
                          />
                          
                          {/* Draw simplified tree points */}
                          {Array.from({ length: Math.min(20, analysis.totalTrees || 5) }).map((_, i) => {
                            // Calculate positions within the boundary using proper spacing values
                            const minX = Math.min(...analysis.boundary.map(p => p.x));
                            const maxX = Math.max(...analysis.boundary.map(p => p.x));
                            const minY = Math.min(...analysis.boundary.map(p => p.y));
                            const maxY = Math.max(...analysis.boundary.map(p => p.y));
                            
                            // Apply actual spacing if available, otherwise use a grid
                            if (analysis.spacing && analysis.scale) {
                              // Use the actual spacing parameters
                              const scale = analysis.scale || 1;
                              const pixelSpacingH = (analysis.spacing.horizontal || 5) / scale;
                              const pixelSpacingV = (analysis.spacing.vertical || 5) / scale;
                              
                              // Calculate an appropriate starting offset
                              const offsetX = minX + (pixelSpacingH / 2);
                              const offsetY = minY + (pixelSpacingV / 2);
                              
                              // Use a more spread out distribution based on tree index
                              const cols = Math.ceil(Math.sqrt(Math.min(20, analysis.totalTrees || 5)));
                              const colIdx = i % cols;
                              const rowIdx = Math.floor(i / cols);
                              
                              // Apply the proper spacing
                              const x = offsetX + (colIdx * pixelSpacingH);
                              const y = offsetY + (rowIdx * pixelSpacingV);
                              
                              // Only return points that would be inside the boundary
                              if (x <= maxX && y <= maxY) {
                                return (
                                  <circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r="3"
                                    fill="rgb(34, 197, 94)"
                                  />
                                );
                              }
                              return null;
                            } else {
                              // Fallback to the existing grid pattern if spacing/scale not available
                              const cols = 5;
                              const rows = 4;
                              const colIdx = i % cols;
                              const rowIdx = Math.floor(i / cols);
                              
                              // Calculate position within the grid
                              const x = minX + ((maxX - minX) * (colIdx + 0.5)) / cols;
                              const y = minY + ((maxY - minY) * (rowIdx + 0.5)) / rows;
                              
                              return (
                                <circle
                                  key={i}
                                  cx={x}
                                  cy={y}
                                  r="3"
                                  fill="rgb(34, 197, 94)"
                                />
                              );
                            }
                          }).filter(Boolean)}
                        </svg>
                      ) : (
                        <div className="text-center text-gray-500">
                          <TreeDeciduous className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                          <p className="text-xs">Tree visualization not available</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Area:</span>
                        <span className="font-medium">{analysis.totalArea.toFixed(2)} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Trees:</span>
                        <span className="font-medium">{analysis.totalTrees} trees</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ROI:</span>
                        <span className="font-medium">{analysis.metrics.roi.toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(analysis, isLocalAnalysis);
                        }}
                        className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailModal(analysis);
                        }}
                        className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Analysis</h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this analysis? This action cannot be undone.
            </p>
            {selectedAnalysis.isLocal && (
              <p className="mb-4 text-sm bg-blue-50 text-blue-800 p-2 rounded">
                This is a locally saved analysis and will be removed from your browser storage.
              </p>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAnalysis(
                  selectedAnalysis.isLocal ? selectedAnalysis.id : selectedAnalysis._id, 
                  selectedAnalysis.isLocal
                )}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && detailAnalysis && (
        <AnalysisDetailModal 
          analysis={detailAnalysis} 
          onClose={closeDetailModal}
        />
      )}
    </div>
  );
};

export default SavedAnalyses; 