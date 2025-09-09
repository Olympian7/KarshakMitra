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
import React, { useEffect, useState } from 'react';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/context/language-context';

// A client component is needed to use the useLanguage hook.
export default function DashboardContent({ weather, marketTrends, govSchemes, recentActivities }: any) {
  const { language } = useLanguage();
  const t = translations[language];
  const [activityDate, setActivityDate] = useState('');

  useEffect(() => {
    if (recentActivities.length > 0) {
      setActivityDate(new Date(recentActivities[0].date).toLocaleDateString());
    }
  }, [recentActivities]);

  return (
    <AppShell title={t.dashboard} activePage="dashboard">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">{t.welcome}</h1>
        </div>
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
              {recentActivities.length > 0 ? (
                <div className="flex items-start gap-4">
                  <ClipboardList className="h-6 w-6 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{recentActivities[0].text}</p>
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
  );
}
