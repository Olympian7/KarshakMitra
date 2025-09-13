
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import AppShell from '@/components/app-shell';
import { Store, UserCheck, IndianRupee } from 'lucide-react';
import React, { useEffect, useState, useMemo, FC } from 'react';
import { getMarketTrends, MarketTrend } from '@/services/market';
import { getProfile, FarmProfile } from '@/services/profile';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Skeleton } from '@/components/ui/skeleton';

const CropMarketTable: FC<{ trends: MarketTrend[] }> = ({ trends }) => {
  const { language } = useLanguage();
  const t = translations[language];

  if (trends.length === 0) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.variety}</TableHead>
          <TableHead>District</TableHead>
          <TableHead>Market</TableHead>
          <TableHead className="text-right">{t.pricePerKg}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trends.map((crop, index) => (
          <TableRow key={`${crop.name}-${crop.variety}-${crop.market}-${index}`}>
            <TableCell>{crop.variety}</TableCell>
            <TableCell>{crop.district}</TableCell>
            <TableCell>{crop.market}</TableCell>
            <TableCell className="text-right">₹{crop.price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function MarketContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const trends = await getMarketTrends();
      const profileData = await getProfile();
      setMarketTrends(trends);
      setProfile(profileData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const { yourCropTrends, otherTrends } = useMemo(() => {
    const trendsByCrop: { [key: string]: MarketTrend[] } = marketTrends.reduce((acc, trend) => {
        if (!acc[trend.name]) {
            acc[trend.name] = [];
        }
        acc[trend.name].push(trend);
        return acc;
    }, {} as { [key: string]: MarketTrend[] });

    if (!profile) {
      return { yourCropTrends: {}, otherTrends: trendsByCrop };
    }

    const yourCropNames = new Set(profile.cropStock.map(c => c.name.toLowerCase()));
    
    const yourTrends: { [key: string]: MarketTrend[] } = {};
    const others: { [key: string]: MarketTrend[] } = {};

    Object.entries(trendsByCrop).forEach(([cropName, trends]) => {
      if (yourCropNames.has(cropName.toLowerCase())) {
        yourTrends[cropName] = trends;
      } else {
        others[cropName] = trends;
      }
    });

    return { yourCropTrends: yourTrends, otherTrends: others };

  }, [marketTrends, profile]);

  const getPriceRange = (trends: MarketTrend[]) => {
      if (trends.length === 0) return '';
      const prices = trends.map(t => t.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min === max) return `₹${min.toFixed(2)}`;
      return `₹${min.toFixed(2)} - ₹${max.toFixed(2)}`;
  }
  
  return (
    <AppShell title={t.marketTrends} activePage="market">
      <main className="flex flex-1 flex-col">
        <div className="relative w-full h-48 bg-gradient-primary flex flex-col justify-end p-6">
            <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                    <Store className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{t.latestCropPrices}</h1>
                    <p className="text-white/90 max-w-2xl">{t.marketDescription}</p>
                </div>
            </div>
        </div>
        <div className="p-4 lg:p-6">
        <Card>
          <CardContent className="space-y-8 pt-6">
            {isLoading ? (
               Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-6 w-1/4 mb-4" />
                    <div className="border rounded-md p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                </div>
               ))
            ) : (
              <>
                {Object.keys(yourCropTrends).length > 0 && (
                  <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                     <div className="flex items-center gap-3 mb-4">
                        <UserCheck className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-semibold text-primary">{t.yourCropPrices}</h2>
                     </div>
                     <Accordion type="single" collapsible className="w-full">
                        {Object.entries(yourCropTrends).map(([cropName, trends]) => (
                             <AccordionItem value={cropName} key={cropName}>
                                <AccordionTrigger>
                                    <div className="flex justify-between w-full pr-2">
                                        <span className="font-semibold">{cropName}</span>
                                        <span className="text-muted-foreground">{getPriceRange(trends)}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CropMarketTable trends={trends} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                     </Accordion>
                  </div>
                )}
                
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <IndianRupee className="h-6 w-6 text-muted-foreground" />
                        <h2 className="text-xl font-semibold">Other Market Prices</h2>
                    </div>
                    {Object.keys(otherTrends).length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                            {Object.entries(otherTrends).map(([cropName, trends]) => (
                                <AccordionItem value={cropName} key={cropName}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between w-full pr-2">
                                            <span className="font-semibold">{cropName}</span>
                                            <span className="text-muted-foreground">{getPriceRange(trends)}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <CropMarketTable trends={trends} />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <p className="text-sm text-muted-foreground">No other market data available.</p>
                    )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        </div>
      </main>
    </AppShell>
  );
}
