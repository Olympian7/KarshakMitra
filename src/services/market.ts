// This is a mock service that simulates fetching market data.
// In a real application, you would replace this with a call to a real market data API.

export type MarketTrend = {
  name: string;
  variety: string;
  price: number; // Price per kg
  change: number; // Percentage change
  changeDirection: 'up' | 'down';
  category: 'Spices' | 'Plantation Crops';
};

// Function to generate a random price change
const getRandomChange = () => {
    const change = (Math.random() * 2 - 1) * 5; // Random change between -5% and +5%
    return parseFloat(change.toFixed(2));
}


const mockMarketData: MarketTrend[] = [
    { name: 'Rubber', variety: 'RSS-4', price: 185.50, change: 0, changeDirection: 'up', category: 'Plantation Crops' },
    { name: 'Coconut', variety: 'Milling', price: 26.75, change: 0, changeDirection: 'down', category: 'Plantation Crops' },
    { name: 'Cardamom', variety: '8mm Bold', price: 1950.00, change: 0, changeDirection: 'up', category: 'Spices' },
    { name: 'Black Pepper', variety: 'Malabar Garbled', price: 580.00, change: 0, changeDirection: 'down', category: 'Spices' },
    { name: 'Areca Nut', variety: 'Ripe', price: 350.00, change: 0, changeDirection: 'up', category: 'Plantation Crops' },
    { name: 'Ginger', variety: 'Cochin', price: 120.00, change: 0, changeDirection: 'down', category: 'Spices' },
    { name: 'Turmeric', variety: 'Salem', price: 95.00, change: 0, changeDirection: 'up', category: 'Spices' },
].map(item => {
    const change = getRandomChange();
    return {
        ...item,
        change: Math.abs(change),
        changeDirection: change >= 0 ? 'up' : 'down',
    }
});

export async function getMarketTrends(): Promise<MarketTrend[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock data
  return mockMarketData;
}
