/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} TreeSpacing
 * @property {number} horizontal
 * @property {number} vertical
 */

/**
 * @typedef {Object} LandBoundary
 * @property {Point[]} points
 * @property {number} scale - meters per pixel
 */

/**
 * @typedef {Object} TreeLayout
 * @property {Point[]} positions
 * @property {TreeSpacing} spacing
 * @property {number} totalTrees
 */

/**
 * @typedef {'clay' | 'loam' | 'sandy' | 'silt'} SoilType
 */

/**
 * @typedef {Object} TerrainData
 * @property {number} elevation
 * @property {SoilType} soilType
 * @property {number} sunExposure - 0-1
 */

/**
 * @typedef {Object} TreeData
 * @property {Point} position
 * @property {number} growthRate - meters per year
 * @property {number} maturityAge - years
 * @property {number} soilSuitability - 0-1
 * @property {number} waterRequirement - liters per day
 */

/**
 * @typedef {Object} AnalysisMetrics
 * @property {number} totalArea
 * @property {number} plantableArea
 * @property {number} treeCount
 * @property {number} estimatedYield
 * @property {number} waterRequirement
 * @property {number} carbonSequestration
 * @property {number} maintenanceCost
 * @property {number} estimatedRevenue
 * @property {number} roi
 */

export const SoilTypes = {
  CLAY: 'clay',
  LOAM: 'loam',
  SANDY: 'sandy',
  SILT: 'silt'
};