import React from 'react';
import { getWeatherForecast } from '@/services/weather';
import { getMarketTrends } from '@/services/market';
import { getGovSchemes } from '@/services/govSchemes';
import { getActivities } from '@/services/activity';
import { LanguageProvider } from '@/context/language-context';
import DashboardContent from './dashboard-content';


// This is a server component, so we can fetch data directly.
// We wrap the content in a client component to access the language context.
export default async function Dashboard() {
  const weatherData = await getWeatherForecast();
  const marketData = await getMarketTrends();
  const schemesData = await getGovSchemes();
  const activitiesData = await getActivities();

  const marketTrends = marketData.slice(0, 3);
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
