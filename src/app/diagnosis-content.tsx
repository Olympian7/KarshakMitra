
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

type DiagnosisResult = {
  identification: {
    isPlant: boolean;
    commonName: string;
    latinName: string;
  };
  diagnosis: {
    isHealthy: boolean;
    diagnosis: string;
    recommendation: string;
  };
};

const mockDiagnosis: DiagnosisResult = {
  identification: {
    isPlant: true,
    commonName: 'Unknown Plant',
    latinName: 'N/A',
  },
  diagnosis: {
    isHealthy: false,
    diagnosis: `The leaves are showing brown, scorched-looking patches with some yellowing. This pattern is consistent with several issues, most likely Leaf Scorch, Fungal Diseases (like Anthracnose), or Bacterial Diseases.`,
    recommendation: `For a definitive diagnosis, more information is needed (plant type, recent weather). However, you can take these immediate steps:
1.  **Check Environmental Stress:** Ensure the plant is not under-watered, especially during high heat or wind.
2.  **Inspect for Pests:** Look closely for any signs of insects.
3.  **Improve Airflow:** Prune dense areas to improve air circulation and reduce humidity, which can discourage fungal growth.
It is highly recommended to consult a local arborist for an accurate diagnosis.`,
  },
};


function DiagnosisPageComponent() {
  const { language } = useLanguage();
  const t = translations[language];
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setResult(null); // Clear previous result
    }
  };

  const handleDiagnose = async () => {
    if (!imagePreview) return;
    setIsLoading(true);
    setResult(null);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResult(mockDiagnosis);
    setIsLoading(false);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t.uploadAndDescribe}</CardTitle>
            <CardDescription>{t.diagnosisDesc}</CardDescription>
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
                    <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">{t.commonName}:</span> {result.identification.commonName}
                    </p>
                    <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">{t.latinName}:</span> <em className="italic">{result.identification.latinName}</em>
                    </p>
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
