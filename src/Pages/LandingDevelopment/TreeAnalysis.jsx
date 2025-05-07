import React, { useRef, useMemo, useState, useEffect } from 'react';
import { TreeVisualization } from './TreeVisualization';
import { BarChart, Activity, Droplets, TreeDeciduous, Download, Image as ImageIcon, FileText, Save, AlertCircle, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BarLoader, SyncLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';

export const TreeAnalysis = ({ boundary, spacing, scale }) => {
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const treeVisStageRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [bufferDistance] = useState(5); // Buffer distance in meters
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    setTimeout(() => setLoading(false), 2400);
  }, []);

  // Clear save status message after 5 seconds
  useEffect(() => {
    if (saveStatus.message) {
      const timer = setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Function to create offset points for the buffer
  const createOffsetPoints = (originalPoints, offset) => {
    if (originalPoints.length < 3) return originalPoints;
    
    const offsetPoints = [];
    const n = originalPoints.length;
    
    for (let i = 0; i < n; i++) {
      const prev = originalPoints[(i - 1 + n) % n];
      const curr = originalPoints[i];
      const next = originalPoints[(i + 1) % n];
      
      // Calculate vectors
      const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
      const v2 = { x: next.x - curr.x, y: next.y - curr.y };
      
      // Normalize vectors
      const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
      const n1 = { x: v1.x / len1, y: v1.y / len1 };
      const n2 = { x: v2.x / len2, y: v2.y / len2 };
      
      // Calculate bisector
      const bisector = { x: n1.x + n2.x, y: n1.y + n2.y };
      const bisectorLen = Math.sqrt(bisector.x * bisector.x + bisector.y * bisector.y);
      const bisectorNormalized = {
        x: bisector.x / bisectorLen,
        y: bisector.y / bisectorLen
      };
      
      // Calculate offset point (inward offset)
      const angle = Math.atan2(n2.y, n2.x) - Math.atan2(n1.y, n1.x);
      const offsetDist = offset / Math.sin(angle / 2);
      
      offsetPoints.push({
        x: curr.x - bisectorNormalized.x * offsetDist,
        y: curr.y - bisectorNormalized.y * offsetDist
      });
    }
    
    return offsetPoints;
  };

  const bufferedBoundary = useMemo(() => {
    return createOffsetPoints(boundary, bufferDistance / scale);
  }, [boundary, bufferDistance, scale]);

  const metrics = useMemo(() => {
    const calculateArea = (points) => {
      let area = 0;
      for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
      }
      return Math.abs(area / 2) * (scale * scale);
    };

    const totalArea = calculateArea(boundary);
    const plantableArea = calculateArea(bufferedBoundary);
    const areaPerTree = spacing.horizontal * spacing.vertical;
    const treeCount = Math.floor(plantableArea / areaPerTree);
    
    const estimatedYield = treeCount * 50;
    const waterRequirement = treeCount * 50 * 365;
    const carbonSequestration = treeCount * 21.7;
    const maintenanceCost = treeCount * 25;
    const estimatedRevenue = estimatedYield * 2.5;
    const roi = (estimatedRevenue - maintenanceCost) / maintenanceCost * 100;

    return {
      totalArea,
      plantableArea,
      treeCount,
      estimatedYield,
      waterRequirement,
      carbonSequestration,
      maintenanceCost,
      estimatedRevenue,
      roi,
      bufferDistance
    };
  }, [boundary, bufferedBoundary, spacing, scale]);

  const handleSaveAnalysis = async () => {
    try {
      // Set saving state
      setSaving(true);
      setSaveStatus({ type: '', message: '' });
      
      // Get user data
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user) {
        setSaveStatus({ 
          type: 'error', 
          message: 'You must be logged in to save analyses. Please log in and try again.' 
        });
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/login', { state: { from: '/land-development' } });
        }, 2000);
        
        return;
      }

      // Calculate tree points for saving (optional - depends on your visualization logic)
      const treePoints = []; // You could calculate this based on boundary and spacing
      
      // Prepare analysis data
      const analysisData = {
        boundary: boundary,
        treePoints: treePoints,
        spacing: spacing,
        totalArea: metrics.totalArea,
        plantableArea: metrics.plantableArea,
        totalTrees: metrics.treeCount,
        metrics: {
          estimatedYield: metrics.estimatedYield,
          waterRequirement: metrics.waterRequirement,
          carbonSequestration: metrics.carbonSequestration,
          maintenanceCost: metrics.maintenanceCost,
          estimatedRevenue: metrics.estimatedRevenue,
          roi: metrics.roi
        }
      };

      console.log('Sending analysis with token:', token.substring(0, 10) + '...');
      
      // Always try to use the API client first
      try {
        // Set authorization header explicitly
        const response = await apiClient.post('/api/analyses', analysisData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setSaveStatus({ 
            type: 'success', 
            message: 'Analysis saved to database successfully! You can view it in your dashboard.' 
          });
        }
      } catch (apiError) {
        console.error('Database save error:', apiError);
        
        if (apiError.response && apiError.response.status === 401) {
          // Handle unauthorized error
          setSaveStatus({ 
            type: 'error', 
            message: 'Authentication error. Please log in again and try again.' 
          });
          
          // Redirect to login after a delay
          setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { state: { from: '/land-development' } });
          }, 2000);
        } else {
          setSaveStatus({ 
            type: 'error', 
            message: 'Failed to save to database. Please check if the server is running.' 
          });
        }
      }
    } catch (error) {
      console.error('Error in save process:', error);
      
      // Simplified error handling
      setSaveStatus({ 
        type: 'error', 
        message: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadImage = async () => {
    try {
      if (!reportRef.current) {
        throw new Error('Report content not found');
      }

      // Create a temporary container with enhanced styling
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '1200px'; // Increased width for better quality
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.padding = '40px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      tempContainer.style.borderRadius = '8px';

      // Clone the content
      const content = reportRef.current.cloneNode(true);

      // Function to enhance styles for better visualization
      const enhanceStyles = (element) => {
        // Set basic styles
        element.style.color = '#1a1a1a';
        element.style.backgroundColor = '#ffffff';
        element.style.borderColor = '#e5e7eb';
        
        // Enhance text elements
        if (element.tagName === 'H1' || element.tagName === 'H2') {
          element.style.fontSize = '24px';
          element.style.fontWeight = 'bold';
          element.style.marginBottom = '16px';
          element.style.color = '#1e40af';
        }
        
        if (element.tagName === 'P') {
          element.style.fontSize = '16px';
          element.style.lineHeight = '1.5';
          element.style.marginBottom = '12px';
        }

        // Enhance visualization elements
        if (element.classList.contains('visualization')) {
          element.style.border = '1px solid #e5e7eb';
          element.style.borderRadius = '8px';
          element.style.padding = '16px';
          element.style.marginBottom = '24px';
        }

        // Process children
        Array.from(element.children).forEach(enhanceStyles);
      };

      // Enhance styles
      enhanceStyles(content);

      // Add the processed content
      tempContainer.appendChild(content);
      document.body.appendChild(tempContainer);

      // Wait for styles to be applied
      await new Promise(resolve => setTimeout(resolve, 200));

      // Capture the content with enhanced quality
      const canvas = await html2canvas(tempContainer, {
        scale: 3, // Increased scale for better quality
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        width: 1200,
        height: tempContainer.offsetHeight,
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure all elements in the cloned document have enhanced styles
          const allElements = clonedDoc.getElementsByTagName('*');
          Array.from(allElements).forEach(el => {
            el.style.color = '#1a1a1a';
            el.style.backgroundColor = '#ffffff';
            el.style.borderColor = '#e5e7eb';
          });
        }
      });

      // Clean up
      document.body.removeChild(tempContainer);

      // Create download link with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const link = document.createElement('a');
      link.download = `land-development-report-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!reportRef.current) {
        throw new Error('Report content not found');
      }

      // Create a temporary container with enhanced styling
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '1200px';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.padding = '40px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      tempContainer.style.borderRadius = '8px';

      // Clone the content
      const content = reportRef.current.cloneNode(true);

      // Function to enhance styles for better visualization
      const enhanceStyles = (element) => {
        // Set basic styles
        element.style.color = '#1a1a1a';
        element.style.backgroundColor = '#ffffff';
        element.style.borderColor = '#e5e7eb';
        
        // Enhance text elements
        if (element.tagName === 'H1' || element.tagName === 'H2') {
          element.style.fontSize = '24px';
          element.style.fontWeight = 'bold';
          element.style.marginBottom = '16px';
          element.style.color = '#1e40af';
        }
        
        if (element.tagName === 'P') {
          element.style.fontSize = '16px';
          element.style.lineHeight = '1.5';
          element.style.marginBottom = '12px';
        }

        // Enhance visualization elements
        if (element.classList.contains('visualization')) {
          element.style.border = '1px solid #e5e7eb';
          element.style.borderRadius = '8px';
          element.style.padding = '16px';
          element.style.marginBottom = '24px';
        }

        // Process children
        Array.from(element.children).forEach(enhanceStyles);
      };

      // Enhance styles
      enhanceStyles(content);

      // Add the processed content
      tempContainer.appendChild(content);
      document.body.appendChild(tempContainer);

      // Wait for styles to be applied
      await new Promise(resolve => setTimeout(resolve, 200));

      // Capture the content with enhanced quality
      const canvas = await html2canvas(tempContainer, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        width: 1200,
        height: tempContainer.offsetHeight,
        logging: false,
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.getElementsByTagName('*');
          Array.from(allElements).forEach(el => {
            el.style.color = '#1a1a1a';
            el.style.backgroundColor = '#ffffff';
            el.style.borderColor = '#e5e7eb';
          });
        }
      });

      // Clean up
      document.body.removeChild(tempContainer);

      // Create PDF with enhanced settings
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });

      // Add header
      pdf.setFontSize(24);
      pdf.setTextColor(30, 64, 175); // Blue color
      pdf.text('Land Development Analysis Report', pdf.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

      // Add timestamp
      pdf.setFontSize(12);
      pdf.setTextColor(100);
      const timestamp = new Date().toLocaleString();
      pdf.text(`Generated on: ${timestamp}`, pdf.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

      // Add content
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      // Add the visualization with proper scaling
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        margin,
        80,
        contentWidth,
        contentHeight
      );

      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(
        '© 2024 Land Development System - Confidential Report',
        pageWidth / 2,
        pageHeight - 20,
        { align: 'center' }
      );

      // Save PDF with timestamp
      const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
      pdf.save(`land-development-report-${timestampStr}.pdf`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('Failed to save PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader
          height={8}
          width={160} 
          color="#36D7B7" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Land Development Analysis</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleSaveAnalysis}
            disabled={saving}
            className={`flex items-center space-x-2 px-4 py-2 ${
              saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
            } text-white rounded-md transition-colors duration-300`}
          >
            {saving ? (
              <>
                <SyncLoader size={4} color="#ffffff" speedMultiplier={0.7} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Analysis</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownloadImage}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ImageIcon className="h-5 w-5" />
            <span>Save as Image</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FileText className="h-5 w-5" />
            <span>Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Status message */}
      {saveStatus.message && (
        <div className={`
          flex items-center p-4 rounded-lg ${
            saveStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }
        `}>
          {saveStatus.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
          )}
          <p>{saveStatus.message}</p>
        </div>
      )}

      <div ref={reportRef} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold">Tree Layout Simulation</h3>
          </div>
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <TreeVisualization
              boundary={boundary}
              bufferedBoundary={bufferedBoundary}
              spacing={spacing}
              scale={scale}
              width={800}
              height={400}
              stageRef={treeVisStageRef}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Layout Details</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tree Spacing:</span>
                  <span className="font-medium">{spacing.horizontal}m × {spacing.vertical}m</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Buffer Zone:</span>
                  <span className="font-medium">{metrics.bufferDistance.toFixed(1)}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Trees:</span>
                  <span className="font-medium">{metrics.treeCount} trees</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Growth Simulation</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Maturity Age:</span>
                  <span className="font-medium">5 years</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Max Height:</span>
                  <span className="font-medium">15m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Canopy Spread:</span>
                  <span className="font-medium">8m</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <p className="text-sm text-gray-600">Original boundary</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <p className="text-sm text-gray-600">Planting area with buffer zone</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <p className="text-sm text-gray-600">Tree locations (optimal spacing)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <TreeDeciduous className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold">Land Metrics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Area:</span>
                <span className="font-medium">{metrics.totalArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plantable Area:</span>
                <span className="font-medium">{metrics.plantableArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tree Spacing:</span>
                <span className="font-medium">{spacing.horizontal}m x {spacing.vertical}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Buffer Distance:</span>
                <span className="font-medium">{metrics.bufferDistance.toFixed(1)}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Trees:</span>
                <span className="font-medium">{metrics.treeCount} trees</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Economic Analysis</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Yield:</span>
                <span className="font-medium">{metrics.estimatedYield.toFixed(0)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Maintenance Cost:</span>
                <span className="font-medium">${metrics.maintenanceCost.toFixed(2)}/year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Revenue:</span>
                <span className="font-medium">${metrics.estimatedRevenue.toFixed(2)}/year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ROI:</span>
                <span className="font-medium">{metrics.roi.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Droplets className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Environmental Impact</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Water Requirement:</span>
                <span className="font-medium">{(metrics.waterRequirement / 1000).toFixed(1)} m³/year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carbon Sequestration:</span>
                <span className="font-medium">{metrics.carbonSequestration.toFixed(1)} kg CO₂/year</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};