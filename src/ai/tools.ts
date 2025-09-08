'use server';
/**
 * @fileOverview Defines AI tools for Karshak Mitra to interact with external services.
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
    description: 'Returns the current weather forecast.',
    inputSchema: z.object({}),
    outputSchema: z.custom<WeatherData>(),
  },
  async () => {
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
