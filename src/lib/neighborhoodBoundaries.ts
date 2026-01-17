// Houston area neighborhood GeoJSON boundaries (simplified polygons)
export interface NeighborhoodBoundary {
  id: string;
  name: string;
  avgPrice: string;
  listings: number;
  color: string;
  coordinates: [number, number][][]; // GeoJSON polygon coordinates
}

export const neighborhoodBoundaries: NeighborhoodBoundary[] = [
  {
    id: "sugar-land",
    name: "Sugar Land",
    avgPrice: "$485K",
    listings: 42,
    color: "#10b981",
    coordinates: [[
      [-95.68, 29.67],
      [-95.58, 29.67],
      [-95.58, 29.57],
      [-95.68, 29.57],
      [-95.68, 29.67],
    ]],
  },
  {
    id: "katy",
    name: "Katy",
    avgPrice: "$425K",
    listings: 56,
    color: "#3b82f6",
    coordinates: [[
      [-95.88, 29.84],
      [-95.76, 29.84],
      [-95.76, 29.72],
      [-95.88, 29.72],
      [-95.88, 29.84],
    ]],
  },
  {
    id: "cypress",
    name: "Cypress",
    avgPrice: "$395K",
    listings: 38,
    color: "#8b5cf6",
    coordinates: [[
      [-95.76, 30.02],
      [-95.62, 30.02],
      [-95.62, 29.92],
      [-95.76, 29.92],
      [-95.76, 30.02],
    ]],
  },
  {
    id: "richmond",
    name: "Richmond",
    avgPrice: "$365K",
    listings: 28,
    color: "#f59e0b",
    coordinates: [[
      [-95.82, 29.64],
      [-95.70, 29.64],
      [-95.70, 29.52],
      [-95.82, 29.52],
      [-95.82, 29.64],
    ]],
  },
  {
    id: "missouri-city",
    name: "Missouri City",
    avgPrice: "$345K",
    listings: 24,
    color: "#ec4899",
    coordinates: [[
      [-95.58, 29.66],
      [-95.48, 29.66],
      [-95.48, 29.56],
      [-95.58, 29.56],
      [-95.58, 29.66],
    ]],
  },
  {
    id: "pearland",
    name: "Pearland",
    avgPrice: "$375K",
    listings: 31,
    color: "#06b6d4",
    coordinates: [[
      [-95.34, 29.60],
      [-95.22, 29.60],
      [-95.22, 29.50],
      [-95.34, 29.50],
      [-95.34, 29.60],
    ]],
  },
  {
    id: "houston-downtown",
    name: "Houston",
    avgPrice: "$525K",
    listings: 89,
    color: "#1a365d",
    coordinates: [[
      [-95.44, 29.82],
      [-95.30, 29.82],
      [-95.30, 29.70],
      [-95.44, 29.70],
      [-95.44, 29.82],
    ]],
  },
  {
    id: "fulshear",
    name: "Fulshear",
    avgPrice: "$545K",
    listings: 18,
    color: "#eab308",
    coordinates: [[
      [-95.96, 29.74],
      [-95.84, 29.74],
      [-95.84, 29.64],
      [-95.96, 29.64],
      [-95.96, 29.74],
    ]],
  },
  {
    id: "rosenberg",
    name: "Rosenberg",
    avgPrice: "$295K",
    listings: 22,
    color: "#14b8a6",
    coordinates: [[
      [-95.86, 29.60],
      [-95.74, 29.60],
      [-95.74, 29.50],
      [-95.86, 29.50],
      [-95.86, 29.60],
    ]],
  },
];

// Convert to GeoJSON FeatureCollection for Mapbox
export function getNeighborhoodGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: neighborhoodBoundaries.map((hood) => ({
      type: "Feature" as const,
      id: hood.id,
      properties: {
        id: hood.id,
        name: hood.name,
        avgPrice: hood.avgPrice,
        listings: hood.listings,
        color: hood.color,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: hood.coordinates,
      },
    })),
  };
}

export function getNeighborhoodById(id: string): NeighborhoodBoundary | undefined {
  return neighborhoodBoundaries.find(n => n.id === id);
}
