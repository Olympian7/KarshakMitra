
'use server';

// This service fetches live agricultural market data from data.gov.in.

export type MarketTrend = {
  name: string;
  variety: string;
  price: number; // Price per Kg
  market: string;
  district: string;
};

// --- CONFIG ---
// This is a mock service now, so no API key is needed.

const MOCK_MARKET_DATA: MarketTrend[] = [
    // Tenkasi specific crops
    { name: "Paddy", variety: "ADT-45", price: 21.50, market: "Tenkasi", district: "Tenkasi" },
    { name: "Groundnut", variety: "TMV-7", price: 75.00, market: "Sankarankovil", district: "Tenkasi" },
    { name: "Chilli", variety: "K-1", price: 90.00, market: "Kadayanallur", district: "Tenkasi" },
    { name: "Mango", variety: "Alphonso", price: 120.00, market: "Tenkasi", district: "Tenkasi" },
    { name: "Brinjal", variety: "Long Green", price: 30.00, market: "Tenkasi", district: "Tenkasi" },
    
    // Other crops
    { name: "Lentils", variety: "Local", price: 85.00, market: "Tirunelveli", district: "Tirunelveli" },
    { name: "Banana", variety: "Nendran", price: 45.00, market: "Tenkasi", district: "Tenkasi" },
    { name: "Ginger", variety: "Local", price: 150.00, market: "Sivagiri (Tenkasi)", district: "Tenkasi" },
    { name: "Okra", variety: "Hybrid", price: 28.00, market: "Tenkasi", district: "Tenkasi" },
    { name: "Coconut", variety: "Tall", price: 25.00, market: "Alangulam", district: "Tenkasi" },
    { name: "Tapioca", variety: "Local", price: 15.00, market: "Sankarankovil", district: "Tenkasi" },
    { name: "Tomato", variety: "Hybrid", price: 26.00, market: "Tenkasi", district: "Tenkasi" },
];


export async function getMarketTrends(): Promise<MarketTrend[]> {
  console.log("Fetching mock market trends for Tenkasi...");
  
  // Simulate network delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return the mock data
  return MOCK_MARKET_DATA;
}
