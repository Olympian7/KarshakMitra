'use server';

// This service fetches live agricultural market data.
// This is a mock service for demonstration.

export type MarketTrend = {
  name: string;
  variety: string;
  price: number; // Price per Kg
  market: string;
  district: string;
};

// --- CONFIG ---
// Mock data relevant to Tamil Nadu
const MOCK_MARKET_DATA: MarketTrend[] = [
    { name: "Banana", variety: "Poovan", price: 25.00, market: "Madurai", district: "Madurai" },
    { name: "Brinjal", variety: "Local", price: 28.00, market: "Chennai", district: "Chennai" },
    { name: "Coconut", variety: "Tall", price: 28.00, market: "Coimbatore", district: "Coimbatore" },
    { name: "Cotton", variety: "MCU-5", price: 65.00, market: "Salem", district: "Salem" },
    { name: "Groundnut", variety: "TMV 7", price: 85.00, market: "Tiruvannamalai", district: "Tiruvannamalai"},
    { name: "Maize", variety: "Hybrid", price: 22.00, market: "Dindigul", district: "Dindigul"},
    { name: "Mango", variety: "Alphonso", price: 120.00, market: "Krishnagiri", district: "Krishnagiri" },
    { name: "Okra", variety: "Hybrid", price: 30.00, market: "Dindigul", district: "Dindigul" },
    { name: "Onion", variety: "Bellary", price: 40.00, market: "Tirunelveli", district: "Tirunelveli" },
    { name: "Paddy", variety: "ADT 43", price: 21.00, market: "Thanjavur", district: "Thanjavur" },
    { name: "Sugarcane", variety: "Co 86032", price: 2.95, market: "Erode", district: "Erode" },
    { name: "Tapioca", variety: "H-226", price: 15.00, market: "Namakkal", district: "Namakkal" },
    { name: "Tomato", variety: "PKM 1", price: 20.00, market: "Coimbatore", district: "Coimbatore" },
    { name: "Turmeric", variety: "Erode", price: 150.00, market: "Erode", district: "Erode" },
];


export async function getMarketTrends(): Promise<MarketTrend[]> {
  console.log("Fetching mock market trends for Tamil Nadu...");
  
  // Simulate network delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return the mock data
  return MOCK_MARKET_DATA;
}
