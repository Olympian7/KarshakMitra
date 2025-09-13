
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
    unit: 'kg';
}

export interface FarmInput {
    name: string;
    type: 'Fertilizer' | 'Pesticide' | 'Seed' | 'Herbicide';
    quantity: number;
    unit: 'kg' | 'litres';
}

export interface FarmProfile {
  farmerName: string;
  farmName: string;
  location: string;
  farmSize: string; // acres
  soilType: string;
  mainCrops: string;
  farmGrid: number[][];
  plotTypes: PlotType[];
  cropStock: CropStock[];
  farmInputs: FarmInput[];
}

// Default/mock data
let userProfile: FarmProfile = {
  farmerName: 'Narayanan',
  farmName: 'Narayanan Farms',
  location: 'Kuttanad, Kerala',
  farmSize: '15',
  soilType: 'Alluvial Soil',
  mainCrops: 'Paddy (High-Yield), Lentils, Bananas, Okra, Ginger',
  farmGrid: [
    [100, 100, 100, 100, 100, 80, 80, 80, 0, 0],
    [100, 100, 100, 100, 100, 80, 80, 80, 0, 0],
    [100, 100, 100, 100, 100, 80, 80, 80, 60, 60],
    [100, 100, 100, 100, 100, 90, 90, 90, 60, 60],
    [100, 100, 100, 100, 100, 90, 90, 90, 60, 60],
    [100, 100, 100, 100, 100, 90, 90, 90, 60, 60],
    [100, 100, 100, 100, 100, 0, 0, 40, 40, 40],
    [100, 100, 100, 100, 100, 0, 0, 40, 40, 40],
    [0, 0, 0, 0, 0, 0, 0, 40, 40, 40],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  plotTypes: [
    { value: 0, color: 'bg-gray-200', label: { en: 'Empty', ml: 'ഒഴിഞ്ഞ' } },
    { value: 100, color: 'bg-blue-400', label: { en: 'Paddy', ml: 'നെല്ല്' } },
    { value: 90, color: 'bg-yellow-400', label: { en: 'Lentils', ml: 'പയർവർഗ്ഗങ്ങൾ' } },
    { value: 80, color: 'bg-yellow-600', label: { en: 'Bananas', ml: 'വാഴ' } },
    { value: 60, color: 'bg-green-500', label: { en: 'Okra', ml: 'വെണ്ട' } },
    { value: 40, color: 'bg-red-500', label: { en: 'Ginger / Turmeric', ml: 'ഇഞ്ചി / മഞ്ഞൾ' } },
  ],
  cropStock: [
    { name: 'Paddy', quantity: 1200, unit: 'kg' },
    { name: 'Lentils', quantity: 150, unit: 'kg' },
    { name: 'Banana', quantity: 400, unit: 'kg' },
    { name: 'Ginger', quantity: 80, unit: 'kg' },
    { name: 'Okra', quantity: 120, unit: 'kg' },
  ],
  farmInputs: [
      { name: 'Urea', type: 'Fertilizer', quantity: 50, unit: 'kg' },
      { name: 'Neem Oil', type: 'Pesticide', quantity: 5, unit: 'litres' },
      { name: 'Uma (Paddy)', type: 'Seed', quantity: 200, unit: 'kg' },
      { name: 'Glyphosate', type: 'Herbicide', quantity: 2, unit: 'litres' },
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
