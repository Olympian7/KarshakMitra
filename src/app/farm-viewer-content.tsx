
'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { getProfile, FarmProfile, PlotType } from '@/services/profile';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Droplets, Sprout, Tractor, Package, Beaker } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


const plotTypes: PlotType[] = [
    { value: 0, color: 'bg-gradient-to-br from-gray-50 to-gray-200', label: { en: 'Empty', ml: 'ഒഴിഞ്ഞ' } },
    { value: 100, color: 'bg-gradient-to-br from-blue-300 to-blue-500', label: { en: 'Paddy', ml: 'നെല്ല്' } },
    { value: 90, color: 'bg-gradient-to-br from-yellow-200 to-yellow-400', label: { en: 'Lentils', ml: 'പയർവർഗ്ഗങ്ങൾ' } },
    { value: 80, color: 'bg-gradient-to-br from-amber-300 to-amber-500', label: { en: 'Bananas', ml: 'വാഴ' } },
    { value: 60, color: 'bg-gradient-to-br from-green-300 to-green-500', label: { en: 'Okra', ml: 'വെണ്ട' } },
    { value: 40, color: 'bg-gradient-to-br from-red-300 to-red-500', label: { en: 'Ginger / Turmeric', ml: 'ഇഞ്ചി / മഞ്ഞൾ' } },
];

const getColorForValue = (value: number) => {
    return plotTypes.find(item => item.value === value)?.color || 'bg-gray-200';
};


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
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left Column (Digital Twin) */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{t.digitalTwinTitle}</CardTitle>
                <CardDescription>{t.digitalTwinDesc}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-start gap-6">
                {isLoading || !profile ? (
                  <Skeleton className="w-full aspect-square max-w-lg" />
                ) : (
                  <div className="grid grid-cols-10 gap-1 w-full aspect-square max-w-lg border-2 border-dashed rounded-lg p-2 bg-muted/30">
                    {profile.farmGrid.flat().map((value, index) => (
                        <div key={index} className={cn(`aspect-square w-full h-full rounded-sm`, getColorForValue(value))} title={`Value: ${value}`} />
                    ))}
                  </div>
                )}
                <div className="w-full md:w-48">
                    <h3 className="font-semibold mb-2">Legend</h3>
                    <div className="space-y-2">
                        {plotTypes.map(item => (
                            <div key={item.value} className="flex items-center gap-2">
                                <div className={cn(`w-4 h-4 rounded-sm`, item.color)} />
                                <span className="text-sm">{item.label[language]}</span>
                            </div>
                        ))}
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column (Info Cards) */}
          <div className="lg:col-span-2 space-y-6">
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
            
             <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <Package className="h-6 w-6 text-muted-foreground" />
                <CardTitle>{t.currentCropStock}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : profile && profile.cropStock.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.crop}</TableHead>
                        <TableHead className="text-right">{t.quantity}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profile.cropStock.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity.toLocaleString()} {item.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground pt-2">{t.noStockData}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <Beaker className="h-6 w-6 text-muted-foreground" />
                <CardTitle>{t.farmInputs}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : profile && profile.farmInputs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.item}</TableHead>
                        <TableHead>{t.type}</TableHead>
                        <TableHead className="text-right">{t.quantity}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profile.farmInputs.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell className="text-right">{item.quantity.toLocaleString()} {item.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground pt-2">{t.noInputData}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
