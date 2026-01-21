
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

// Mock data for Ernakulam to use as a fallback or for demonstration
const mockErnakulamTomatoData: LiveMarketRecord[] = [
    {
        "arrival_date": new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').split('/').reverse().join('/'),
        "market": "Ernakulam",
        "variety": "Local",
        "min_price": "2200",
        "max_price": "2400",
        "modal_price": "2300"
    },
    {
        "arrival_date": new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').split('/').reverse().join('/'),
        "market": "Angamaly",
        "variety": "Hybrid",
        "min_price": "2500",
        "max_price": "2700",
        "modal_price": "2600"
    },
    {
        "arrival_date": new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').split('/').reverse().join('/'),
        "market": "Kochi",
        "variety": "Local",
        "min_price": "2100",
        "max_price": "2300",
        "modal_price": "2200"
    }
];

export async function getLiveCropPrices(commodity: string): Promise<LiveMarketRecord[]> {
    if (commodity.toLowerCase() === 'tomato') {
        // For tomato, return our specific mock data for Ernakulam
        return mockErnakulamTomatoData;
    }

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
