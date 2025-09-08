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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AppShell from '@/components/app-shell';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react';
import { getMarketTrends, MarketTrend } from '@/services/market';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Skeleton } from '@/components/ui/skeleton';

// This page remains a client component because it uses the useLanguage hook for translations.
// Data is fetched on the client side.
export default function MarketPage() {
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

  return (
    <AppShell title={t.marketTrends} activePage="market">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.latestCropPrices}</CardTitle>
            <CardDescription>{t.marketDescription}</CardDescription>
          </CardHeader>
          <CardContent>
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
                {isLoading ? (
                  Array.from({ length: 7 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  marketTrends.map((crop) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
