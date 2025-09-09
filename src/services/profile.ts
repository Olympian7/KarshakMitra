'use server';

// This is a mock service that simulates fetching and storing farm profile data.
// In a real application, you would replace this with a call to a real database.

export interface FarmProfile {
  farmerName: string;
  farmName: string;
  location: string;
  farmSize: string; // acres
  soilType: string;
  mainCrops: string;
  farmGrid: number[][]; // Add farmGrid to store layout data
}

// Default/mock grid data
const defaultGrid = [
    [10, 20, 30, 40, 50, 50, 40, 30, 20, 10],
    [20, 30, 40, 60, 70, 70, 60, 40, 30, 20],
    [30, 40, 60, 80, 90, 90, 80, 60, 40, 30],
    [40, 60, 80, 90, 100, 100, 90, 80, 60, 40],
    [50, 70, 90, 100, 100, 100, 100, 90, 70, 50],
    [50, 70, 90, 100, 100, 100, 100, 90, 70, 50],
    [40, 60, 80, 90, 100, 100, 90, 80, 60, 40],
    [30, 40, 60, 80, 90, 90, 80, 60, 40, 30],
    [20, 30, 40, 60, 70, 70, 60, 40, 30, 20],
    [10, 20, 30, 40, 50, 50, 40, 30, 20, 10],
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
