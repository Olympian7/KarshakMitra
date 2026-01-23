
'use server';
/**
 * @fileOverview Defines AI tools for KarshakMitra to interact with external services.
 *
 * - getWeatherForecastTool - Fetches the current weather forecast.
 * - getMarketTrendsTool - Fetches the latest market prices for crops.
 * - getGovSchemesTool - Fetches information about available government schemes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  getWeatherForecast,
  WeatherData,
} from '@/services/weather';
import {
  getMarketTrends,
  MarketTrend,
} from '@/services/market';
import {
  getGovSchemes,
  GovScheme
} from '@/services/govSchemes';

export const getWeatherForecastTool = ai.defineTool(
  {
    name: 'getWeatherForecast',
    description: 'Returns the current weather forecast for a specific location.',
    inputSchema: z.object({
      location: z.string().describe("The user's location, e.g., 'Coimbatore, Tamil Nadu'"),
    }),
    outputSchema: z.custom<WeatherData>(),
  },
  async ({ location }) => {
    // In a real app, this would use the location to get specific data.
    // For now, we'll return the mock data but acknowledge the location.
    console.log(`Fetching weather for ${location}`);
    return await getWeatherForecast();
  }
);

export const getMarketTrendsTool = ai.defineTool(
  {
    name: 'getMarketTrends',
    description: 'Returns the latest market prices for various crops.',
    inputSchema: z.object({}),
    outputSchema: z.custom<MarketTrend[]>(),
  },
  async () => {
    return await getMarketTrends();
  }
);

export const getGovSchemesTool = ai.defineTool(
  {
    name: 'getGovSchemes',
    description: 'Returns a list of available government schemes for farmers.',
    inputSchema: z.object({}),
    outputSchema: z.custom<GovScheme[]>(),
  },
  async () => {
    return await getGovSchemes();
  }
);
