import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [totalArea, setTotalArea] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [cursorMeasurement, setCursorMeasurement] = useState(null);
  const [showRealTimeMeasurement, setShowRealTimeMeasurement] = useState(true);
  const [isOutOfBounds, setIsOutOfBounds] = useState(false);
  const stageRef = useRef(null);
  const containerRef = useRef(null);

  // Constants for padding and boundary limits
  const CANVAS_PADDING = 20; // Padding from edge of canvas

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

  // Function to constrain a point to be within the canvas bounds
  const constrainToCanvas = (point) => {
    return {
      x: Math.min(Math.max(point.x, CANVAS_PADDING), width - CANVAS_PADDING),
      y: Math.min(Math.max(point.y, CANVAS_PADDING), height - CANVAS_PADDING)
    };
  };

  // Function to check if a point is out of canvas bounds (with some padding)
  const isPointOutOfBounds = (point) => {
    return point.x < CANVAS_PADDING || 
           point.x > width - CANVAS_PADDING || 
           point.y < CANVAS_PADDING || 
           point.y > height - CANVAS_PADDING;
  };

  const calculateDistance = (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    return pixelDistance * scale; // Convert to real-world units
  };

  const handleMouseDown = (e) => {
    if (!drawingActive) return;
    
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    
    // Check if cursor is within bounds
    if (isPointOutOfBounds(pos)) {
      return; // Prevent drawing outside of canvas
    }
    
    const snappedPos = snapToGrid(pos);
    const constrainedPos = constrainToCanvas(snappedPos);

    // In point mode, check if we're near an existing point to modify it
    if (drawingMode === 'point') {
      // Find if we're clicking near an existing point (within 10 pixels)
      const existingPointIndex = points.findIndex(point => {
        const dx = point.x - pos.x;
        const dy = point.y - pos.y;
        return Math.sqrt(dx * dx + dy * dy) < 10; // 10px threshold
      });
      
      if (existingPointIndex !== -1) {
        // If near an existing point, select it for potential movement
        setSelectedPointIndex(existingPointIndex);
        return;
      }
      
      if (selectedPointIndex !== null) {
        // If a point is already selected, move it to the new position
        const newPoints = [...points];
        newPoints[selectedPointIndex] = constrainedPos;
        setPoints(newPoints);
        addToHistory(newPoints);
        onBoundaryUpdate(newPoints);
        setSelectedPointIndex(null); // Deselect after moving
      } else {
        // Otherwise add a new point
        const newPoints = [...points, constrainedPos];
        setPoints(newPoints);
        addToHistory(newPoints);
      }
    } else {
      // Freehand mode behavior remains the same
      setIsDrawing(true);
      const newPoints = [...points, constrainedPos];
      setPoints(newPoints);
      addToHistory(newPoints);
    }
  };

  const handleMouseMove = (e) => {
    if (!drawingActive) return;
    
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    
    // Check if point is out of bounds
    const outOfBounds = isPointOutOfBounds(pos);
    setIsOutOfBounds(outOfBounds);
    
    const snappedPos = snapToGrid(pos);
    
    // For preview purposes, we don't constrain the cursor position
    // so that we can show an indicator when out of bounds
    setCursorPosition(snappedPos);
    
    // Calculate real-time measurements for cursor position
    if (points.length > 0 && showRealTimeMeasurement) {
      const lastPoint = points[points.length - 1];
      const distance = calculateDistance(lastPoint, snappedPos);
      
      // Calculate angle for display orientation
      const angle = Math.atan2(snappedPos.y - lastPoint.y, snappedPos.x - lastPoint.x);
      const midX = (lastPoint.x + snappedPos.x) / 2;
      const midY = (lastPoint.y + snappedPos.y) / 2;
      
      setCursorMeasurement({
        distance,
        midpoint: { x: midX, y: midY },
        angle: angle * (180 / Math.PI)
      });
    } else {
      setCursorMeasurement(null);
    }
    
    // Move selected point if mouse is pressed and we have a selected point
    if (e.evt.buttons === 1 && selectedPointIndex !== null && !outOfBounds) {
      const constrainedPos = constrainToCanvas(snappedPos);
      const newPoints = [...points];
      newPoints[selectedPointIndex] = constrainedPos;
      setPoints(newPoints);
      onBoundaryUpdate(newPoints);
      return;
    }
    
    if (!isDrawing || drawingMode === 'point') return;
    
    // Don't add new points if out of bounds in freehand mode
    if (outOfBounds) return;
    
    const lastPoint = points[points.length - 1];
    if (lastPoint && (lastPoint.x !== snappedPos.x || lastPoint.y !== snappedPos.y)) {
      const constrainedPos = constrainToCanvas(snappedPos);
      const newPoints = [...points, constrainedPos];
      setPoints(newPoints);
      addToHistory(newPoints);
    }
  };

  // Handle when mouse leaves the canvas
  const handleMouseLeave = () => {
    setIsOutOfBounds(true);
    setCursorPosition(null);
    setCursorMeasurement(null);
    if (isDrawing) {
      setIsDrawing(false);
      onBoundaryUpdate(points);
    }
  };

  // Handle when mouse enters the canvas
  const handleMouseEnter = (e) => {
    setIsOutOfBounds(false);
    if (e.buttons === 1 && drawingMode === 'freehand' && points.length > 0) {
      // Resume drawing if button is still pressed
      setIsDrawing(true);
    }
  };

  const handleMouseUp = () => {
    // Add to history when releasing the mouse after dragging a point
    if (selectedPointIndex !== null) {
      addToHistory(points);
    }
    
    setIsDrawing(false);
    onBoundaryUpdate(points);
    setSelectedPointIndex(null); // Deselect after mouse up
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

  // Calculate if we should close the polygon when near first point
  const shouldClosePolygon = useCallback(() => {
    if (points.length < 2 || !cursorPosition) return false;
    
    const firstPoint = points[0];
    const dx = cursorPosition.x - firstPoint.x;
    const dy = cursorPosition.y - firstPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Close when within 15 pixels of the first point
    return distance < 15;
  }, [points, cursorPosition]);

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

  const handleCanvasClick = (e) => {
    if (!drawingActive || drawingMode !== 'point') return;
    
    // Check if we clicked on an existing point (handled separately)
    if (e.target instanceof Circle) return;
    
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    
    // Prevent adding points outside the canvas
    if (isPointOutOfBounds(pos)) {
      return;
    }
    
    const snappedPos = snapToGrid(pos);
    const constrainedPos = constrainToCanvas(snappedPos);
    
    // Check if we're near the first point and have at least 2 points already
    if (points.length >= 2 && shouldClosePolygon()) {
      // Close the polygon by connecting to the first point
      const newPoints = [...points];
      addToHistory(newPoints);
      onBoundaryUpdate(newPoints);
      return;
    }
    
    // Add a new point
    const newPoints = [...points, constrainedPos];
    setPoints(newPoints);
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
          <button
            onClick={() => {
              setShowMeasurements(!showMeasurements);
              setShowRealTimeMeasurement(!showRealTimeMeasurement);
            }}
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

      <div 
        ref={containerRef}
        className="border-2 border-gray-300 rounded-lg overflow-hidden relative"
      >
        {/* Cursor coordinates display */}
        {cursorPosition && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-70 px-3 py-1 rounded text-xs font-mono text-gray-800 z-10">
            X: {Math.round(cursorPosition.x)}, Y: {Math.round(cursorPosition.y)}
            {cursorMeasurement && points.length > 0 && (
              <span className="ml-2 text-blue-600">
                Length: {cursorMeasurement.distance.toFixed(2)}m
              </span>
            )}
          </div>
        )}

        {/* Out of bounds warning */}
        {isOutOfBounds && drawingActive && (
          <div className="absolute top-2 left-2 bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-medium z-10 animate-pulse">
            ⚠️ Cursor outside drawing area
          </div>
        )}

        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          style={{ cursor: isOutOfBounds ? 'not-allowed' : (selectedPointIndex !== null ? 'move' : 'default') }}
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
            
            {/* Canvas border indicator */}
            <Line
              points={[
                CANVAS_PADDING, CANVAS_PADDING,
                width - CANVAS_PADDING, CANVAS_PADDING,
                width - CANVAS_PADDING, height - CANVAS_PADDING,
                CANVAS_PADDING, height - CANVAS_PADDING,
                CANVAS_PADDING, CANVAS_PADDING
              ]}
              stroke="#9CA3AF"
              strokeWidth={1}
              dash={[5, 5]}
              opacity={0.7}
            />
            
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
            
            {/* Preview line from last point to cursor */}
            {drawingActive && points.length > 0 && cursorPosition && !isOutOfBounds && (
              <Line
                points={[
                  points[points.length - 1].x, 
                  points[points.length - 1].y, 
                  cursorPosition.x, 
                  cursorPosition.y
                ]}
                stroke={shouldClosePolygon() ? "#10b981" : "#3b82f6"}
                strokeWidth={2}
                dash={[5, 5]}
              />
            )}
            
            {/* "Close polygon" indicator when near first point */}
            {drawingActive && points.length >= 2 && cursorPosition && shouldClosePolygon() && !isOutOfBounds && (
              <Circle
                x={points[0].x}
                y={points[0].y}
                radius={10}
                stroke="#10b981"
                strokeWidth={2}
              />
            )}
            
            {/* Measurements for existing segments */}
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
            
            {/* Real-time measurement for cursor position */}
            {showRealTimeMeasurement && cursorMeasurement && points.length > 0 && !isOutOfBounds && (
              <Group>
                <Text
                  x={cursorMeasurement.midpoint.x - 20}
                  y={cursorMeasurement.midpoint.y - 10}
                  text={`${cursorMeasurement.distance.toFixed(1)}m`}
                  fontSize={12}
                  fill="#3b82f6"
                  fontStyle="bold"
                  background="white"
                  padding={2}
                />
              </Group>
            )}
            
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
                  onMouseOver={e => {
                    document.body.style.cursor = 'move';
                    e.target.getStage().container().style.cursor = 'move';
                  }}
                  onMouseOut={e => {
                    document.body.style.cursor = 'default';
                    const isMoving = selectedPointIndex !== null;
                    e.target.getStage().container().style.cursor = isMoving ? 'move' : 'default';
                  }}
                  onDragMove={(e) => {
                    const pos = e.target.position();
                    const snappedPos = snapToGrid(pos);
                    const constrainedPos = constrainToCanvas(snappedPos);
                    const newPoints = [...points];
                    newPoints[i] = constrainedPos;
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
            
            {/* Cursor position indicator in point mode */}
            {drawingActive && drawingMode === 'point' && cursorPosition && !shouldClosePolygon() && !isOutOfBounds && (
              <Circle
                x={cursorPosition.x}
                y={cursorPosition.y}
                radius={5}
                fill="rgba(59, 130, 246, 0.3)"
                stroke="#3b82f6"
                strokeWidth={1}
                dash={[3, 3]}
              />
            )}
          </Layer>
        </Stage>
      </div>
      
      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
        <p className="font-semibold mb-1">Instructions:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click once to place the first boundary point</li>
          <li>Move your mouse to see real-time measurements from the last point</li>
          <li>The distance is displayed in meters along the preview line</li>
          <li>Click to place additional points when you're satisfied with the position</li>
          <li>Move close to the first point to close the polygon (green indicator will appear)</li>
          <li>To adjust an existing point: click and hold directly on the point, then drag to a new position</li>
          <li>You can also click near a point to select it, then click elsewhere to move it to that position</li>
          <li>Double-click on a point to remove it</li>
          <li>The total area is calculated automatically in square meters</li>
          <li>Points cannot be placed outside the drawing area (dashed border)</li>
        </ul>
      </div>
    </div>
  );
};