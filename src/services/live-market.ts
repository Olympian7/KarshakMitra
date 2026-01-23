
'use server';
// This service fetches live agricultural market data from data.gov.in.

import { getMarketTrends, MarketTrend } from './market';

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
const STATE = 'Tamil Nadu';

// Mock data for Chennai to use as a fallback or for demonstration
const mockChennaiTomatoData: LiveMarketRecord[] = [
    {
        "arrival_date": new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
        "market": "Koyambedu",
        "variety": "Local",
        "min_price": "1800",
        "max_price": "2000",
        "modal_price": "1900"
    },
    {
        "arrival_date": new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
        "market": "Koyambedu",
        "variety": "Hybrid",
        "min_price": "2100",
        "max_price": "2300",
        "modal_price": "2200"
    },
    {
        "arrival_date": new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
        "market": "Koyambedu",
        "variety": "Local",
        "min_price": "1700",
        "max_price": "1900",
        "modal_price": "1800"
    }
];

function trendToRecord(trend: MarketTrend): LiveMarketRecord {
    const pricePerQuintal = trend.price * 100;
    return {
        arrival_date: new Date().toLocaleDateString('en-GB'),
        market: trend.market,
        variety: trend.variety,
        min_price: (pricePerQuintal * 0.95).toFixed(0),
        max_price: (pricePerQuintal * 1.05).toFixed(0),
        modal_price: pricePerQuintal.toFixed(0),
    };
}


export async function getLiveCropPrices(commodity: string): Promise<LiveMarketRecord[]> {
    if (commodity.toLowerCase() === 'tomato') {
        // For tomato, return our specific mock data for Chennai
        return mockChennaiTomatoData;
    }

    const url = new URL(`https://api.data.gov.in/resource/${RESOURCE_ID}`);
    url.searchParams.set('api-key', API_KEY);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '50'); // Fetch a good number of records
    url.searchParams.set('filters[state]', STATE);
    url.searchParams.set('filters[commodity]', commodity);
    
    try {
        console.log(`Fetching live data for: ${commodity} in ${STATE}`);
        const res = await fetch(url.toString(), {
          // Revalidate cache every hour to get fresh data without hitting API on every request
          next: { revalidate: 3600 } 
        });

        if (!res.ok) {
            console.error(`API error for ${commodity}: ${res.status} ${res.statusText}`);
            throw new Error('API request failed');
        }
        const data = await res.json();
        const records = Array.isArray(data.records) ? data.records : [];
        if (records.length > 0) {
            return records;
        }

        console.warn(`Live API returned no records for ${commodity}. Falling back to mock data.`);
        const mockTrends = await getMarketTrends();
        const fallbackTrend = mockTrends.find(t => t.name.toLowerCase() === commodity.toLowerCase());
        return fallbackTrend ? [trendToRecord(fallbackTrend)] : [];

    } catch (e) {
        console.error(`Failed to fetch data for ${commodity}:`, e, "Falling back to mock data.");
        // In case of error, use mock data as a fallback
        const mockTrends = await getMarketTrends();
        const fallbackTrend = mockTrends.find(t => t.name.toLowerCase() === commodity.toLowerCase());
        return fallbackTrend ? [trendToRecord(fallbackTrend)] : [];
    }
}
