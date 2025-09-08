
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AppShell from '@/components/app-shell';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { ExternalLink } from 'lucide-react';

const consultationLinks = [
    {
        id: 'kau',
        title: {
            en: 'Kerala Agricultural University (KAU)',
            ml: 'കേരള കാർഷിക സർവ്വകലാശാല (KAU)',
        },
        description: {
            en: 'Access the latest research, academic courses, and farmer advisories from the leading agricultural university in the state.',
            ml: 'സംസ്ഥാനത്തെ പ്രമുഖ കാർഷിക സർവകലാശാലയിൽ നിന്നുള്ള ഏറ്റവും പുതിയ ഗവേഷണങ്ങൾ, അക്കാദമിക് കോഴ്‌സുകൾ, കർഷകർക്കുള്ള ഉപദേശങ്ങൾ എന്നിവ നേടുക.',
        },
        link: 'http://www.kau.in/',
    },
    {
        id: 'agri-dept',
        title: {
            en: 'Dept. of Agriculture Development & Farmers\' Welfare',
            ml: 'കൃഷി വകുപ്പ്, കർഷകക്ഷേമം',
        },
        description: {
            en: 'The official government portal for agricultural schemes, subsidies, and announcements for farmers in Kerala.',
            ml: 'കേരളത്തിലെ കർഷകർക്കായുള്ള സർക്കാർ പദ്ധതികൾ, സബ്‌സിഡികൾ, അറിയിപ്പുകൾ എന്നിവയ്ക്കുള്ള ഔദ്യോഗിക സർക്കാർ പോർട്ടൽ.',
        },
        link: 'https://keralaagriculture.gov.in/',
    },
    {
        id: 'fib',
        title: {
            en: 'Farm Information Bureau (FIB)',
            ml: 'ഫാം ഇൻഫർമേഷൻ ബ്യൂറോ (FIB)',
        },
        description: {
            en: 'Find publications, magazines like "Kerala Karshakan", and other media resources to stay updated on farming practices.',
            ml: '"കേരള കർഷകൻ" പോലുള്ള പ്രസിദ്ധീകരണങ്ങൾ, മാസികകൾ, കാർഷിക രീതികളെക്കുറിച്ച് അപ്‌ഡേറ്റ് ചെയ്യുന്ന മറ്റ് മീഡിയ ഉറവിടങ്ങൾ എന്നിവ കണ്ടെത്തുക.',
        },
        link: 'http://www.fibkerala.gov.in/',
    },
    {
        id: 'kvk',
        title: {
            en: 'Krishi Vigyan Kendra (KVK)',
            ml: 'കൃഷി വിജ്ഞാന കേന്ദ്രം (KVK)',
        },
        description: {
            en: 'Get direct, district-level scientific and technical support for your farming activities. Find your local KVK for personalized help.',
            ml: 'നിങ്ങളുടെ കാർഷിക പ്രവർത്തനങ്ങൾക്ക് നേരിട്ടുള്ള, ജില്ലാതല ശാസ്ത്രീയവും സാങ്കേതികവുമായ പിന്തുണ നേടുക. വ്യക്തിഗത സഹായത്തിനായി നിങ്ങളുടെ പ്രാദേശിക KVK കണ്ടെത്തുക.',
        },
        link: 'http://kvk.kau.in/',
    },
];


export default function ConsultationPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <AppShell title={t.consultation} activePage="consultation">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
         <Card>
            <CardHeader>
                <CardTitle>{t.expertConsultation}</CardTitle>
                <CardDescription>{t.consultationDesc}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                {consultationLinks.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg flex flex-col items-start gap-3">
                        <h3 className="font-semibold text-lg">{item.title[language]}</h3>
                        <p className="text-sm text-muted-foreground flex-1">{item.description[language]}</p>
                         <Button asChild>
                            <Link href={item.link} target="_blank" rel="noopener noreferrer">
                                {t.visitWebsite} <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                ))}
            </CardContent>
         </Card>
      </main>
    </AppShell>
  );
}
