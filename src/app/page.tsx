
import React from 'react';
import { getWeatherForecast } from '@/services/weather';
import { getMarketTrends } from '@/services/market';
import { getGovSchemes } from '@/services/govSchemes';
import { getActivities } from '@/services/activity';
import { LanguageProvider } from '@/context/language-context';
import DashboardContent from './dashboard-content';


// The dashboard is now the main landing page of the application.
export default async function Dashboard() {
  const weatherData = await getWeatherForecast();
  const marketData = await getMarketTrends();
  const schemesData = await getGovSchemes();
  const activitiesData = await getActivities();

  // For the dashboard, we find the 3 most common crops to show a snapshot
  const cropFrequency = marketData.reduce((acc, trend) => {
    acc[trend.name] = (acc[trend.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCrops = Object.keys(cropFrequency).sort((a, b) => cropFrequency[b] - cropFrequency[a]);
  const topCrops = new Set(sortedCrops.slice(0, 3));

  // Find the first market entry for each of the top crops
  const marketTrends = sortedCrops.slice(0,3).map(cropName => {
      return marketData.find(trend => trend.name === cropName);
  }).filter(Boolean);


  const govSchemes = schemesData.slice(0, 2);
  const recentActivities = activitiesData.slice(0, 1);

  return (
    <LanguageProvider>
      <DashboardContent
        weather={weatherData}
        marketTrends={marketTrends}
        govSchemes={govSchemes}
        recentActivities={recentActivities}
      />
    </LanguageProvider>
  );
}
