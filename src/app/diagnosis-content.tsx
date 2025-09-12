
'use client';

import React, { useState } from 'react';
import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Upload, Stethoscope, Leaf, Sparkles, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { diagnosePlant, DiagnosePlantOutput } from '@/ai/flows/diagnose-plant-flow';
import { useToast } from '@/components/ui/use-toast';
import imageData from '@/lib/placeholder-images.json';


// Utility to convert file to data URI
const toDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });


function DiagnosisPageComponent() {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosePlantOutput | null>(null);
  const { diagnosis_banner } = imageData;
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null); // Clear previous result
    }
  };

  const handleDiagnose = async () => {
    if (!imageFile || !description) {
         toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please upload a photo and provide a description of the symptoms.',
        });
        return;
    }
    setIsLoading(true);
    setResult(null);
    
    try {
        const photoDataUri = await toDataUri(imageFile);
        const diagnosisResult = await diagnosePlant({ photoDataUri, description });
        setResult(diagnosisResult);
    } catch (error) {
        console.error('Error diagnosing plant:', error);
        toast({
            variant: 'destructive',
            title: 'Diagnosis Failed',
            description: 'The AI model could not complete the diagnosis. Please try again.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col">
       <div className="relative w-full h-48">
          <Image
            src={`https://picsum.photos/seed/${diagnosis_banner.seed}/${diagnosis_banner.width}/${diagnosis_banner.height}`}
            alt="Close-up of a plant leaf"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
            data-ai-hint={diagnosis_banner.hint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">{t.uploadAndDescribe}</h1>
            <p className="text-white/90 max-w-2xl">{t.diagnosisDesc}</p>
          </div>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4 lg:p-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t.uploadAndDescribe}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="plant-photo" className="block text-sm font-medium text-muted-foreground">{t.plantPhoto}</label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="plant-photo" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Plant preview" width={192} height={192} className="h-full w-auto object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground text-center">{t.clickToUpload}</p>
                    </div>
                  )}
                  <Input id="plant-photo" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">{t.symptomsDescription}</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.symptomsPlaceholder}
                rows={4}
              />
            </div>

            <Button onClick={handleDiagnose} disabled={!imagePreview || isLoading} className="w-full">
              {isLoading ? t.diagnosing : t.diagnosePlant}
              <Stethoscope className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.diagnosisResult}</CardTitle>
            <CardDescription>{t.aiAnalysis}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
                 <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6" />
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6">
                 <div>
                    <h3 className="font-semibold flex items-center mb-2">
                        <Leaf className="mr-2 h-5 w-5 text-primary" />
                        {t.plantIdentification}
                    </h3>
                     {!result.identification.isPlant ? (
                        <p className="text-muted-foreground">{t.notAPlant}</p>
                    ) : (
                        <>
                        <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">{t.commonName}:</span> {result.identification.commonName}
                        </p>
                        <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">{t.latinName}:</span> <em className="italic">{result.identification.latinName}</em>
                        </p>
                        </>
                    )}
                </div>

                <div>
                    <h3 className="font-semibold flex items-center mb-2">
                       <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                       {t.healthDiagnosis}
                    </h3>
                    <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">{t.assessment}:</span> 
                        <span className={result.diagnosis.isHealthy ? 'text-green-600' : 'text-red-600'}>
                            {result.diagnosis.isHealthy ? t.healthy : t.unhealthy}
                        </span>
                    </p>
                    <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">{t.suspectedIssue}:</span> {result.diagnosis.diagnosis}
                    </p>
                </div>
                
                <div>
                    <h3 className="font-semibold flex items-center mb-2">
                        <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                        {t.recommendation}
                    </h3>
                    <p className="text-muted-foreground bg-primary/5 p-3 rounded-md border border-primary/20 whitespace-pre-line">
                        {result.diagnosis.recommendation}
                    </p>
                </div>
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 border-2 border-dashed rounded-lg">
                    <Stethoscope className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">{t.uploadForDiagnosis}</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


export default function DiagnosisContent() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <AppShell title={t.diagnosis} activePage="diagnosis">
        <DiagnosisPageComponent />
    </AppShell>
  );
}
