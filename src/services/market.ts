
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
    // Kerala specific crops
    { name: "Paddy", variety: "Uma", price: 22.50, market: "Alappuzha", district: "Alappuzha" },
    { name: "Coconut", variety: "WCT", price: 32.00, market: "Kochi", district: "Ernakulam" },
    { name: "Rubber", variety: "RSS-4", price: 175.00, market: "Kottayam", district: "Kottayam" },
    { name: "Banana", variety: "Nendran", price: 48.00, market: "Thrissur", district: "Thrissur" },
    { name: "Black Pepper", variety: "Tellicherry", price: 650.00, market: "Idukki", district: "Idukki" },
    { name: "Ginger", variety: "Cochin", price: 160.00, market: "Kochi", district: "Ernakulam" },
    { name: "Cardamom", variety: "Green", price: 1800.00, market: "Vandanmedu", district: "Idukki" },
    { name: "Tapioca", variety: "M-4", price: 18.00, market: "Thiruvananthapuram", district: "Thiruvananthapuram" },
    { name: "Arecanut", variety: "Ripe", price: 280.00, market: "Kasaragod", district: "Kasaragod" },
    { name: "Okra", variety: "Arka Anamika", price: 35.00, market: "Palakkad", district: "Palakkad" },
    { name: "Brinjal", variety: "Long Green", price: 32.00, market: "Kochi", district: "Ernakulam" },
    { name: "Tomato", variety: "Hybrid", price: 25.00, market: "Kochi", district: "Ernakulam" },
    { name: "Lentils", variety: "Local", price: 90.00, market: "Palakkad", district: "Palakkad" },
];


export async function getMarketTrends(): Promise<MarketTrend[]> {
  console.log("Fetching mock market trends for Kerala...");
  
  // Simulate network delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return the mock data
  return MOCK_MARKET_DATA;
}
