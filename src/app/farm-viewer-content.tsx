
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import AppShell from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { getProfile, saveProfile, FarmProfile, PlotType, CropStock } from '@/services/profile';
import { getMarketTrends, MarketTrend } from '@/services/market';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Droplets, Sprout, Tractor, Package, Beaker, Pencil, Trash2, PlusCircle, IndianRupee } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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


function EditStockDialog({ profile, onSave }: { profile: FarmProfile, onSave: (updatedProfile: FarmProfile) => void }) {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  const [localStock, setLocalStock] = useState<CropStock[]>(JSON.parse(JSON.stringify(profile.cropStock)));
  const [newCropName, setNewCropName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleQuantityChange = (cropName: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity, 10);
    if (isNaN(quantity) && newQuantity !== '') return; // Prevent non-numeric input

    setLocalStock(currentStock =>
      currentStock.map(item =>
        item.name === cropName ? { ...item, quantity: isNaN(quantity) ? 0 : quantity } : item
      )
    );
  };

  const handleAddCrop = () => {
    if (newCropName.trim() === '') {
        toast({ variant: 'destructive', title: 'Crop name cannot be empty.'});
        return;
    }
    if (localStock.some(item => item.name.toLowerCase() === newCropName.trim().toLowerCase())) {
        toast({ variant: 'destructive', title: 'This crop already exists in your stock.'});
        return;
    }
    
    const newCrop: CropStock = {
        name: newCropName.trim(),
        quantity: 0,
        unit: 'kg',
    };

    setLocalStock(current => [...current, newCrop]);
    setNewCropName(''); // Reset input
  };
  
  const handleRemoveCrop = (cropName: string) => {
    setLocalStock(current => current.filter(item => item.name !== cropName));
  };


  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
        const updatedProfile = { ...profile, cropStock: localStock };
        await saveProfile(updatedProfile);
        onSave(updatedProfile); // Update parent state
        toast({
            title: t.profileSavedTitle,
            description: "Your crop stock has been updated.",
        });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: t.profileSaveFailedTitle,
            description: 'Could not save your crop stock changes.',
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit Stock</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Crop Stock</DialogTitle>
          <DialogDescription>
            Add, remove, or update the quantities for your available crop stock.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          {localStock.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <Label htmlFor={`quantity-${item.name}`} className="flex-1 text-right">
                {item.name}
              </Label>
              <Input
                id={`quantity-${item.name}`}
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                className="w-24"
              />
              <Button variant="ghost" size="icon" onClick={() => handleRemoveCrop(item.name)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
           <div className="pt-4 border-t">
                <Label>Add New Crop</Label>
                <div className="flex items-center gap-2 mt-2">
                    <Input
                        placeholder="e.g., Tomato"
                        value={newCropName}
                        onChange={(e) => setNewCropName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCrop()}
                    />
                    <Button onClick={handleAddCrop} size="icon">
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
             <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function FarmViewerContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const profileData = await getProfile();
      const marketData = await getMarketTrends();
      setProfile(profileData);
      setMarketTrends(marketData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load farm and market data.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [toast]);

  const potentialIncome = useMemo(() => {
    if (!profile || marketTrends.length === 0) return 0;

    return profile.cropStock.reduce((total, stockItem) => {
      const marketPrice = marketTrends.find(
        trend => trend.name.toLowerCase() === stockItem.name.toLowerCase()
      )?.price;

      if (marketPrice) {
        return total + stockItem.quantity * marketPrice;
      }
      return total;
    }, 0);
  }, [profile, marketTrends]);

  const handleStockSave = (updatedProfile: FarmProfile) => {
    setProfile(updatedProfile);
  };


  return (
    <AppShell title={t.farmViewer} activePage="farm-viewer">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
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
                    <h3 className="font-semibold mb-2">{t.legend}</h3>
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
                          <TableCell>{t[item.type as keyof typeof t] || item.type}</TableCell>
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
          
          {/* Right Column */}
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
            
             <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <div className="flex items-center gap-4">
                    <Package className="h-6 w-6 text-muted-foreground" />
                    <CardTitle>{t.currentCropStock}</CardTitle>
                </div>
                {!isLoading && profile && <EditStockDialog profile={profile} onSave={handleStockSave} />}
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
                        <TableHead className="text-right">{t.quantityKg}</TableHead>
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
                    <IndianRupee className="h-6 w-6 text-muted-foreground" />
                    <CardTitle>{t.potentialIncome}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-10 w-1/2" />
                    ) : (
                        <div className="text-3xl font-bold">
                            ₹{potentialIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground pt-1">{t.potentialIncomeDesc}</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
