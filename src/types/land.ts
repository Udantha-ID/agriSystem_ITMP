export interface Point {
  x: number;
  y: number;
}

export interface TreeSpacing {
  horizontal: number;
  vertical: number;
}

export interface LandBoundary {
  points: Point[];
  scale: number; // meters per pixel
}

export interface TreeLayout {
  positions: Point[];
  spacing: TreeSpacing;
  totalTrees: number;
}

export interface TerrainData {
  elevation: number;
  soilType: 'clay' | 'loam' | 'sandy' | 'silt';
  sunExposure: number; // 0-1
}

export interface TreeData {
  position: Point;
  growthRate: number; // meters per year
  maturityAge: number; // years
  soilSuitability: number; // 0-1
  waterRequirement: number; // liters per day
}

export interface AnalysisMetrics {
  totalArea: number;
  plantableArea: number;
  treeCount: number;
  estimatedYield: number;
  waterRequirement: number;
  carbonSequestration: number;
  maintenanceCost: number;
  estimatedRevenue: number;
  roi: number;
}