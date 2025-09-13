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
const API_KEY = '579b464db66ec23bdd000001fafcf228efd042c75a7d9ea9384e5b79';
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const STATE = 'Kerala';
// List of common commodities to fetch for the market page.
const COMMODITIES_TO_FETCH = [
  'Paddy', 'Lentils', 'Banana', 'Ginger', 'Okra', // From profile
  'Coconut', 'Rubber', 'Black Pepper', 'Cardamom', 'Tapioca', 'Tomato'
];


async function fetchCropPrices(commodity: string): Promise<any[]> {
    const url = new URL(`https://api.data.gov.in/resource/${RESOURCE_ID}`);
    url.searchParams.set('api-key', API_KEY);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '20'); // Get up to 20 recent entries per commodity
    url.searchParams.set('filters[state]', STATE);
    url.searchParams.set('filters[commodity]', commodity);
    
    try {
        const res = await fetch(url.toString());
        if (!res.ok) {
            console.error(`API error for ${commodity}: ${res.status}`);
            return [];
        }
        const data = await res.json();
        return Array.isArray(data.records) ? data.records : [];
    } catch (e) {
        console.error(`Failed to fetch data for ${commodity}:`, e);
        return [];
    }
}


export async function getMarketTrends(): Promise<MarketTrend[]> {
  console.log("Fetching live market trends...");
  
  // Fetch all commodities in parallel for speed
  const promises = COMMODITIES_TO_FETCH.map(fetchCropPrices);
  const results = await Promise.all(promises);
  
  const allRecords = results.flat();

  if (allRecords.length === 0) {
    console.warn("No market data was fetched from the API.");
    return [];
  }

  // Transform the raw API records into our application's data structure
  const formattedTrends: MarketTrend[] = allRecords
    .map(record => {
      // The API returns price per quintal (100kg). We convert it to per kg.
      const pricePerKg = record.modal_price ? parseFloat(record.modal_price) / 100 : 0;
      
      return {
        name: record.commodity,
        variety: record.variety,
        price: pricePerKg,
        market: record.market,
        district: record.district,
      };
    })
    .filter(trend => trend.price > 0) // Filter out entries with no price data
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by crop name

  return formattedTrends;
}
