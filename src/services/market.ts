// This is a mock service that simulates fetching market data.
// In a real application, you would replace this with a call to a real market data API.

export type MarketTrend = {
  name: string;
  variety: string;
  price: number; // Price per kg
};

const mockMarketData: MarketTrend[] = [
    { name: 'Rubber', variety: 'RSS-4', price: 185.50 },
    { name: 'Coconut', variety: 'Milling', price: 26.75 },
    { name: 'Cardamom', variety: '8mm Bold', price: 1950.00 },
    { name: 'Black Pepper', variety: 'Malabar Garbled', price: 580.00 },
    { name: 'Areca Nut', variety: 'Ripe', price: 350.00 },
    { name: 'Ginger', variety: 'Cochin', price: 120.00 },
    { name: 'Turmeric', variety: 'Salem', price: 95.00 },
];

export async function getMarketTrends(): Promise<MarketTrend[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock data
  return mockMarketData;
}
