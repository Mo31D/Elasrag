import type { RouteDefinition } from '../types/game';
import navigation from './ambleside-navigation.json';

function calcLength(pts: Array<[number, number]>): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return Math.round(len);
}

// Connected OSM centreline route. No manually drawn shortcuts.
const waterheadPts = navigation.arcade as Array<[number, number]>;
const waterheadLandmarks = navigation.stops
  .filter(place => ['fork','lake-road','black-sheep','market','bridge-house'].includes(place.id))
  .map(place => ({ name: place.name, x: place.point[0], z: place.point[1] }));

// Surveyed OpenStreetMap Glebe Road -> Ferry Nab -> Ferry Crossing -> B5285 Far Sawrey
const bownessPts: Array<[number, number]> = [
  [2455.7, 6157.3], // Bowness Bay Pier Road
  [2388.7, 6187.9], // Bowness Promenade
  [2293.8, 6333.1], // Glebe Road North
  [2296.9, 6358.4], // Glebe Road South
  [2472.1, 6525.5], // Cockshot Lane
  [2290.0, 6820.0], // Ferry Nab Approach
  [2091.2, 7042.7], // Ferry Nab Slipway (East)
  [1606.6, 7154.9], // Ferry House Slipway (West)
  [1554.7, 7285.3], // B5285 Ferry Hill
  [1421.7, 7344.3], // Far Sawrey Lane
  [920.0, 7405.0],  // Sawrey Rise
  [429.4, 7459.9],  // Far Sawrey Village
];

// Surveyed Troutbeck -> Troutbeck Bridge -> A591 -> Brockhole
const troutbeckPts: Array<[number, number]> = [
  [3760.0, 445.0],  // Troutbeck Village
  [3420.0, 1220.0], // Robin Lane Descent
  [3080.0, 1940.0], // Troutbeck Valley Lane
  [2665.0, 2910.0], // Troutbeck Bridge (A591)
  [2575.5, 2485.1], // A591 Northbound
  [2084.8, 2258.4], // Ecclerigg Terrace
  [1916.0, 2093.1], // Brockhole Brow
  [1603.3, 1823.3], // Brockhole Drive
  [1522.2, 1764.9], // White Cross Bay
  [1294.0, 1398.5], // Low Wood Promenade
];

// Surveyed Newby Bridge -> A592 -> Lakeside
const lakesidePts: Array<[number, number]> = [
  [-206.5, 16720.9], // Newby Bridge 5-Arch Crossing
  [16.5, 16634.4],   // River Leven North Bank
  [196.2, 16552.4],  // Swan Curve
  [357.1, 16448.3],  // Finsthwaite Turn
  [505.9, 16255.9],  // Lakeside Road South
  [663.9, 16152.2],  // Lakeside Approach
  [812.6, 15948.0],  // Lakeside Railway Parallel
  [985.6, 15426.8],  // Windermere South Shore
  [1076.2, 14929.4], // Lakeside Steamer Pier
];

// Start on The Esplanade and face the booking office approach.
const explorerPts: Array<[number, number]> = [
  [86.2, -235],
  [92.6, -247.8],
];

export const LAKELAND_ROUTES: RouteDefinition[] = [
  {
    id: 'waterhead_ambleside',
    title: 'Waterhead & Ambleside Scramble',
    subtitle: 'Sprint from Waterhead up the mapped A591 corridor through Ambleside to Bridge House.',
    difficulty: 'Accessible',
    mode: 'sprint',
    startName: 'Waterhead Promenade',
    finishName: 'Bridge House, Ambleside',
    lengthMeters: calcLength(waterheadPts),
    targetTimeSec: 110,
    parScore: 10500,
    waypoints: waterheadPts,
    corridorHalfWidth: 8.5,
    landmarks: waterheadLandmarks,
  },
  {
    id: 'bowness_ferry',
    title: 'Bowness & Ferry Nab Dash',
    subtitle: 'Carve along Glebe Road promenade, cross the Ferry Nab pontoon bridge and race into Far Sawrey.',
    difficulty: 'Challenging',
    mode: 'sprint',
    startName: 'Bowness Bay',
    finishName: 'Far Sawrey',
    lengthMeters: calcLength(bownessPts),
    targetTimeSec: 120,
    parScore: 12000,
    waypoints: bownessPts,
    corridorHalfWidth: 8.5,
    landmarks: [
      { name: 'Bowness Bay', x: bownessPts[0][0], z: bownessPts[0][1] },
      { name: 'Ferry Nab Slipway', x: bownessPts[6][0], z: bownessPts[6][1] },
      { name: 'Far Sawrey', x: bownessPts[11][0], z: bownessPts[11][1] },
    ],
  },
  {
    id: 'troutbeck_brockhole',
    title: 'Troutbeck to Brockhole Descent',
    subtitle: 'High-velocity fell descent from stone-built Troutbeck through Troutbeck Bridge to Low Wood.',
    difficulty: 'Expert',
    mode: 'sprint',
    startName: 'Troutbeck Village',
    finishName: 'Low Wood Shore',
    lengthMeters: calcLength(troutbeckPts),
    targetTimeSec: 165,
    parScore: 16000,
    waypoints: troutbeckPts,
    corridorHalfWidth: 9.0,
    landmarks: [
      { name: 'Troutbeck Village', x: troutbeckPts[0][0], z: troutbeckPts[0][1] },
      { name: 'Troutbeck Bridge', x: troutbeckPts[3][0], z: troutbeckPts[3][1] },
      { name: 'Brockhole', x: troutbeckPts[7][0], z: troutbeckPts[7][1] },
    ],
  },
  {
    id: 'lakeside_newby',
    title: 'Newby Bridge & Lakeside Rails',
    subtitle: 'Follow the River Leven and A592 past the heritage railway line into Lakeside Steamer Pier.',
    difficulty: 'Challenging',
    mode: 'sprint',
    startName: 'Newby Bridge',
    finishName: 'Lakeside Pier',
    lengthMeters: calcLength(lakesidePts),
    targetTimeSec: 105,
    parScore: 10000,
    waypoints: lakesidePts,
    corridorHalfWidth: 8.5,
    landmarks: [
      { name: 'Newby Bridge', x: lakesidePts[0][0], z: lakesidePts[0][1] },
      { name: 'Lakeside Pier', x: lakesidePts[8][0], z: lakesidePts[8][1] },
    ],
  },
  {
    id: 'windermere_explorer',
    title: 'Windermere Free Roam',
    subtitle: 'Open 360° exploration across the entire 18 km lake basin, fells, and 16 Lakeland settlements.',
    difficulty: 'Open',
    mode: 'freeroam',
    startName: 'Waterhead Promenade',
    finishName: 'Endless Lake Basin',
    lengthMeters: 18000,
    targetTimeSec: 0,
    parScore: 15000,
    waypoints: explorerPts,
    corridorHalfWidth: 9999,
    landmarks: [
      { name: 'Waterhead Promenade', x: explorerPts[0][0], z: explorerPts[0][1] },
    ],
  },
];
