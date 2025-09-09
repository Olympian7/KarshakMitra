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

// More realistic, less symmetrical grid
const defaultGrid = [
    [100, 100, 100, 90, 80, 80, 60, 60, 10, 10],
    [100, 100, 90, 90, 80, 80, 60, 40, 40, 10],
    [100, 90, 90, 80, 80, 60, 40, 40, 20, 20],
    [90, 90, 80, 60, 60, 40, 40, 20, 20, 10],
    [90, 80, 80, 60, 40, 40, 20, 20, 10, 10],
    [80, 80, 60, 40, 40, 20, 20, 10, 10, 10],
    [60, 60, 40, 20, 20, 20, 10, 10, 10, 10],
    [60, 40, 40, 20, 10, 10, 10, 10, 10, 10],
    [40, 40, 20, 10, 10, 10, 10, 10, 10, 10],
    [20, 20, 10, 10, 10, 10, 10, 10, 10, 10],
];

const defaultPlotTypes: PlotType[] = [
    { value: 100, color: 'from-red-600 to-red-400', label: { en: 'Paddy (High-Yield)', ml: 'നെല്ല് (ഉയർന്ന വിളവ്)' } },
    { value: 90, color: 'from-orange-500 to-orange-300', label: { en: 'Paddy (Mid-Yield)', ml: 'നെല്ല് (ഇടത്തരം വിളവ്)' } },
    { value: 80, color: 'from-yellow-400 to-yellow-200', label: { en: 'Lentils', ml: 'പയർവർഗ്ഗങ്ങൾ' } },
    { value: 60, color: 'from-amber-500 to-yellow-300', label: { en: 'Bananas', ml: 'വാഴ' } },
    { value: 40, color: 'from-lime-600 to-lime-400', label: { en: 'Okra', ml: 'വെണ്ട' } },
    { value: 20, color: 'from-green-600 to-green-400', label: { en: 'Ginger / Turmeric', ml: 'ഇഞ്ചി / മഞ്ഞൾ' } },
    { value: 10, color: 'from-blue-800 to-blue-600', label: { en: 'Fallow Land', ml: 'തരിശുഭൂമി' } },
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
