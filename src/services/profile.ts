
'use server';

// This is a mock service that simulates fetching and storing farm profile data.
// In a real application, you would replace this with a call to a real database.

export interface PlotType {
    value: number;
    color: string;
    label: { en: string; ml: string };
}

export interface CropStock {
    name: string;
    quantity: number;
    unit: 'kg' | 'tonnes';
}

export interface FarmProfile {
  farmerName: string;
  farmName: string;
  location: string;
  farmSize: string; // acres
  soilType: string;
  mainCrops: string;
  farmGrid: number[][];
  cropStock: CropStock[];
}

// A non-symmetrical 10x10 grid to start
const defaultGrid = [
  [100, 100, 100, 100, 100, 90, 90, 0, 80, 80],
  [100, 100, 100, 100, 100, 90, 90, 0, 80, 80],
  [100, 100, 100, 100, 100, 90, 0, 0, 80, 80],
  [100, 100, 100, 60, 60, 0, 0, 0, 80, 80],
  [100, 100, 100, 60, 60, 0, 0, 0, 0, 0],
  [0, 0, 0, 60, 60, 40, 40, 40, 0, 0],
  [0, 0, 0, 0, 0, 40, 40, 40, 0, 0],
  [0, 0, 0, 0, 0, 40, 40, 40, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];


// Default/mock data
let userProfile: FarmProfile = {
  farmerName: 'Narayanan',
  farmName: 'Narayanan Farms',
  location: 'Kuttanad, Kerala',
  farmSize: '15',
  soilType: 'Alluvial Soil',
  mainCrops: 'Paddy (High-Yield), Lentils, Bananas, Okra, Ginger',
  farmGrid: defaultGrid,
  cropStock: [
    { name: 'Paddy', quantity: 5, unit: 'tonnes' },
    { name: 'Lentils', quantity: 500, unit: 'kg' },
    { name: 'Banana', quantity: 1500, unit: 'kg' },
    { name: 'Ginger', quantity: 250, unit: 'kg' },
    { name: 'Okra', quantity: 400, unit: 'kg' },
  ]
};

export async function getProfile(): Promise<FarmProfile> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return JSON.parse(JSON.stringify(userProfile)); // Deep copy to prevent mutation issues
}

export async function saveProfile(newProfile: FarmProfile): Promise<FarmProfile> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    userProfile = JSON.parse(JSON.stringify(newProfile)); // Store a deep copy
    return userProfile;
}
