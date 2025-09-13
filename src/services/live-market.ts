'use server';

// This service fetches live agricultural market data from data.gov.in.

export interface LiveMarketRecord {
    arrival_date: string;
    market: string;
    variety: string;
    min_price: string;
    max_price: string;
    modal_price: string;
}

// --- CONFIG ---
const API_KEY = '579b464db66ec23bdd000001fafcf228efd042c75a7d9ea9384e5b79';
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const STATE = 'Kerala';

// List of commodities for the dropdown
export const COMMODITIES = [
  'Tomato', 'Onion', 'Paddy', 'Coconut', 'Banana', 'Rubber', 
  'Rice', 'Arecanut', 'Mango', 'Potato', 'Black Pepper', 'Cardamom',
  'Ginger', 'Tapioca'
];


export async function getLiveCropPrices(commodity: string): Promise<LiveMarketRecord[]> {
    const url = new URL(`https://api.data.gov.in/resource/${RESOURCE_ID}`);
    url.searchParams.set('api-key', API_KEY);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '50'); // Fetch a good number of records
    url.searchParams.set('filters[state]', STATE);
    url.searchParams.set('filters[commodity]', commodity);
    
    try {
        console.log(`Fetching live data for: ${commodity}`);
        const res = await fetch(url.toString(), {
          // Revalidate cache every hour to get fresh data without hitting API on every request
          next: { revalidate: 3600 } 
        });

        if (!res.ok) {
            console.error(`API error for ${commodity}: ${res.status} ${res.statusText}`);
            throw new Error('API request failed');
        }
        const data = await res.json();
        return Array.isArray(data.records) ? data.records : [];
    } catch (e) {
        console.error(`Failed to fetch data for ${commodity}:`, e);
        // In case of error, return an empty array to prevent crashing the UI
        return [];
    }
}
