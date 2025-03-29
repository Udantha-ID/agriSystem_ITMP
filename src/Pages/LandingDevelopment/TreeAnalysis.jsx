import React, { useRef, useMemo, useState, useEffect } from 'react';
import { TreeVisualization } from './TreeVisualization';
import { BarChart, Activity, Droplets, TreeDeciduous, Download, Image as ImageIcon, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BarLoader, SyncLoader } from 'react-spinners';

export const TreeAnalysis = ({ boundary, spacing, scale }) => {
  const reportRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2400);
  }, []);

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
    const plantableArea = totalArea * 0.85;
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
      roi
    };
  }, [boundary, spacing, scale]);

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
            • Hover over trees to see detailed growth and water requirements
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
