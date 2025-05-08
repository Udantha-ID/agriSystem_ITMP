import React, { useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Line, Circle, Image as KonvaImage, Group, Text } from 'react-konva';
import useImage from 'use-image';
import { Pencil, MousePointer, Grid, Undo2, Redo2, Ruler } from 'lucide-react';

export const LandCanvas = ({ width, height, onBoundaryUpdate, drawingActive, scale = 1 }) => {
  const [points, setPoints] = useState([]);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapImage, setMapImage] = useState(null);
  const [imageScale, setImageScale] = useState({ x: 1, y: 1 });
  const [image] = useImage(mapImage || '');
  const [drawingMode, setDrawingMode] = useState('point');
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [totalArea, setTotalArea] = useState(0);

  const addToHistory = useCallback((newPoints) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newPoints]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPoints([...history[historyIndex - 1]]);
      onBoundaryUpdate([...history[historyIndex - 1]]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPoints([...history[historyIndex + 1]]);
      onBoundaryUpdate([...history[historyIndex + 1]]);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const scale = Math.min(width / img.width, height / img.height);
          setImageScale({ x: scale, y: scale });
        };
        img.src = e.target?.result;
        setMapImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const snapToGrid = (point) => {
    if (!showGrid) return point;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  };

  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const snappedPos = snapToGrid(pos);

    if (drawingMode === 'point') {
      if (selectedPointIndex !== null) {
        const newPoints = [...points];
        newPoints[selectedPointIndex] = snappedPos;
        setPoints(newPoints);
        addToHistory(newPoints);
      } else {
        const newPoints = [...points, snappedPos];
        setPoints(newPoints);
        addToHistory(newPoints);
      }
    } else {
      setIsDrawing(true);
      const newPoints = [...points, snappedPos];
      setPoints(newPoints);
      addToHistory(newPoints);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || drawingMode === 'point') return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const snappedPos = snapToGrid(pos);
    
    const lastPoint = points[points.length - 1];
    if (lastPoint && (lastPoint.x !== snappedPos.x || lastPoint.y !== snappedPos.y)) {
      const newPoints = [...points, snappedPos];
      setPoints(newPoints);
      addToHistory(newPoints);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    onBoundaryUpdate(points);
  };

  const handleClearBoundary = () => {
    setPoints([]);
    setSelectedPointIndex(null);
    addToHistory([]);
    onBoundaryUpdate([]);
  };

  const handleRemoveImage = () => {
    setMapImage(null);
    setImageScale({ x: 1, y: 1 });
  };

  const handlePointClick = (index) => {
    if (drawingMode === 'point') {
      setSelectedPointIndex(index);
    }
  };

  const handleDeletePoint = (index) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
    setSelectedPointIndex(null);
    addToHistory(newPoints);
    onBoundaryUpdate(newPoints);
  };

  // Calculate distances and area
  const calculateDistances = useCallback(() => {
    if (points.length < 2) return [];
    
    return points.map((point, i) => {
      const nextIndex = (i + 1) % points.length;
      const nextPoint = points[nextIndex];
      
      // Calculate distance between points
      const dx = nextPoint.x - point.x;
      const dy = nextPoint.y - point.y;
      const pixelDistance = Math.sqrt(dx * dx + dy * dy);
      const realDistance = pixelDistance * scale; // Convert to real-world units
      
      // Calculate midpoint for label placement
      const midX = (point.x + nextPoint.x) / 2;
      const midY = (point.y + nextPoint.y) / 2;
      
      return {
        from: i,
        to: nextIndex,
        distance: realDistance,
        midpoint: { x: midX, y: midY }
      };
    });
  }, [points, scale]);

  // Calculate polygon area
  const calculateArea = useCallback(() => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    
    const pixelArea = Math.abs(area / 2);
    return pixelArea * (scale * scale); // Convert to square meters
  }, [points, scale]);

  // Update area when points change
  useEffect(() => {
    const calculatedArea = calculateArea();
    setTotalArea(calculatedArea);
    
    // Also pass this info to parent along with boundary
    if (onBoundaryUpdate && typeof onBoundaryUpdate === 'function') {
      onBoundaryUpdate(points, { area: calculatedArea });
    }
  }, [points, calculateArea, onBoundaryUpdate]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Land Map
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setDrawingMode('point')}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              drawingMode === 'point' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MousePointer className="h-4 w-4" />
            <span>Point Mode</span>
          </button>
          <button
            onClick={() => setDrawingMode('freehand')}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              drawingMode === 'freehand'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Pencil className="h-4 w-4" />
            <span>Freehand</span>
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              showGrid
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Grid className="h-4 w-4" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setShowMeasurements(!showMeasurements)}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              showMeasurements
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Ruler className="h-4 w-4" />
            <span>Measurements</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">Grid Size:</label>
          <input
            type="number"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded-md"
            min="5"
            max="100"
          />
        </div>

        {/* Area display */}
        {points.length > 2 && (
          <div className="ml-auto bg-green-50 text-green-800 px-4 py-2 rounded-md font-medium">
            Land Area: {totalArea.toFixed(2)} m²
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              historyIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Undo2 className="h-4 w-4" />
            <span>Undo</span>
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              historyIndex === history.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Redo2 className="h-4 w-4" />
            <span>Redo</span>
          </button>
          <button
            onClick={handleClearBoundary}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Clear Boundary
          </button>
          {mapImage && (
            <button
              onClick={handleRemoveImage}
              className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100"
            >
              Remove Image
            </button>
          )}
        </div>
      </div>

      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <Stage
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {/* Background and grid */}
            {image && (
              <KonvaImage
                image={image}
                width={width * imageScale.x}
                height={height * imageScale.y}
                opacity={0.4}
              />
            )}
            
            {showGrid && (
              <Group>
                {/* Horizontal grid lines */}
                {Array.from({ length: Math.ceil(height / gridSize) }).map((_, i) => (
                  <Line
                    key={`h-${i}`}
                    points={[0, i * gridSize, width, i * gridSize]}
                    stroke="#ddd"
                    strokeWidth={1}
                  />
                ))}
                {/* Vertical grid lines */}
                {Array.from({ length: Math.ceil(width / gridSize) }).map((_, i) => (
                  <Line
                    key={`v-${i}`}
                    points={[i * gridSize, 0, i * gridSize, height]}
                    stroke="#ddd"
                    strokeWidth={1}
                  />
                ))}
              </Group>
            )}
            
            {/* Draw boundary line */}
            {points.length > 0 && (
              <Line
                points={points.flatMap(p => [p.x, p.y])}
                closed={points.length > 2}
                stroke="#3b82f6"
                strokeWidth={2}
                fill="rgba(59, 130, 246, 0.2)"
              />
            )}
            
            {/* Measurements */}
            {showMeasurements && points.length > 1 && calculateDistances().map((line, i) => (
              <Group key={`measure-${i}`}>
                <Text
                  x={line.midpoint.x - 20}
                  y={line.midpoint.y - 10}
                  text={`${line.distance.toFixed(1)}m`}
                  fontSize={12}
                  fill="black"
                  background="white"
                  padding={2}
                />
              </Group>
            ))}
            
            {/* Draw control points */}
            {points.map((point, i) => (
              <Group key={`point-${i}`}>
                <Circle
                  x={point.x}
                  y={point.y}
                  radius={6}
                  fill={selectedPointIndex === i ? "#f59e0b" : "#3b82f6"}
                  stroke="#fff"
                  strokeWidth={2}
                  onClick={() => handlePointClick(i)}
                  onDblClick={() => handleDeletePoint(i)}
                  draggable={drawingMode === 'point'}
                  onDragMove={(e) => {
                    const pos = e.target.position();
                    const snappedPos = snapToGrid(pos);
                    const newPoints = [...points];
                    newPoints[i] = snappedPos;
                    setPoints(newPoints);
                    onBoundaryUpdate(newPoints);
                  }}
                  onDragEnd={() => {
                    addToHistory(points);
                  }}
                />
                <Text
                  x={point.x + 10}
                  y={point.y - 20}
                  text={`P${i+1}`}
                  fontSize={14}
                  fill="#3b82f6"
                  fontStyle="bold"
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
      
      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
        <p className="font-semibold mb-1">Instructions:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click on the canvas to place boundary points</li>
          <li>Use point mode for precise placement, freehand for quick sketching</li>
          <li>Drag points to adjust their position</li>
          <li>Double-click on a point to remove it</li>
          <li>Toggle measurements to see lengths and area</li>
          <li>The total area is calculated in square meters based on the scale factor</li>
        </ul>
      </div>
    </div>
  );
};