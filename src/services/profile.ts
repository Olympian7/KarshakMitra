
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';

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

// For this demo, we'll use a single, hardcoded user profile document.
// In a real app, this ID would be dynamic based on the logged-in user.
const USER_PROFILE_ID = 'user_narayanan';

// Default/mock data to initialize the profile if it doesn't exist
const defaultProfile: FarmProfile = {
  farmerName: 'Narayanan',
  farmName: 'Narayanan Farms',
  location: 'Kuttanad, Kerala',
  farmSize: '15',
  soilType: 'Alluvial Soil',
  mainCrops: 'Paddy, Coconuts, Bananas, Black Pepper',
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
    { value: 0, color: 'hsl(0, 0%, 85%)', label: { en: 'Empty', ml: 'ഒഴിഞ്ഞ' } },
    { value: 100, color: 'hsl(205, 90%, 60%)', label: { en: 'Paddy', ml: 'നെല്ല്' } },
    { value: 90, color: 'hsl(80, 80%, 40%)', label: { en: 'Pepper', ml: 'കുരുമുളക്' } },
    { value: 80, color: 'hsl(45, 95%, 55%)', label: { en: 'Bananas', ml: 'വാഴ' } },
    { value: 60, color: 'hsl(30, 60%, 50%)', label: { en: 'Coconut', ml: 'തെങ്ങ്' } },
    { value: 40, color: 'hsl(0, 80%, 60%)', label: { en: 'Ginger / Turmeric', ml: 'ഇഞ്ചി / മഞ്ഞൾ' } },
  ],
  cropStock: [
    { name: 'Paddy', quantity: 2500, unit: 'kg' },
    { name: 'Coconut', quantity: 5000, unit: 'kg' },
    { name: 'Banana', quantity: 1500, unit: 'kg' },
    { name: 'Black Pepper', quantity: 150, unit: 'kg' },
    { name: 'Ginger', quantity: 80, unit: 'kg' },
  ],
  farmInputs: [
      { name: 'Urea', type: 'Fertilizer', quantity: 50, unit: 'kg' },
      { name: 'Neem Oil', type: 'Pesticide', quantity: 5, unit: 'litres' },
      { name: 'Uma (Paddy)', type: 'Seed', quantity: 200, unit: 'kg' },
      { name: 'Glyphosate', type: 'Herbicide', quantity: 2, unit: 'litres' },
  ]
};

export async function getProfile(): Promise<FarmProfile> {
  // Opt out of caching for this function.
  noStore();
  
  const profileDocRef = doc(db, 'profiles', USER_PROFILE_ID);
  
  try {
    const docSnap = await getDoc(profileDocRef);

    if (docSnap.exists()) {
      console.log("Profile data fetched from Firestore.");
      return docSnap.data() as FarmProfile;
    } else {
      // Document doesn't exist, so create it with the default data
      console.log("No profile found. Creating one with default data.");
      await setDoc(profileDocRef, defaultProfile);
      return defaultProfile;
    }
  } catch (error) {
    console.error("Error fetching or creating profile:", error);
    // If there's an error, return the default profile to prevent the app from crashing.
    return defaultProfile;
  }
}

export async function saveProfile(newProfile: FarmProfile): Promise<FarmProfile> {
    const profileDocRef = doc(db, 'profiles', USER_PROFILE_ID);
    
    try {
        await setDoc(profileDocRef, newProfile);
        console.log("Profile data saved to Firestore.");
        return newProfile;
    } catch (error) {
        console.error("Error saving profile:", error);
        // In case of an error, re-throw it so the UI can handle it.
        throw new Error("Failed to save profile to the database.");
    }
}
