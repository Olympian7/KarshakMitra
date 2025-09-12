
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import AppShell from '@/components/app-shell';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState, useMemo } from 'react';
import { getMarketTrends, MarketTrend } from '@/services/market';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Skeleton } from '@/components/ui/skeleton';

export default function MarketContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      setIsLoading(true);
      const trends = await getMarketTrends();
      setMarketTrends(trends);
      setIsLoading(false);
    };
    fetchTrends();
  }, []);

  const categorizedTrends = useMemo(() => {
    return marketTrends.reduce((acc, trend) => {
      const category = trend.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(trend);
      return acc;
    }, {} as Record<string, MarketTrend[]>);
  }, [marketTrends]);

  return (
    <AppShell title={t.marketTrends} activePage="market">
      <main className="flex flex-1 flex-col">
        <div className="relative w-full h-48 bg-gradient-primary flex flex-col justify-end p-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">{t.latestCropPrices}</h1>
          <p className="text-white/90 max-w-2xl">{t.marketDescription}</p>
        </div>
        <div className="p-4 lg:p-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            {isLoading ? (
               Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                    <Skeleton className="h-6 w-1/4 mb-4" />
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.crop}</TableHead>
                                <TableHead>{t.variety}</TableHead>
                                <TableHead>{t.pricePerKg}</TableHead>
                                <TableHead className="text-right">{t.change}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 3 }).map((_, j) => (
                                <TableRow key={j}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
               ))
            ) : (
              Object.entries(categorizedTrends).map(([category, trends]) => (
                <div key={category}>
                  <h2 className="text-xl font-semibold mb-4">{t[category as keyof typeof t] || category}</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.crop}</TableHead>
                        <TableHead>{t.variety}</TableHead>
                        <TableHead>{t.pricePerKg}</TableHead>
                        <TableHead className="text-right">{t.change}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trends.map((crop) => (
                        <TableRow key={`${crop.name}-${crop.variety}`}>
                          <TableCell className="font-medium">{crop.name}</TableCell>
                          <TableCell>{crop.variety}</TableCell>
                          <TableCell>₹{crop.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={crop.changeDirection === 'up' ? 'default' : 'destructive'}
                              className={`flex items-center justify-end gap-1 w-20 ml-auto ${
                                crop.changeDirection === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {crop.changeDirection === 'up' ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )}
                              <span>{crop.change.toFixed(2)}%</span>
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
