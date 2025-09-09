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

  const crops = profile?.mainCrops.split(',').map(crop => crop.trim()) || [];
  const plotColors = ['bg-green-200/50', 'bg-yellow-200/50', 'bg-orange-200/50', 'bg-blue-200/50', 'bg-indigo-200/50'];

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
              <CardContent>
                {isLoading ? (
                  <Skeleton className="w-full h-96" />
                ) : (
                  <div className="w-full p-4 border-2 border-dashed rounded-lg bg-muted/30 aspect-[4/3] flex flex-wrap gap-2">
                    {crops.map((crop, index) => (
                      <div 
                        key={index} 
                        className={`flex-grow basis-1/3 min-w-[120px] rounded-md border p-3 flex flex-col justify-center items-center text-center ${plotColors[index % plotColors.length]}`}
                      >
                         <Sprout className="h-6 w-6 mb-2 text-primary" />
                         <p className="font-semibold text-sm">{crop}</p>
                         <p className="text-xs text-muted-foreground">{t.plot} {index + 1}</p>
                      </div>
                    ))}
                    {crops.length === 0 && (
                        <div className="flex items-center justify-center w-full h-full">
                            <p className="text-muted-foreground">{t.noCropsInProfile}</p>
                        </div>
                    )}
                  </div>
                )}
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
