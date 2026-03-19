
'use client';

import Link from 'next/link';
import { CloudSun, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { RequireAuth } from '@/components/require-auth';
import React, { useEffect, useState } from 'react';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/context/language-context';
import Image from 'next/image';
import imageData from '@/lib/placeholder-images.json';
import { getActivities } from '@/services/activity';
import { getWeatherForecast } from '@/services/weather';
import { getMarketTrends } from '@/services/market';
import { getGovSchemes } from '@/services/govSchemes';
import { useAuth } from '@/context/auth-context';

export default function DashboardContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const { user } = useAuth();
  const { dashboard_hero } = imageData;

  // Weather / market / schemes state
  const [weather, setWeather] = useState<any | null>(null);
  const [marketTrends, setMarketTrends] = useState<any[]>([]);
  const [govSchemes, setGovSchemes] = useState<any[]>([]);

  // Activity state
  const [activityDate, setActivityDate] = useState('');
  const [latestActivity, setLatestActivity] = useState<any | null>(null);

  // Fetch public/shared data (weather, market, schemes) — no auth needed
  useEffect(() => {
    getWeatherForecast()
      .then((data) => setWeather(data))
      .catch(() => setWeather(null));

    getMarketTrends().then((data) => {
      // Replicate the server-side top-3-crops logic on the client
      const freq = data.reduce((acc: Record<string, number>, t: any) => {
        acc[t.name] = (acc[t.name] || 0) + 1;
        return acc;
      }, {});
      const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
      const top3 = sorted.slice(0, 3).map((name) => data.find((d: any) => d.name === name)).filter(Boolean);
      setMarketTrends(top3);
    }).catch(() => setMarketTrends([]));

    getGovSchemes()
      .then((data) => setGovSchemes(data.slice(0, 2)))
      .catch(() => setGovSchemes([]));
  }, []);

  // Format activity date client-side to avoid hydration mismatch
  useEffect(() => {
    if (latestActivity?.date) {
      setActivityDate(new Date(latestActivity.date).toLocaleDateString());
    }
  }, [latestActivity]);

  // Fetch user-specific activities whenever the logged-in user changes
  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLatestActivity(null);
        return;
      }
      try {
        const acts = await getActivities();
        setLatestActivity(Array.isArray(acts) && acts.length > 0 ? acts[0] : null);
      } catch {
        setLatestActivity(null);
      }
    };
    load();
  }, [user]);

  return (
    <RequireAuth>
      <AppShell title={t.dashboard} activePage="dashboard">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Card className="relative overflow-hidden rounded-lg">
            <Image
              src={`https://picsum.photos/seed/${dashboard_hero.seed}/${dashboard_hero.width}/${dashboard_hero.height}`}
              alt="Kerala farm landscape"
              width={dashboard_hero.width}
              height={dashboard_hero.height}
              className="w-full h-48 object-cover"
              data-ai-hint={dashboard_hero.hint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <h1 className="text-2xl font-semibold text-white md:text-3xl">{t.welcome}</h1>
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
            <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>{t.todaysWeather}</CardTitle>
                <CloudSun className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {weather ? (
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

            <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
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
                    {marketTrends.map((crop: any) => (
                      <TableRow key={`${crop.name}-${crop.variety}`}>
                        <TableCell>{crop.name}</TableCell>
                        <TableCell className="text-right">₹{crop.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>{t.recentActivity}</CardTitle>
                <Link href="/tracking">
                  <Button variant="outline" size="sm">
                    {t.viewAll}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {latestActivity ? (
                  <div className="flex items-start gap-4">
                    <ClipboardList className="h-6 w-6 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">{latestActivity.text}</p>
                      {activityDate && <p className="text-sm text-muted-foreground">{activityDate}</p>}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t.noRecentActivities}</p>
                )}
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>{t.featuredGovernmentSchemes}</CardTitle>
                <Link href="/schemes">
                  <Button variant="outline" size="sm">
                    {t.viewAll}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="grid gap-4">
                {govSchemes.map((scheme: any) => (
                  <div key={scheme.id} className="border border-border/50 p-3 rounded-lg">
                    <h3 className="font-semibold">{scheme.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{scheme.description.slice(0, 100)}...</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </AppShell>
    </RequireAuth>
  );
}
