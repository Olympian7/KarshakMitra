
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
import { Store, ChevronsUpDown, UserCheck, ArrowUp, ArrowDown } from 'lucide-react';
import React, { useEffect, useState, useMemo, FC } from 'react';
import { getMarketTrends, MarketTrend } from '@/services/market';
import { getProfile, FarmProfile } from '@/services/profile';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Skeleton } from '@/components/ui/skeleton';

type SortConfig = {
  key: keyof MarketTrend | null;
  direction: 'ascending' | 'descending';
};

const CategoryTable: FC<{ trends: MarketTrend[], categoryName: string, showDistrict?: boolean }> = ({ trends, categoryName, showDistrict = true }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'ascending' });

  const handleSort = (key: keyof MarketTrend) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedTrends = useMemo(() => {
    let sortableItems = [...trends];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        
        if (typeof valA === 'number' && typeof valB === 'number') {
           return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
        }

        return 0;
      });
    }
    return sortableItems;
  }, [trends, sortConfig]);

  const SortableHeader = ({ columnKey, label }: { columnKey: keyof MarketTrend, label: string }) => {
    const isSorting = sortConfig.key === columnKey;
    return (
        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort(columnKey)}>
            <div className="flex items-center gap-2">
                {label}
                {isSorting ? (
                    sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                ) : (
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                )}
            </div>
        </TableHead>
    );
  };

  if (trends.length === 0) return null;

  return (
    <div>
      {categoryName && <h2 className="text-xl font-semibold mb-4">{categoryName}</h2>}
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader columnKey="name" label={t.crop} />
            <SortableHeader columnKey="variety" label={t.variety} />
            {showDistrict && <SortableHeader columnKey="district" label="District" />}
            <SortableHeader columnKey="market" label="Market" />
            <SortableHeader columnKey="price" label={t.pricePerKg} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTrends.map((crop, index) => (
            <TableRow key={`${crop.name}-${crop.variety}-${crop.market}-${index}`}>
              <TableCell className="font-medium">{crop.name}</TableCell>
              <TableCell>{crop.variety}</TableCell>
              {showDistrict && <TableCell>{crop.district}</TableCell>}
              <TableCell>{crop.market}</TableCell>
              <TableCell>₹{crop.price.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
    if (!profile) {
      return { yourCropTrends: [], otherTrends: marketTrends };
    }

    const yourCropNames = new Set(profile.cropStock.map(c => c.name.toLowerCase()));
    
    const yourTrends: MarketTrend[] = [];
    const others: MarketTrend[] = [];

    marketTrends.forEach(trend => {
      if (yourCropNames.has(trend.name.toLowerCase())) {
        yourTrends.push(trend);
      } else {
        others.push(trend);
      }
    });

    return { yourCropTrends: yourTrends, otherTrends: others };

  }, [marketTrends, profile]);
  
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
                <div key={i}>
                    <Skeleton className="h-6 w-1/4 mb-4" />
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.crop}</TableHead>
                                <TableHead>{t.variety}</TableHead>
                                <TableHead>District</TableHead>
                                <TableHead>Market</TableHead>
                                <TableHead>{t.pricePerKg}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 3 }).map((_, j) => (
                                <TableRow key={j}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                     <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
               ))
            ) : (
              <>
                {yourCropTrends.length > 0 && (
                  <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                     <div className="flex items-center gap-3 mb-4">
                        <UserCheck className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-semibold text-primary">{t.yourCropPrices}</h2>
                     </div>
                     <CategoryTable trends={yourCropTrends} categoryName="" showDistrict={true} />
                  </div>
                )}
                {otherTrends.length > 0 && (
                    <CategoryTable
                        trends={otherTrends}
                        categoryName="Other Market Prices"
                    />
                )}
              </>
            )}
          </CardContent>
        </Card>
        </div>
      </main>
    </AppShell>
  );
}
