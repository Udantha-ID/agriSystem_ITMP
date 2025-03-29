import React, { useRef, useMemo, useState, useEffect } from 'react';
import { TreeVisualization } from './TreeVisualization';
import { BarChart, Activity, Droplets, TreeDeciduous, Download, Image as ImageIcon, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BarLoader, SyncLoader } from 'react-spinners';

export const TreeAnalysis = ({ boundary, spacing, scale }) => {
  const reportRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [bufferDistance] = useState(5); // Buffer distance in meters

  useEffect(() => {
    setTimeout(() => setLoading(false), 2400);
  }, []);

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

  const handleDownloadImage = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#f9fafb'
      });
      
      const link = document.createElement('a');
      link.download = 'land-development-report.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#f9fafb'
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('land-development-report.pdf');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader
          size={15} 
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

      <div ref={reportRef} className="space-y-6">
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
            />
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              • Green dots represent optimal tree locations based on spacing and terrain
            </p>
            <p className="text-sm text-gray-600">
              • Gray line shows original boundary, green line shows planting area with {metrics.bufferDistance.toFixed(1)}m buffer
            </p>
            <p className="text-sm text-gray-600">
              • The simulation shows projected growth patterns over time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};