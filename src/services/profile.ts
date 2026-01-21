
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';

export interface PlotType {
    value: number;
    color: string;
    label: { en: string; ta: string };
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
const USER_PROFILE_ID = 'user_muthu';

// Default/mock data to initialize the profile if it doesn't exist
const defaultProfile: FarmProfile = {
  farmerName: 'Muthu',
  farmName: 'Muthu Pannai',
  location: 'Thanjavur, Tamil Nadu',
  farmSize: '20',
  soilType: 'Alluvial Soil (Cauvery Delta)',
  mainCrops: 'Paddy, Sugarcane, Banana, Turmeric',
  farmGrid: [
    [100, 100, 100, 100, 100, 90, 90, 90, 0, 0],
    [100, 100, 100, 100, 100, 90, 90, 90, 0, 0],
    [100, 100, 100, 100, 100, 90, 90, 80, 80, 80],
    [100, 100, 100, 100, 100, 90, 90, 80, 80, 80],
    [100, 100, 100, 100, 100, 60, 60, 80, 80, 80],
    [100, 100, 100, 100, 100, 60, 60, 40, 40, 0],
    [100, 100, 100, 100, 100, 60, 60, 40, 40, 0],
    [100, 100, 100, 100, 100, 60, 60, 40, 40, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  plotTypes: [
    { value: 0, color: 'hsl(0, 0%, 85%)', label: { en: 'Empty', ta: 'காலி' } },
    { value: 100, color: 'hsl(205, 90%, 60%)', label: { en: 'Paddy', ta: 'நெல்' } },
    { value: 90, color: 'hsl(40, 50%, 60%)', label: { en: 'Sugarcane', ta: 'கரும்பு' } },
    { value: 80, color: 'hsl(45, 95%, 55%)', label: { en: 'Banana', ta: 'வாழை' } },
    { value: 60, color: 'hsl(80, 80%, 40%)', label: { en: 'Cotton', ta: 'பருத்தி' } },
    { value: 40, color: 'hsl(30, 90%, 50%)', label: { en: 'Turmeric', ta: 'மஞ்சள்' } },
  ],
  cropStock: [
    { name: 'Paddy', quantity: 5000, unit: 'kg' },
    { name: 'Sugarcane', quantity: 10000, unit: 'kg' },
    { name: 'Banana', quantity: 2000, unit: 'kg' },
    { name: 'Turmeric', quantity: 500, unit: 'kg' },
    { name: 'Cotton', quantity: 1000, unit: 'kg' },
  ],
  farmInputs: [
      { name: 'Urea', type: 'Fertilizer', quantity: 150, unit: 'kg' },
      { name: 'Potash', type: 'Fertilizer', quantity: 75, unit: 'kg' },
      { name: 'Neem Cake', type: 'Pesticide', quantity: 20, unit: 'kg' },
      { name: 'ADT 45 (Paddy)', type: 'Seed', quantity: 300, unit: 'kg' },
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
