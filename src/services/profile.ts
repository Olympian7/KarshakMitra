'use server';

// This is a mock service that simulates fetching and storing farm profile data.
// In a real application, you would replace this with a call to a real database.

export interface PlotType {
    value: number;
    color: string; // This will now be a Tailwind gradient class
    label: { en: string; ml: string };
}


export interface FarmProfile {
  farmerName: string;
  farmName: string;
  location: string;
  farmSize: string; // acres
  soilType: string;
  mainCrops: string;
  farmGrid: number[][];
  plotTypes: PlotType[]; // The palette is now part of the profile
}

// A completely empty 10x10 grid to start
const defaultGrid = Array(10).fill(Array(10).fill(0));

const defaultPlotTypes: PlotType[] = [
    { value: 0, color: 'from-gray-100 to-gray-200', label: { en: 'Empty', ml: 'ഒഴിഞ്ഞ' } },
    { value: 100, color: 'from-teal-500 to-cyan-400', label: { en: 'Paddy', ml: 'നെല്ല്' } },
    { value: 90, color: 'from-orange-500 to-amber-400', label: { en: 'Lentils', ml: 'പയർവർഗ്ഗങ്ങൾ' } },
    { value: 80, color: 'from-yellow-400 to-yellow-300', label: { en: 'Bananas', ml: 'വാഴ' } },
    { value: 60, color: 'from-lime-500 to-green-400', label: { en: 'Okra', ml: 'വെണ്ട' } },
    { value: 40, color: 'from-rose-400 to-red-500', label: { en: 'Ginger / Turmeric', ml: 'ഇഞ്ചി / മഞ്ഞൾ' } },
    { value: 20, color: 'from-indigo-500 to-purple-500', label: { en: 'Vegetables', ml: 'പച്ചക്കറികൾ' } },
    { value: 10, color: 'from-stone-400 to-stone-500', label: { en: 'Fallow Land', ml: 'തരിശുഭൂമി' } },
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
