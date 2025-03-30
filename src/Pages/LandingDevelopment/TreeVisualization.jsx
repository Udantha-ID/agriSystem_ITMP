import React, { useState, useMemo } from 'react';
import { Stage, Layer, Circle, Line, Text, Group } from 'react-konva';

export const TreeVisualization = ({
  boundary,
  spacing,
  scale,
  width,
  height,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTree, setSelectedTree] = useState(null);
  const [simulationYear, setSimulationYear] = useState(0);
  const bufferDistance = 2; // 2 meter buffer

  // Calculate the area where trees can be planted (inside boundary but away from edges)
  const getPlantableArea = useMemo(() => {
    if (boundary.length < 3) return boundary;
    
    // Calculate centroid
    let centroid = { x: 0, y: 0 };
    boundary.forEach(point => {
      centroid.x += point.x;
      centroid.y += point.y;
    });
    centroid.x /= boundary.length;
    centroid.y /= boundary.length;

    // Scale points inward to create buffer
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
    
    for (let x = minX; x <= maxX; x += pixelSpacingH) {
      for (let y = minY; y <= maxY; y += pixelSpacingV) {
        const point = { x, y };
        // Only plant if inside plantable area
        if (isPointInPolygon(point, getPlantableArea)) {
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
      <Stage width={width} height={height}>
        <Layer>
          {/* Draw only the original boundary line */}
          <Line
            points={boundary.flatMap(p => [p.x, p.y])}
            stroke="#2563eb"
            strokeWidth={2}
            closed={true}
          />
          
          {/* Draw trees (automatically avoids edges due to plantable area calculation) */}
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
              <Circle
                x={tree.position.x}
                y={tree.position.y}
                radius={tree.size}
                fill={tree.color}
                shadowColor="black"
                shadowBlur={2}
                shadowOpacity={0.3}
              />
            </Group>
          ))}

          {showDetails && selectedTree && (
            <Text
              x={selectedTree.position.x + 10}
              y={selectedTree.position.y - 20}
              text={`Tree ${simulationYear} yrs`}
              fontSize={12}
              fill="black"
              padding={5}
              background="white"
            />
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