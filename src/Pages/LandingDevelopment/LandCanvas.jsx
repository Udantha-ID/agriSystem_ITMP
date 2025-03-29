import React, { useState, useCallback } from 'react';
import { Stage, Layer, Line, Circle, Image as KonvaImage, Group } from 'react-konva';
import useImage from 'use-image';
import { Pencil, MousePointer, Grid, Undo2, Redo2 } from 'lucide-react';

export const LandCanvas = ({ width, height, onBoundaryUpdate }) => {
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
            {/* Grid */}
            {showGrid && Array.from({ length: Math.ceil(width / gridSize) }).map((_, i) => (
              <Line
                key={`vertical-${i}`}
                points={[i * gridSize, 0, i * gridSize, height]}
                stroke="#ddd"
                strokeWidth={1}
              />
            ))}
            {showGrid && Array.from({ length: Math.ceil(height / gridSize) }).map((_, i) => (
              <Line
                key={`horizontal-${i}`}
                points={[0, i * gridSize, width, i * gridSize]}
                stroke="#ddd"
                strokeWidth={1}
              />
            ))}

            {/* Background Image */}
            {mapImage && image && (
              <KonvaImage
                image={image}
                scaleX={imageScale.x}
                scaleY={imageScale.y}
                opacity={0.5}
              />
            )}

            {/* Boundary Line */}
            <Line
              points={points.flatMap(p => [p.x, p.y])}
              stroke="#2563eb"
              strokeWidth={2}
              closed={points.length > 2}
            />

            {/* Points */}
            {points.map((point, i) => (
              <Group key={i}>
                <Circle
                  x={point.x}
                  y={point.y}
                  radius={6}
                  fill={selectedPointIndex === i ? '#ef4444' : '#2563eb'}
                  onClick={() => handlePointClick(i)}
                  onDblClick={() => handleDeletePoint(i)}
                  draggable={drawingMode === 'point'}
                  onDragMove={(e) => {
                    const pos = snapToGrid({
                      x: e.target.x(),
                      y: e.target.y()
                    });
                    const newPoints = [...points];
                    newPoints[i] = pos;
                    setPoints(newPoints);
                    addToHistory(newPoints);
                    onBoundaryUpdate(newPoints);
                  }}
                />
                {selectedPointIndex === i && (
                  <Circle
                    x={point.x}
                    y={point.y}
                    radius={8}
                    stroke="#ef4444"
                    strokeWidth={1}
                  />
                )}
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>• Use Point Mode to place precise points (click to add, drag to move)</p>
        <p>• Use Freehand Mode to draw naturally (click and drag)</p>
        <p>• Double-click a point to delete it</p>
        <p>• Toggle grid and adjust grid size for precise measurements</p>
        <p>• Use Undo/Redo to correct mistakes</p>
        <p>• Clear Boundary to start over</p>
      </div>
    </div>
  );
};