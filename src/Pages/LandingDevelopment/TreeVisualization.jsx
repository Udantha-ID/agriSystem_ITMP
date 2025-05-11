import React, { useState, useMemo, useEffect } from 'react';
import { Stage, Layer, Circle, Line, Text, Group, Rect } from 'react-konva';

export const TreeVisualization = ({
  boundary,
  spacing,
  scale,
  width,
  height,
  stageRef,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTree, setSelectedTree] = useState(null);
  const [simulationYear, setSimulationYear] = useState(0);
  const bufferDistance = 2; // 2 meter buffer

  // --- Centering and Zoom Logic ---
  const zoomFactor = 0.5; // 90% of canvas size for a little bigger
  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  if (boundary.length > 0) {
    minX = Math.min(...boundary.map(p => p.x));
    maxX = Math.max(...boundary.map(p => p.x));
    minY = Math.min(...boundary.map(p => p.y));
    maxY = Math.max(...boundary.map(p => p.y));
  }
  const bboxWidth = maxX - minX;
  const bboxHeight = maxY - minY;
  const layoutScale = bboxWidth && bboxHeight
    ? Math.min(width / bboxWidth, height / bboxHeight) * zoomFactor
    : 1;
  const offsetX = bboxWidth
    ? (width - bboxWidth * layoutScale) / 2 - minX * layoutScale
    : 0;
  const offsetY = bboxHeight
    ? (height - bboxHeight * layoutScale) / 2 - minY * layoutScale
    : 0;
  // Helper to transform points
  const tx = (x) => x * layoutScale + offsetX;
  const ty = (y) => y * layoutScale + offsetY;

  // --- END Centering and Zoom Logic ---

  // Calculate the area where trees can be planted (inside boundary but away from edges)
  const getPlantableArea = useMemo(() => {
    if (boundary.length < 3) return boundary;
    let centroid = { x: 0, y: 0 };
    boundary.forEach(point => {
      centroid.x += point.x;
      centroid.y += point.y;
    });
    centroid.x /= boundary.length;
    centroid.y /= boundary.length;
    return boundary.map(point => {
      const vector = {
        x: centroid.x - point.x,
        y: centroid.y - point.y
      };
      const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
      const normalized = {
        x: vector.x / length,
        y: vector.y / length
      };
      const bufferInCanvasUnits = bufferDistance / scale;
      return {
        x: point.x + normalized.x * bufferInCanvasUnits,
        y: point.y + normalized.y * bufferInCanvasUnits
      };
    });
  }, [boundary, scale]);

  const calculateTreePositions = () => {
    if (boundary.length < 3) return [];
    const minX = Math.min(...boundary.map(p => p.x));
    const maxX = Math.max(...boundary.map(p => p.x));
    const minY = Math.min(...boundary.map(p => p.y));
    const maxY = Math.max(...boundary.map(p => p.y));
    const pixelSpacingH = spacing.horizontal / scale;
    const pixelSpacingV = spacing.vertical / scale;
    const trees = [];
    const minDistanceFromBoundary = 10; // Minimum distance in pixels from boundary
    for (let x = minX; x <= maxX; x += pixelSpacingH) {
      for (let y = minY; y <= maxY; y += pixelSpacingV) {
        const point = { x, y };
        const isFarFromBoundary = boundary.every((boundaryPoint, index) => {
          const nextIndex = (index + 1) % boundary.length;
          const nextPoint = boundary[nextIndex];
          const distance = distanceToLineSegment(point, boundaryPoint, nextPoint);
          return distance >= minDistanceFromBoundary;
        });
        if (isPointInPolygon(point, getPlantableArea) && isFarFromBoundary) {
          trees.push({
            position: point,
            size: 3 + (Math.min(1, simulationYear / 5) * 4),
            color: `hsl(120, 80%, 40%)`
          });
        }
      }
    }
    return trees;
  };

  // Helper function to calculate distance from point to line segment
  const distanceToLineSegment = (point, lineStart, lineEnd) => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  };

  const isPointInPolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      
      const intersect = ((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const treePositions = calculateTreePositions();

  return (
    <div className="relative">
      <Stage width={width} height={height} ref={stageRef}>
        <Layer>
          {/* Background grid */}
          <Group>
            {Array.from({ length: Math.ceil(width / 50) }).map((_, i) => (
              <Line
                key={`grid-v-${i}`}
                points={[i * 50, 0, i * 50, height]}
                stroke="#e5e7eb"
                strokeWidth={0.5}
                opacity={0.5}
              />
            ))}
            {Array.from({ length: Math.ceil(height / 50) }).map((_, i) => (
              <Line
                key={`grid-h-${i}`}
                points={[0, i * 50, width, i * 50]}
                stroke="#e5e7eb"
                strokeWidth={0.5}
                opacity={0.5}
              />
            ))}
          </Group>

          {/* Draw the original boundary line with enhanced styling */}
          <Line
            points={boundary.flatMap(p => [tx(p.x), ty(p.y)])}
            stroke="#2563eb"
            strokeWidth={3}
            closed={true}
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.2}
            shadowOffset={{ x: 2, y: 2 }}
          />
          
          {/* Draw trees with enhanced styling */}
          {treePositions.map((tree, index) => (
            <Group
              key={index}
              onMouseEnter={() => {
                setShowDetails(true);
                setSelectedTree(tree);
              }}
              onMouseLeave={() => {
                setShowDetails(false);
                setSelectedTree(null);
              }}
            >
              {/* Tree shadow */}
              <Circle
                x={tx(tree.position.x) + 2}
                y={ty(tree.position.y) + 2}
                radius={tree.size}
                fill="rgba(0, 0, 0, 0.2)"
                shadowBlur={5}
              />
              {/* Tree circle */}
              <Circle
                x={tx(tree.position.x)}
                y={ty(tree.position.y)}
                radius={tree.size}
                fill={tree.color}
                shadowColor="black"
                shadowBlur={5}
                shadowOpacity={0.3}
                shadowOffset={{ x: 1, y: 1 }}
              />
              {/* Tree highlight */}
              <Circle
                x={tx(tree.position.x) - tree.size * 0.3}
                y={ty(tree.position.y) - tree.size * 0.3}
                radius={tree.size * 0.3}
                fill="rgba(255, 255, 255, 0.3)"
              />
            </Group>
          ))}

          {/* Enhanced tooltip */}
          {showDetails && selectedTree && (
            <Group>
              {/* Tooltip background */}
              <Rect
                x={tx(selectedTree.position.x) + 15}
                y={ty(selectedTree.position.y) - 30}
                width={120}
                height={40}
                fill="white"
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.2}
                cornerRadius={5}
              />
              {/* Tooltip border */}
              <Rect
                x={tx(selectedTree.position.x) + 15}
                y={ty(selectedTree.position.y) - 30}
                width={120}
                height={40}
                stroke="#e5e7eb"
                strokeWidth={1}
                cornerRadius={5}
              />
              {/* Tooltip text */}
              <Text
                x={tx(selectedTree.position.x) + 20}
                y={ty(selectedTree.position.y) - 20}
                text={`Tree ${simulationYear} yrs`}
                fontSize={14}
                fill="#1a1a1a"
                fontFamily="Arial"
              />
              <Text
                x={tx(selectedTree.position.x) + 20}
                y={ty(selectedTree.position.y)}
                text={`Size: ${(selectedTree.size * 2).toFixed(1)}m`}
                fontSize={12}
                fill="#4b5563"
                fontFamily="Arial"
              />
            </Group>
          )}
        </Layer>
      </Stage>
      <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded shadow text-sm">
        Year: {simulationYear}
        <button 
          onClick={() => setSimulationYear(prev => Math.min(prev + 1, 10))}
          className="ml-2 px-1 bg-gray-100 rounded"
        >
          +
        </button>
        <button 
          onClick={() => setSimulationYear(prev => Math.max(prev - 1, 0))}
          className="ml-1 px-1 bg-gray-100 rounded"
        >
          -
        </button>
      </div>
    </div>
  );
};