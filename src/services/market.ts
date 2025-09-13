'use server';

// This is a mock service that simulates fetching market trend data.
// In a real application, you would replace this with a call to a real data API.

export type MarketTrend = {
  name: string;
  variety: string;
  price: number; // Price per Kg
  market: string;
  district: string;
};

// Mock data that includes all crops from the user's profile stock.
const mockMarketData: MarketTrend[] = [
  // Crops from Farm Profile
  { name: 'Paddy', variety: 'Jaya', price: 20.50, market: 'Alappuzha', district: 'Alappuzha' },
  { name: 'Paddy', variety: 'Uma', price: 21.00, market: 'Kuttanad', district: 'Alappuzha' },
  { name: 'Lentils', variety: 'Red', price: 95.00, market: 'Thrissur', district: 'Thrissur' },
  { name: 'Banana', variety: 'Nendran', price: 45.00, market: 'Ernakulam', district: 'Ernakulam' },
  { name: 'Banana', variety: 'Robusta', price: 30.00, market: 'Kottayam', district: 'Kottayam' },
  { name: 'Ginger', variety: 'Cochin', price: 120.00, market: 'Idukki', district: 'Idukki' },
  { name: 'Okra', variety: 'Arka Anamika', price: 35.00, market: 'Palakkad', district: 'Palakkad' },
  
  // Additional common crops for variety
  { name: 'Coconut', variety: 'West Coast Tall', price: 32.00, market: 'Kozhikode', district: 'Kozhikode' },
  { name: 'Coconut', variety: 'Chowghat Orange', price: 35.00, market: 'Malappuram', district: 'Malappuram' },
  { name: 'Rubber', variety: 'RSS-4', price: 175.00, market: 'Kottayam', district: 'Kottayam' },
  { name: 'Black Pepper', variety: 'Tellicherry', price: 550.00, market: 'Wayanad', district: 'Wayanad' },
  { name: 'Cardamom', variety: 'Green', price: 1500.00, market: 'Idukki', district: 'Idukki' },
  { name: 'Tapioca', variety: 'Malayan-4', price: 25.00, market: 'Pathanamthitta', district: 'Pathanamthitta' },
  { name: 'Tomato', variety: 'Hybrid', price: 40.00, market: 'Thrissur', district: 'Thrissur' },
];


export async function getMarketTrends(): Promise<MarketTrend[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Return mock data
  return mockMarketData;
}
