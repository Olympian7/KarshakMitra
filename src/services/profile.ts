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
}

// Default/mock data
let userProfile: FarmProfile = {
  farmerName: 'Narayanan',
  farmName: 'Narayanan Farms',
  location: 'Kuttanad, Kerala',
  farmSize: '15',
  soilType: 'Alluvial Soil',
  mainCrops: 'Paddy (High-Yield), Lentils, Bananas, Okra, Ginger',
};

export async function getProfile(): Promise<FarmProfile> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return userProfile;
}

export async function saveProfile(newProfile: FarmProfile): Promise<FarmProfile> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    userProfile = newProfile;
    return userProfile;
}
