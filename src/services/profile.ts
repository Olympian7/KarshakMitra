
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

// A non-symmetrical 10x10 grid to start
const defaultGrid = Array(10).fill(Array(10).fill(0));


const defaultPlotTypes: PlotType[] = [
    { value: 0, color: 'bg-gradient-to-br from-gray-50 to-gray-200', label: { en: 'Empty', ml: 'ഒഴിഞ്ഞ' } },
    { value: 100, color: 'bg-gradient-to-br from-blue-300 to-blue-500', label: { en: 'Paddy', ml: 'നെല്ല്' } },
    { value: 90, color: 'bg-gradient-to-br from-yellow-200 to-yellow-400', label: { en: 'Lentils', ml: 'പയർവർഗ്ഗങ്ങൾ' } },
    { value: 80, color: 'bg-gradient-to-br from-amber-300 to-amber-500', label: { en: 'Bananas', ml: 'വാഴ' } },
    { value: 60, color: 'bg-gradient-to-br from-green-300 to-green-500', label: { en: 'Okra', ml: 'വെണ്ട' } },
    { value: 40, color: 'bg-gradient-to-br from-red-300 to-red-500', label: { en: 'Ginger / Turmeric', ml: 'ഇഞ്ചി / മഞ്ഞൾ' } },
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
  plotTypes: defaultPlotTypes,
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
