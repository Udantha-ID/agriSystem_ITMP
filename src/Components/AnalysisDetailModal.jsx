import React, { useRef } from 'react';
import { 
  X, 
  TreeDeciduous, 
  BarChart, 
  Droplets, 
  Download, 
  Image as ImageIcon, 
  FileText,
  Calendar 
} from 'lucide-react';
import { TreeVisualization } from '../Pages/LandingDevelopment/TreeVisualization';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const AnalysisDetailModal = ({ analysis, onClose }) => {
  const reportRef = useRef(null);
  const treeVisStageRef = useRef(null);
  
  // Default scale if not provided
  const defaultScale = 1; 
  
  // Default spacing if not provided
  const defaultSpacing = { horizontal: 5, vertical: 5 };
  
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

  const handleDownloadImage = async () => {
    try {
      if (!reportRef.current) {
        throw new Error('Report content not found');
      }

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `land-analysis-${timestamp}.png`;
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

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });

      // Add a blue header bar
      pdf.setFillColor(30, 64, 175); // Blue color
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), 10, 'F');

      // Add title
      pdf.setFontSize(20);
      pdf.setTextColor(30, 64, 175); // Blue color
      pdf.text('Land Development Analysis Report', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      
      // Add timestamp
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, pdf.internal.pageSize.getWidth() / 2, 27, { align: 'center' });
      
      // Add the image
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20; // 10mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 35, imgWidth, imgHeight);
      
      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(
        '© 2024 AgriSystem - Confidential Report',
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      pdf.save(`land-analysis-${timestamp}.pdf`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('Failed to save PDF. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Land Development Analysis</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div ref={reportRef} className="p-6">
          {/* Header Information */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(analysis.createdAt)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Analysis Report
              </h3>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleDownloadImage}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                <ImageIcon className="h-4 w-4" />
                <span>Image</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              >
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
          
          {/* Tree Visualization */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <TreeDeciduous className="h-5 w-5 text-green-600" />
              <h3 className="font-medium">Tree Layout Visualization</h3>
            </div>
            <div className="h-[350px] border border-gray-200 rounded-lg overflow-hidden">
              {analysis.boundary && analysis.boundary.length > 2 ? (
                <TreeVisualization
                  boundary={analysis.boundary || []}
                  spacing={analysis.spacing || defaultSpacing}
                  scale={analysis.scale || defaultScale}
                  width={800}
                  height={350}
                  stageRef={treeVisStageRef}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <TreeDeciduous className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">No valid boundary data available</p>
                    <p className="text-xs mt-2 max-w-xs mx-auto">The boundary data appears to be missing or incomplete.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Analysis Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Land Metrics */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <TreeDeciduous className="h-5 w-5 mr-2 text-green-600" />
                <h3 className="font-medium">Land Metrics</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Area:</span>
                  <span className="font-medium">{analysis.totalArea?.toFixed(2) || 0} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plantable Area:</span>
                  <span className="font-medium">{analysis.plantableArea?.toFixed(2) || 0} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tree Spacing:</span>
                  <span className="font-medium">
                    {analysis.spacing?.horizontal || 0}m × {analysis.spacing?.vertical || 0}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Trees:</span>
                  <span className="font-medium">{analysis.totalTrees || 0} trees</span>
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
                  <span className="font-medium">{analysis.metrics?.estimatedYield?.toFixed(0) || 0} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance Cost:</span>
                  <span className="font-medium">${analysis.metrics?.maintenanceCost?.toFixed(2) || 0}/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Revenue:</span>
                  <span className="font-medium">${analysis.metrics?.estimatedRevenue?.toFixed(2) || 0}/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ROI:</span>
                  <span className="font-medium">{analysis.metrics?.roi?.toFixed(1) || 0}%</span>
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
                    {((analysis.metrics?.waterRequirement || 0) / 1000).toFixed(1)} m³/year
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbon Sequestration:</span>
                  <span className="font-medium">
                    {analysis.metrics?.carbonSequestration?.toFixed(1) || 0} kg CO₂/year
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Notes or Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Notes</h3>
            <p className="text-gray-700">
              This analysis provides an overview of the optimal tree layout for the selected land area.
              The visualization shows the boundary of the land and the proposed tree placements based on
              the specified spacing. Economic and environmental metrics are calculated based on standard
              models for tree growth and yield.
            </p>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetailModal;