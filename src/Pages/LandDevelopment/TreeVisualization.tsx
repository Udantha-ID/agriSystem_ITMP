import React, { useState, useEffect } from 'react';
import { Stage, Layer, Circle, Line, Text, Group } from 'react-konva';
import { Point, TreeSpacing, TerrainData, TreeData } from '../../types/land';

interface TreeVisualizationProps {
  boundary: Point[];
  spacing: TreeSpacing;
  scale: number;
  width: number;
  height: number;
}

export const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  boundary,
  spacing,
  scale,
  width,
  height,
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null);
  const [simulationYear, setSimulationYear] = useState<number>(0);

  const calculateTerrainData = (point: Point): TerrainData => {
    // Simulate terrain data based on position
    return {
      elevation: Math.sin(point.x / 50) * Math.cos(point.y / 50) * 10 + 100,
      soilType: ['clay', 'loam', 'sandy', 'silt'][Math.floor((point.x + point.y) % 4)] as TerrainData['soilType'],
      sunExposure: Math.min(1, Math.max(0, Math.sin(point.x / 100) * 0.5 + 0.5))
    };
  };

  const calculateTreeData = (point: Point): TreeData => {
    const terrain = calculateTerrainData(point);
    const soilFactors = {
      clay: 0.7,
      loam: 1.0,
      sandy: 0.8,
      silt: 0.9
    };

    return {
      position: point,
      growthRate: 0.5 + (terrain.sunExposure * 0.5) * soilFactors[terrain.soilType],
      maturityAge: 5 + Math.random() * 2,
      soilSuitability: soilFactors[terrain.soilType],
      waterRequirement: 50 + (terrain.elevation / 10)
    };
  };

  const calculateTreePositions = (): TreeData[] => {
    if (boundary.length < 3) return [];

    const minX = Math.min(...boundary.map(p => p.x));
    const maxX = Math.max(...boundary.map(p => p.x));
    const minY = Math.min(...boundary.map(p => p.y));
    const maxY = Math.max(...boundary.map(p => p.y));

    const pixelSpacingH = spacing.horizontal / scale;
    const pixelSpacingV = spacing.vertical / scale;

    const trees: TreeData[] = [];
    
    for (let x = minX; x <= maxX; x += pixelSpacingH) {
      for (let y = minY; y <= maxY; y += pixelSpacingV) {
        if (isPointInPolygon({ x, y }, boundary)) {
          trees.push(calculateTreeData({ x, y }));
        }
      }
    }

    return trees;
  };

  const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const intersect = ((polygon[i].y > point.y) !== (polygon[j].y > point.y))
        && (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) 
            / (polygon[j].y - polygon[i].y) + polygon[i].x);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const treePositions = calculateTreePositions();

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setSimulationYear(year => (year + 1) % 10);
  //   }, 2000);
  //   return () => clearInterval(timer);
  // }, []);

  const getTreeSize = (tree: TreeData) => {
    const age = simulationYear;
    const growth = Math.min(1, age / tree.maturityAge);
    return 3 + (growth * 4);
  };

  const getTreeColor = (tree: TreeData) => {
    const healthFactor = tree.soilSuitability * 0.7 + 0.3;
    const baseColor = 120; // Green hue
    return `hsl(${baseColor}, ${Math.round(healthFactor * 100)}%, ${Math.round(healthFactor * 40)}%)`;
  };

  return (
    <div className="relative">
      <Stage width={width} height={height}>
        <Layer>
          {/* Draw terrain grid */}
          {Array.from({ length: Math.floor(width / 20) }).map((_, i) =>
            Array.from({ length: Math.floor(height / 20) }).map((_, j) => {
              const terrain = calculateTerrainData({ x: i * 20, y: j * 20 });
              return (
                <Circle
                  key={`terrain-${i}-${j}`}
                  x={i * 20}
                  y={j * 20}
                  radius={1}
                  fill={`rgba(0,0,0,${terrain.elevation / 200})`}
                />
              );
            })
          )}

          {/* Draw boundary */}
          <Line
            points={boundary.flatMap(p => [p.x, p.y])}
            stroke="#2563eb"
            strokeWidth={2}
            closed={true}
          />
          
          {/* Draw trees */}
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
                radius={getTreeSize(tree)}
                fill={getTreeColor(tree)}
                shadowColor="black"
                shadowBlur={2}
                shadowOpacity={0.3}
              />
            </Group>
          ))}

          {/* Show tree details */}
          {showDetails && selectedTree && (
            <Group>
              <Text
                x={selectedTree.position.x + 10}
                y={selectedTree.position.y - 40}
                text={`Growth: ${selectedTree.growthRate.toFixed(2)}m/yr`}
                fontSize={12}
                fill="black"
                padding={2}
                background="white"
              />
              <Text
                x={selectedTree.position.x + 10}
                y={selectedTree.position.y - 25}
                text={`Water: ${selectedTree.waterRequirement.toFixed(0)}L/day`}
                fontSize={12}
                fill="black"
                padding={2}
                background="white"
              />
            </Group>
          )}
        </Layer>
      </Stage>
      <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded shadow text-sm">
        Year: {simulationYear}
      </div>
    </div>
  );
};