
'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import AppShell from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { getProfile, saveProfile, FarmProfile, PlotType, CropStock } from '@/services/profile';
import { getLiveCropPrices } from '@/services/live-market';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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

const parseDate = (dateString: string) => {
    if (!dateString) return new Date(0);
    const parts = dateString.split('/');
    if (parts.length === 3) {
        // parts are [DD, MM, YYYY] from the API
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    // Fallback for other formats, e.g. YYYY/MM/DD from mock data
    return new Date(dateString);
};


export default function FarmViewerContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const profileData = await getProfile();
      setProfile(profileData);

      if (profileData && profileData.cropStock.length > 0) {
        const pricePromises = profileData.cropStock.map(async (stockItem) => {
          const prices = await getLiveCropPrices(stockItem.name);
          // Find the most recent record with a valid modal price
          const latestRecord = prices
            .filter(p => p.modal_price && parseFloat(p.modal_price) > 0)
            .sort((a, b) => parseDate(b.arrival_date).getTime() - parseDate(a.arrival_date).getTime())[0];
          
          if (latestRecord) {
            // Price is per quintal (100kg), convert to per kg
            const pricePerKg = parseFloat(latestRecord.modal_price) / 100;
            return { [stockItem.name]: pricePerKg };
          }
          return { [stockItem.name]: 0 }; // Default to 0 if no price found
        });
        
        const priceResults = await Promise.all(pricePromises);
        const pricesMap = priceResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setLivePrices(pricesMap);
      }
    } catch (error) {
      console.error("Error loading farm data:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load farm and live market data.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const incomeBreakdown = useMemo(() => {
    if (!profile || Object.keys(livePrices).length === 0) return { breakdown: [], total: 0 };

    const breakdown = profile.cropStock.map(stockItem => {
        const price = livePrices[stockItem.name] || 0;
        const subtotal = stockItem.quantity * price;
        return {
            name: stockItem.name,
            quantity: stockItem.quantity,
            price: price,
            subtotal: subtotal
        };
    });

    const total = breakdown.reduce((acc, item) => acc + item.subtotal, 0);

    return { breakdown, total };
  }, [profile, livePrices]);

  const handleStockSave = (updatedProfile: FarmProfile) => {
    setProfile(updatedProfile);
    // Refetch prices in case new crops were added
    fetchData();
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
                        <div key={index} className={cn(`aspect-square w-full h-full rounded-sm`)} style={{ backgroundColor: profile.plotTypes.find(p => p.value === value)?.color || 'hsl(0, 0%, 85%)' }} title={`Value: ${value}`} />
                    ))}
                  </div>
                )}
                <div className="w-full md:w-48">
                    <h3 className="font-semibold mb-2">{t.legend}</h3>
                    <div className="space-y-2">
                        {profile?.plotTypes.map(item => (
                            <div key={item.value} className="flex items-center gap-2">
                                <div className={cn(`w-4 h-4 rounded-sm`)} style={{ backgroundColor: item.color }} />
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
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="border-b-0">
                        <AccordionTrigger className="p-6">
                            <div className="flex items-center gap-4 space-y-0">
                                <IndianRupee className="h-6 w-6 text-muted-foreground" />
                                <div className="text-left">
                                    <h3 className="text-base font-semibold leading-none tracking-tight">{t.potentialIncome}</h3>
                                    {isLoading ? (
                                        <Skeleton className="h-8 w-32 mt-2" />
                                    ) : (
                                        <div className="text-3xl font-bold">
                                            ₹{incomeBreakdown.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <p className="text-xs text-muted-foreground pb-4">{t.potentialIncomeDesc}</p>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t.crop}</TableHead>
                                        <TableHead className="text-center">{t.quantityKg}</TableHead>
                                        <TableHead className="text-center">{t.pricePerKg}</TableHead>
                                        <TableHead className="text-right">{t.subtotal}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {incomeBreakdown.breakdown.map((item) => (
                                        <TableRow key={item.name}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-center">{item.quantity.toLocaleString()}</TableCell>
                                            <TableCell className="text-center">₹{item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">₹{item.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
