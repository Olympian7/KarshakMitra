'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import AppShell from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState, useMemo } from 'react';
import { getGovSchemes, GovScheme } from '@/services/govSchemes';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function SchemesContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const [schemes, setSchemes] = useState<GovScheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      setIsLoading(true);
      const data = await getGovSchemes();
      setSchemes(data);
      setIsLoading(false);
    };
    fetchSchemes();
  }, []);

  const categorizedSchemes = useMemo(() => {
    return schemes.reduce((acc, scheme) => {
      const category = scheme.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(scheme);
      return acc;
    }, {} as Record<string, GovScheme[]>);
  }, [schemes]);

  return (
    <AppShell title={t.governmentSchemes} activePage="schemes">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
            <CardHeader>
                <CardTitle>{t.governmentSchemes}</CardTitle>
                <CardDescription>{t.schemesDescription}</CardDescription>
            </CardHeader>
        </Card>

        {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <div className="border rounded-md p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                </div>
            ))
        ) : (
            Object.entries(categorizedSchemes).map(([category, schemesInCategory]) => (
                <div key={category}>
                    <h2 className="text-xl font-semibold mb-4">{t[category as keyof typeof t] || category}</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {schemesInCategory.map((scheme) => (
                            <AccordionItem value={`item-${scheme.id}`} key={scheme.id}>
                                <AccordionTrigger>{scheme.title}</AccordionTrigger>
                                <AccordionContent>
                                <div className="space-y-4">
                                    <p className="text-muted-foreground">{scheme.description}</p>
                                    
                                    <div className="p-4 border rounded-lg bg-muted/20">
                                    <h4 className="font-semibold mb-2">{t.keyBenefits}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {scheme.keyBenefits.map((benefit, index) => (
                                        <Badge key={index} variant="secondary">{benefit}</Badge>
                                        ))}
                                    </div>
                                    </div>

                                    <div>
                                    <h4 className="font-semibold">{t.eligibility}</h4>
                                    <p className="text-muted-foreground">{scheme.eligibility}</p>
                                    </div>
                                    <div>
                                    <h4 className="font-semibold">{t.benefits}</h4>
                                    <p className="text-muted-foreground">{scheme.benefits}</p>
                                    </div>
                                    <Button asChild>
                                    <Link href={scheme.link} target="_blank" rel="noopener noreferrer">
                                        {t.learnMoreAndApply}
                                    </Link>
                                    </Button>
                                </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ))
        )}
      </main>
    </AppShell>
  );
}
