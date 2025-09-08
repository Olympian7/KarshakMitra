'use client';

import React from 'react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { toast } from '@/components/ui/use-toast';
import { getProfile, saveProfile, FarmProfile } from '@/services/profile';
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
import { BarChart, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';

const chartData = [
  { name: 'Rice', value: 45 },
  { name: 'Coconut', value: 30 },
  { name: 'Banana', value: 15 },
  { name: 'Other', value: 10 },
];

function FarmProfileForm() {
    const { language } = useLanguage();
    const t = translations[language];

    const [profile, setProfile] = React.useState<FarmProfile | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
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
    }, []);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!profile) return;
        const { id, value } = e.target;
        setProfile({ ...profile, [id]: value });
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
    <div className="grid md:grid-cols-3 gap-6 items-start">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t.yourFarmProfile}</CardTitle>
            <CardDescription>{t.farmProfileDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Input id="location" value={profile.location} onChange={handleChange} placeholder="e.g., Kuttanad, Kerala" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmSize">{t.farmSize}</Label>
                  <Input id="farmSize" type="number" value={profile.farmSize} onChange={handleChange} placeholder="e.g., 15" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="soilType">{t.soilType}</Label>
                  <Input id="soilType" value={profile.soilType} onChange={handleChange} placeholder="e.g., Alluvial Soil" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mainCrops">{t.mainCrops}</Label>
                <Textarea id="mainCrops" value={profile.mainCrops} onChange={handleChange} placeholder={t.mainCropsPlaceholder} />
              </div>

              <Button type="submit" disabled={isSaving}>{isSaving ? t.saving : t.saveProfile}</Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>{t.cropDistribution}</CardTitle>
                    <BarChart className="h-5 w-5 text-accent" />
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
                    <Lightbulb className="h-5 w-5 text-accent" />
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground">
                        {t.aiInsightText1} <span className="font-semibold text-foreground">{profile.location}</span> {t.aiInsightText2} <span className="font-semibold text-foreground">{profile.soilType}</span> {t.aiInsightText3}
                   </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}


export default function ProfilePage() {
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
