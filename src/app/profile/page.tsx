'use client';

import React from 'react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useToast } from '@/components/ui/use-toast';
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
import { BarChart } from 'lucide-react';

const chartData = [
  { name: 'Rice', value: 45 },
  { name: 'Coconut', value: 30 },
  { name: 'Banana', value: 15 },
  { name: 'Other', value: 10 },
];

function FarmProfileForm() {
    const [profile, setProfile] = React.useState<FarmProfile | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        const fetchProfile = async () => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setIsLoading(true);
        try {
            await saveProfile(profile);
            toast({
                title: "Profile Saved!",
                description: "Your farm profile has been updated successfully.",
            });
        } catch (error) {
             toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "Could not save your profile changes.",
            });
        } finally {
            setIsLoading(false);
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
                <Card>
                     <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }
    
    if (!profile) {
        return <p>Could not load profile.</p>
    }

  return (
    <div className="grid md:grid-cols-3 gap-6 items-start">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Farm Profile</CardTitle>
            <CardDescription>
              Keep your farm's information up-to-date for tailored advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="farmerName">Farmer Name</Label>
                  <Input id="farmerName" value={profile.farmerName} onChange={handleChange} placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmName">Farm Name</Label>
                  <Input id="farmName" value={profile.farmName} onChange={handleChange} placeholder="Enter your farm's name" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={profile.location} onChange={handleChange} placeholder="e.g., Kuttanad, Kerala" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size (in acres)</Label>
                  <Input id="farmSize" type="number" value={profile.farmSize} onChange={handleChange} placeholder="e.g., 15" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Input id="soilType" value={profile.soilType} onChange={handleChange} placeholder="e.g., Alluvial Soil" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mainCrops">Main Crops Grown</Label>
                <Textarea id="mainCrops" value={profile.mainCrops} onChange={handleChange} placeholder="List your primary crops, separated by commas" />
              </div>

              <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Profile'}</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Crop Distribution</CardTitle>
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
                <p className="text-xs text-muted-foreground mt-2">A visual breakdown of your main crops by acre.</p>
            </CardContent>
        </Card>
    </div>
  );
}


export default function ProfilePage() {
  return (
    <AppShell title="Farm Profile" activePage="profile">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <FarmProfileForm />
        </main>
    </AppShell>
  );
}
