
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import { getProfile, saveProfile, FarmProfile, PlotType } from '@/services/profile';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppShell from '@/components/app-shell';
import { BarChart, Lightbulb, Lock, Pencil } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

const chartData = [
  { name: 'Rice', value: 45 },
  { name: 'Coconut', value: 30 },
  { name: 'Banana', value: 15 },
  { name: 'Other', value: 10 },
];

const plotTypes: PlotType[] = [
    { value: 0, color: 'bg-gray-200', label: { en: 'Empty', ml: 'ഒഴിഞ്ഞ' } },
    { value: 100, color: 'bg-blue-400', label: { en: 'Paddy', ml: 'നെല്ല്' } },
    { value: 90, color: 'bg-yellow-400', label: { en: 'Lentils', ml: 'പയർവർഗ്ഗങ്ങൾ' } },
    { value: 80, color: 'bg-yellow-600', label: { en: 'Bananas', ml: 'വാഴ' } },
    { value: 60, color: 'bg-green-500', label: { en: 'Okra', ml: 'വെണ്ട' } },
    { value: 40, color: 'bg-red-500', label: { en: 'Ginger / Turmeric', ml: 'ഇഞ്ചി / മഞ്ഞൾ' } },
];

const getColorForValue = (value: number) => {
    return plotTypes.find(p => p.value === value)?.color || 'bg-gray-200';
}

function FarmProfileForm() {
    const { language } = useLanguage();
    const t = translations[language];
    const { toast } = useToast();
    const [profile, setProfile] = React.useState<FarmProfile | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isLayoutLocked, setIsLayoutLocked] = React.useState(true);

    const [selectedPlot, setSelectedPlot] = useState<number | null>(100);
    const [isPainting, setIsPainting] = useState(false);

    const paddyPercentage = useMemo(() => {
        if (!profile) return 0;
        const totalCells = profile.farmGrid.length * profile.farmGrid[0].length;
        if (totalCells === 0) return 0;
        const paddyCells = profile.farmGrid.flat().filter(cell => cell === 100).length;
        return ((paddyCells / totalCells) * 100).toFixed(0);
    }, [profile]);


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
                    description: 'Failed to load farm profile.',
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [toast]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!profile) return;
        const { id, value } = e.target;
        setProfile({ ...profile, [id]: value });
    };

    const handleGridCellChange = (rowIndex: number, colIndex: number) => {
        if (!profile || selectedPlot === null || isLayoutLocked) return;
        const newGrid = profile.farmGrid.map((row, rIdx) => 
            row.map((cell, cIdx) => {
                if (rIdx === rowIndex && cIdx === colIndex) {
                    return selectedPlot;
                }
                return cell;
            })
        );
        setProfile({ ...profile, farmGrid: newGrid });
    };

    const handleMouseDown = (rowIndex: number, colIndex: number) => {
        if (isLayoutLocked) return;
        setIsPainting(true);
        handleGridCellChange(rowIndex, colIndex);
    };

    const handleMouseOver = (rowIndex: number, colIndex: number) => {
        if (isPainting && !isLayoutLocked) {
            handleGridCellChange(rowIndex, colIndex);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setIsSaving(true);
        try {
            await saveProfile(profile);
            toast({
                title: t.profileSavedTitle,
                description: t.profileSavedDesc,
            });
            setIsLayoutLocked(true); // Lock the layout after saving
        } catch (error) {
             toast({
                variant: 'destructive',
                title: t.profileSaveFailedTitle,
                description: t.profileSaveFailedDesc,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isLayoutLocked) {
            e.preventDefault(); // Prevent form submission
            setIsLayoutLocked(false);
        }
        // If not locked, the default form submission will occur via handleSubmit
    };

    
    if (isLoading && !profile) {
        return (
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                        </div>
                         <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-20 w-full" /></div>
                        <Skeleton className="h-10 w-24" />
                    </CardContent>
                </Card>
                <div className="space-y-6">
                  <Card>
                      <CardHeader>
                          <Skeleton className="h-8 w-3/4" />
                      </CardHeader>
                      <CardContent>
                          <Skeleton className="h-48 w-full" />
                      </CardContent>
                  </Card>
                   <Card>
                      <CardHeader>
                          <Skeleton className="h-8 w-3/4" />
                      </CardHeader>
                      <CardContent>
                          <Skeleton className="h-20 w-full" />
                      </CardContent>
                  </Card>
                </div>
            </div>
        )
    }
    
    if (!profile) {
        return <p>{t.couldNotLoadProfile}</p>
    }

  return (
    <div className="grid md:grid-cols-3 gap-6 items-start" onMouseUp={() => setIsPainting(false)}>
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>{t.yourFarmProfile}</CardTitle>
                <CardDescription>{t.farmProfileDesc}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                <fieldset disabled={isLayoutLocked} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <Label htmlFor="farmerName">{t.farmerName}</Label>
                    <Input id="farmerName" value={profile.farmerName} onChange={handleChange} placeholder={t.enterYourName} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="farmName">{t.farmName}</Label>
                    <Input id="farmName" value={profile.farmName} onChange={handleChange} placeholder={t.enterFarmName} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="location">{t.location}</Label>
                    <Input id="location" value={profile.location} placeholder="e.g., Kuttanad, Kerala" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="farmSize">{t.farmSize}</Label>
                    <Input id="farmSize" type="number" value={profile.farmSize} onChange={handleChange} placeholder="e.g., 15" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="soilType">{t.soilType}</Label>
                    <Input id="soilType" value={profile.soilType} onChange={handleChange} placeholder="e.g., Alluvial Soil" />
                    </div>
                </fieldset>

                <fieldset disabled={isLayoutLocked} className="space-y-2">
                    <Label htmlFor="mainCrops">{t.mainCrops}</Label>
                    <Textarea id="mainCrops" value={profile.mainCrops} onChange={handleChange} placeholder={t.mainCropsPlaceholder} />
                </fieldset>
                </div>
            </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>{t.farmLayoutEditor}</CardTitle>
                    <CardDescription>
                        {isLayoutLocked 
                            ? t.farmLayoutLockedDesc
                            : t.farmLayoutUnlockedDesc
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="space-y-2 md:w-48">
                            <Label>{t.cropPalette}</Label>
                            <fieldset disabled={isLayoutLocked} className="space-y-2">
                                {plotTypes.map(plot => (
                                    <div 
                                        key={plot.value}
                                        onClick={() => !isLayoutLocked && setSelectedPlot(plot.value)}
                                        className={cn(
                                            'w-full flex items-center gap-2 p-2 rounded-md border',
                                            !isLayoutLocked && 'cursor-pointer',
                                            selectedPlot === plot.value && !isLayoutLocked ? 'ring-2 ring-primary' : 'hover:bg-muted/50',
                                            isLayoutLocked && 'opacity-50 cursor-not-allowed'
                                        )}
                                    >
                                        <div className={cn('w-4 h-4 rounded-sm flex-shrink-0', plot.color)} />
                                        <span className="text-sm">{plot.label[language]}</span>
                                    </div>
                                ))}
                            </fieldset>
                        </div>
                        <div className="flex-1">
                            <Label>{t.yourFarmGrid}</Label>
                            <div 
                                className={cn(
                                    "grid grid-cols-10 gap-1 w-full aspect-square max-w-md border-2 border-dashed rounded-lg p-2 bg-muted/30",
                                    !isLayoutLocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
                                )}
                                onMouseLeave={() => setIsPainting(false)}
                            >
                                {profile.farmGrid.map((row, rowIndex) => 
                                    row.map((cellValue, colIndex) => (
                                        <div 
                                            key={`${rowIndex}-${colIndex}`}
                                            className={cn('aspect-square w-full h-full rounded-sm', getColorForValue(cellValue))}
                                            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                            onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
             </Card>
             <Button type={isLayoutLocked ? "button" : "submit"} onClick={handleButtonClick} disabled={isSaving}>
                {isLayoutLocked ? (
                    <>
                        <Pencil className="mr-2 h-4 w-4" /> {t.editProfile}
                    </>
                ) : (
                    isSaving ? t.saving : t.saveProfile
                )}
            </Button>
        </form>
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>{t.cropDistribution}</CardTitle>
                    <BarChart className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={chartData}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>{t.aiPoweredInsight}</CardTitle>
                    <Lightbulb className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground">
                        {t.aiInsightText1(paddyPercentage)}{' '}
                        <span className="font-semibold text-foreground">{profile.location}</span>{' '}
                        {t.aiInsightText2}{' '}
                        <span className="font-semibold text-foreground">{profile.soilType}</span>
                        {t.aiInsightText3}
                   </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}


export default function ProfileContent() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <AppShell title={t.farmProfile} activePage="profile">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <FarmProfileForm />
        </main>
    </AppShell>
  );
}
