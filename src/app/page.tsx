'use client';

import Link from 'next/link';
import { CloudSun, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AppShell from '@/components/app-shell';
import React, { useEffect, useState } from 'react';
import { getWeatherForecast, WeatherData } from '@/services/weather';
import { getMarketTrends, MarketTrend } from '@/services/market';
import { getGovSchemes, GovScheme } from '@/services/govSchemes';
import { getActivities, Activity } from '@/services/activity';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { language } = useLanguage();
  const t = translations[language];

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [govSchemes, setGovSchemes] = useState<GovScheme[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          weatherData,
          marketData,
          schemesData,
          activitiesData,
        ] = await Promise.all([
          getWeatherForecast(),
          getMarketTrends(),
          getGovSchemes(),
          getActivities(),
        ]);
        setWeather(weatherData);
        setMarketTrends(marketData.slice(0, 3));
        setGovSchemes(schemesData.slice(0, 2));
        setRecentActivities(activitiesData.slice(0, 1));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AppShell title={t.dashboard} activePage="dashboard">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">{t.welcome}</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{t.todaysWeather}</CardTitle>
              <CloudSun className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ) : weather ? (
                <>
                  <div className="text-4xl font-bold">{weather.temperature}°C</div>
                  <p className="text-sm text-muted-foreground">
                    {weather.condition}
                  </p>
                  <p className="text-sm">{t.humidity}: {weather.humidity}%</p>
                  <p className="text-sm">{t.windSpeed}: {weather.windSpeed} km/h</p>
                </>
              ) : <p>{t.weatherUnavailable}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{t.marketSnapshot}</CardTitle>
              <Link href="/market">
                <Button variant="outline" size="sm">
                  {t.viewAll}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.crop}</TableHead>
                    <TableHead className="text-right">{t.pricePerKg}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    marketTrends.map((crop) => (
                      <TableRow key={`${crop.name}-${crop.variety}`}>
                        <TableCell>{crop.name}</TableCell>
                        <TableCell className="text-right">₹{crop.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{t.recentActivity}</CardTitle>
              <Link href="/tracking">
                <Button variant="outline" size="sm">
                  {t.viewAll}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                   <Skeleton className="h-4 w-1/3" />
                </div>
              ) : recentActivities.length > 0 ? (
                <div className="flex items-start gap-4">
                  <ClipboardList className="h-6 w-6 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{recentActivities[0].text}</p>
                    <p className="text-sm text-muted-foreground">{new Date(recentActivities[0].date).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t.noRecentActivities}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{t.featuredGovernmentSchemes}</CardTitle>
              <Link href="/schemes">
                <Button variant="outline" size="sm">
                  {t.viewAll}
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="grid gap-4">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="border border-border/50 p-3 rounded-lg space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : (
                govSchemes.map((scheme) => (
                  <div key={scheme.id} className="border border-border/50 p-3 rounded-lg">
                    <h3 className="font-semibold">{scheme.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{scheme.description.slice(0, 100)}...</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}
