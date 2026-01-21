
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { getLiveCropPrices, LiveMarketRecord } from '@/services/live-market';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Cable, RefreshCw } from 'lucide-react';

// List of commodities for the dropdown, focused on Tamil Nadu
const COMMODITIES = [
  'Paddy', 
  'Sugarcane', 
  'Cotton', 
  'Groundnut', 
  'Banana', 
  'Turmeric', 
  'Maize', 
  'Cumbu', // Pearl Millet
  'Ragi', // Finger Millet
  'Black Gram',
  'Green Gram',
  'Tomato', 
  'Onion', 
  'Coconut'
];


export default function LiveMarketContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();

  const [selectedCommodity, setSelectedCommodity] = useState<string>(COMMODITIES[0]);
  const [records, setRecords] = useState<LiveMarketRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrices = useCallback(async (commodity: string) => {
    setIsLoading(true);
    try {
      const data = await getLiveCropPrices(commodity);
      // Sort by date, most recent first
      const sortedData = data.sort((a, b) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime());
      setRecords(sortedData);
    } catch (error) {
      console.error('Failed to fetch live market data:', error);
      toast({
        variant: 'destructive',
        title: 'Error Fetching Data',
        description: 'Could not retrieve live market prices. Please try again later.',
      });
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPrices(selectedCommodity);
  }, [fetchPrices, selectedCommodity]);
  
  const handleRefresh = () => {
      fetchPrices(selectedCommodity);
  };

  return (
    <AppShell title={t.liveMarket} activePage="live-market">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cable className="h-6 w-6" />
              {t.liveMarket}
            </CardTitle>
            <CardDescription>{t.liveMarketDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="grid gap-2 w-full sm:w-auto">
                    <label htmlFor="commodity-select" className="text-sm font-medium">{t.selectCommodity}</label>
                    <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                        <SelectTrigger id="commodity-select" className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Select a crop" />
                        </SelectTrigger>
                        <SelectContent>
                            {COMMODITIES.map((commodity) => (
                                <SelectItem key={commodity} value={commodity}>
                                    {commodity}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <Button onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {t.refresh}
                </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Market Prices for {selectedCommodity}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.date}</TableHead>
                                <TableHead>{t.market}</TableHead>
                                <TableHead>{t.variety}</TableHead>
                                <TableHead className="text-right">{t.minPrice}</TableHead>
                                <TableHead className="text-right">{t.maxPrice}</TableHead>
                                <TableHead className="text-right">{t.modalPrice}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-5 w-[60px] ml-auto" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-5 w-[60px] ml-auto" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-5 w-[60px] ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : records.length > 0 ? (
                                records.map((r, index) => (
                                    <TableRow key={`${r.market}-${r.arrival_date}-${index}`}>
                                        <TableCell>{r.arrival_date || '-'}</TableCell>
                                        <TableCell>{r.market || '-'}</TableCell>
                                        <TableCell>{r.variety || '-'}</TableCell>
                                        <TableCell className="text-right">{r.min_price || '-'}</TableCell>
                                        <TableCell className="text-right">{r.max_price || '-'}</TableCell>
                                        <TableCell className="text-right">{r.modal_price || '-'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        {t.noDataFound}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                 <div className="mt-4 text-xs text-muted-foreground">
                    {t.dataSource} <a href="https://data.gov.in/" className="underline text-primary" target="_blank" rel="noopener noreferrer">data.gov.in (Agmarknet)</a>. Prices are per Quintal (100kg).
                </div>
            </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}

    