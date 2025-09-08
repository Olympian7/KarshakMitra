'use client';

import Link from 'next/link';
import {
  Bell,
  BotMessageSquare,
  ClipboardList,
  Home,
  Landmark,
  LineChart,
  User,
} from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function FarmProfileForm() {
    const [farmerName, setFarmerName] = React.useState('Narayanan');
    const [farmName, setFarmName] = React.useState('Narayanan Farms');
    const [location, setLocation] = React.useState('Kuttanad, Kerala');
    const [farmSize, setFarmSize] = React.useState('15');
    const [soilType, setSoilType] = React.useState('Alluvial Soil');
    const [mainCrops, setMainCrops] = React.useState('Rice, Coconut, Bananas');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would handle form submission here, e.g., save to a database.
        console.log({
            farmerName,
            farmName,
            location,
            farmSize,
            soilType,
            mainCrops
        });
        alert('Profile saved!');
    };

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle>Your Farm Profile</CardTitle>
        <CardDescription>
          Keep your farm's information up-to-date. This helps in providing you with tailored advice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="farmerName">Farmer Name</Label>
              <Input id="farmerName" value={farmerName} onChange={e => setFarmerName(e.target.value)} placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmName">Farm Name</Label>
              <Input id="farmName" value={farmName} onChange={e => setFarmName(e.target.value)} placeholder="Enter your farm's name" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Kuttanad, Kerala" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmSize">Farm Size (in acres)</Label>
              <Input id="farmSize" type="number" value={farmSize} onChange={e => setFarmSize(e.target.value)} placeholder="e.g., 15" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Input id="soilType" value={soilType} onChange={e => setSoilType(e.target.value)} placeholder="e.g., Alluvial Soil" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainCrops">Main Crops Grown</Label>
            <Textarea id="mainCrops" value={mainCrops} onChange={e => setMainCrops(e.target.value)} placeholder="List your primary crops, separated by commas" />
          </div>

          <Button type="submit">Save Profile</Button>
        </form>
      </CardContent>
    </Card>
  );
}


export default function ProfilePage() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-primary-foreground md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 4c-2.3 0-4.4.9-6 2.5-1.6 1.6-2.5 3.7-2.5 6 0 2.3.9 4.4 2.5 6 1.6 1.6 3.7 2.5 6 2.5s4.4-.9 6-2.5c1.6-1.6 2.5-3.7 2.5-6 0-2.3-.9-4.4-2.5-6C16.4 4.9 14.3 4 12 4z" />
                <path d="M12 12c-2.3 0-4.4-.9-6-2.5" />
                <path d="M12 12c2.3 0-4.4-.9 6-2.5" />
                <path d="M12 12v10" />
                <path d="M12 12c-2.3 0-4.4.9-6 2.5" />
                <path d="m12 12 6 2.5" />
                <path d="m6 9.5 6 2.5" />
              </svg>
              </div>
              <span className="">Karshak Mitra</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <User className="h-4 w-4" />
                Farm Profile
              </Link>
              <Link
                href="/assistant"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BotMessageSquare className="h-4 w-4" />
                Conversational Assistant
              </Link>
              <Link
                href="/tracking"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ClipboardList className="h-4 w-4" />
                Activity Tracking
              </Link>
              <Link
                href="/schemes"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Landmark className="h-4 w-4" />
                Government Schemes
              </Link>
              <Link
                href="/market"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Market Trends
              </Link>
            </nav>
          </div>
           <div className="mt-auto p-4">
              <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">N</AvatarFallback>
              </Avatar>
           </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">
              Farm Profile
            </h1>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <FarmProfileForm />
        </main>
      </div>
    </div>
  );
}
