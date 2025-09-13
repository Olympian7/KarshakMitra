// This service now fetches real-time market data from data.gov.in.
'use server';

export type MarketTrend = {
  name: string;
  variety: string;
  price: number; // Price per Quintal (100kg)
  market: string;
  district: string;
};

// This type represents the raw record from the data.gov.in API
type ApiRecord = {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    arrival_date: string;
    min_price: string;
    max_price: string;
    modal_price: string;
};

const API_ENDPOINT = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const API_KEY = process.env.DATA_GOV_IN_API_KEY;

// A simple in-memory cache to avoid hitting the API on every single request
let cache = {
    data: null as MarketTrend[] | null,
    lastFetch: 0,
};
const CACHE_DURATION = 1000 * 60 * 60; // Cache for 1 hour

export async function getMarketTrends(): Promise<MarketTrend[]> {
    const now = Date.now();
    if (cache.data && (now - cache.lastFetch < CACHE_DURATION)) {
        return cache.data;
    }

    if (!API_KEY || API_KEY === 'your_api_key_here') {
        console.error("API Key for data.gov.in is not configured. Please add it to your .env file.");
        return [];
    }
    
    // We fetch a large number of records and filter for Kerala, as the API is national.
    const url = `${API_ENDPOINT}?api-key=${API_KEY}&format=json&limit=1000`;

    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
        if (!response.ok) {
            console.error('Failed to fetch market data:', response.statusText);
            return [];
        }
        
        const json = await response.json();
        const records: ApiRecord[] = json.records;

        const keralaRecords = records.filter(record => record.state === 'Kerala');

        // We only want the most recent, unique entry for each commodity/market combination
        const latestUniqueRecords = new Map<string, ApiRecord>();
        keralaRecords.forEach(record => {
            const key = `${record.commodity}-${record.market}-${record.variety}`;
            const existing = latestUniqueRecords.get(key);
            if (!existing || new Date(record.arrival_date) > new Date(existing.arrival_date)) {
                latestUniqueRecords.set(key, record);
            }
        });

        const transformedData: MarketTrend[] = Array.from(latestUniqueRecords.values()).map(record => ({
            name: record.commodity,
            variety: record.variety,
            price: parseFloat(record.modal_price) / 100, // Price is per quintal, convert to per kg
            market: record.market,
            district: record.district,
        }));
        
        cache.data = transformedData;
        cache.lastFetch = now;
        
        return transformedData;

    } catch (error) {
        console.error('Error fetching or parsing market data:', error);
        return [];
    }
}
