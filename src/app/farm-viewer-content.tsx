'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { getProfile, FarmProfile } from '@/services/profile';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Droplets, Sprout, Tractor } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data representing the heat map grid
const farmGridData = [
    // 10x10 grid for simplicity
    [10, 20, 30, 40, 50, 50, 40, 30, 20, 10],
    [20, 30, 40, 60, 70, 70, 60, 40, 30, 20],
    [30, 40, 60, 80, 90, 90, 80, 60, 40, 30],
    [40, 60, 80, 90, 100, 100, 90, 80, 60, 40],
    [50, 70, 90, 100, 100, 100, 100, 90, 70, 50],
    [50, 70, 90, 100, 100, 100, 100, 90, 70, 50],
    [40, 60, 80, 90, 100, 100, 90, 80, 60, 40],
    [30, 40, 60, 80, 90, 90, 80, 60, 40, 30],
    [20, 30, 40, 60, 70, 70, 60, 40, 30, 20],
    [10, 20, 30, 40, 50, 50, 40, 30, 20, 10],
];

const getColorForValue = (value: number) => {
    if (value >= 100) return 'bg-red-600/80';
    if (value >= 90) return 'bg-orange-500/80';
    if (value >= 80) return 'bg-yellow-400/80';
    if (value >= 60) return 'bg-yellow-300/80';
    if (value >= 40) return 'bg-green-500/80';
    if (value >= 20) return 'bg-green-600/80';
    return 'bg-blue-800/80';
};

const legendItems = [
    { value: '100', color: 'bg-red-600/80', label: { en: 'Paddy (High-Yield)', ml: 'നെല്ല് (ഉയർന്ന വിളവ്)' } },
    { value: '90', color: 'bg-orange-500/80', label: { en: 'Paddy (Mid-Yield)', ml: 'നെല്ല് (ഇടത്തരം വിളവ്)' } },
    { value: '80', color: 'bg-yellow-400/80', label: { en: 'Lentils', ml: 'പയർവർഗ്ഗങ്ങൾ' } },
    { value: '60', color: 'bg-yellow-300/80', label: { en: 'Bananas', ml: 'വാഴ' } },
    { value: '40', color: 'bg-green-500/80', label: { en: 'Okra', ml: 'വെണ്ട' } },
    { value: '20', color: 'bg-green-600/80', label: { en: 'Ginger / Turmeric', ml: 'ഇഞ്ചി / മഞ്ഞൾ' } },
    { value: '0', color: 'bg-blue-800/80', label: { en: 'Fallow Land', ml: 'തരിശുഭൂമി' } },
];


export default function FarmViewerContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load farm profile for the digital twin.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

  return (
    <AppShell title={t.farmViewer} activePage="farm-viewer">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t.digitalTwinTitle}</CardTitle>
                <CardDescription>{t.digitalTwinDesc}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-start gap-6">
                {isLoading ? (
                  <Skeleton className="w-full aspect-square max-w-md" />
                ) : (
                  <div className="grid grid-cols-10 gap-1 w-full aspect-square max-w-md border-2 border-dashed rounded-lg p-2 bg-muted/30">
                    {farmGridData.flat().map((value, index) => (
                        <div key={index} className={`aspect-square w-full h-full rounded-sm ${getColorForValue(value)}`} title={`Value: ${value}`} />
                    ))}
                  </div>
                )}
                <div className="w-full md:w-48">
                    <h3 className="font-semibold mb-2">Legend</h3>
                    <div className="space-y-2">
                        {legendItems.map(item => (
                            <div key={item.value} className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-sm ${item.color}`} />
                                <span className="text-sm">{item.label[language]}</span>
                            </div>
                        ))}
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.farmOverview}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-6 w-2/3" />
                    </div>
                 ) : profile ? (
                    <>
                        <div className="flex items-start gap-3">
                            <Tractor className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <h4 className="font-semibold">{profile.farmName}</h4>
                                <p className="text-sm text-muted-foreground">{profile.farmSize} {t.acres}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <h4 className="font-semibold">{t.location}</h4>
                                <p className="text-sm text-muted-foreground">{profile.location}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Droplets className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <h4 className="font-semibold">{t.soilType}</h4>
                                <p className="text-sm text-muted-foreground">{profile.soilType}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Sprout className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <h4 className="font-semibold">{t.mainCrops}</h4>
                                <p className="text-sm text-muted-foreground">{profile.mainCrops}</p>
                            </div>
                        </div>
                    </>
                 ) : (
                    <p>{t.couldNotLoadProfile}</p>
                 )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
