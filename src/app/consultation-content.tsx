
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AppShell from '@/components/app-shell';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { ExternalLink, University, BookOpen, Users, LandPlot, ShieldCheck, Speaker, Loader2, Square } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import imageData from '@/lib/placeholder-images.json';
import React, { useState, useRef, useEffect } from 'react';
import { generateSpeech } from '@/ai/flows/tts-flow';
import { useToast } from '@/components/ui/use-toast';

type ConsultationCategory = 'gov' | 'knowledge' | 'community';

interface ConsultationLink {
    id: string;
    title: { en: string; ml: string };
    description: { en: string; ml: string };
    link: string;
    icon: LucideIcon;
    category: ConsultationCategory;
}

const consultationLinks: ConsultationLink[] = [
    {
        id: 'kau',
        title: {
            en: 'Kerala Agricultural University (KAU)',
            ml: 'കേരള കാർഷിക സർവ്വകലാശാല (KAU)',
        },
        description: {
            en: 'Access research, courses, and farmer advisories from the leading agricultural university.',
            ml: 'പ്രമുഖ കാർഷിക സർവകലാശാലയിൽ നിന്നുള്ള ഗവേഷണങ്ങൾ, കോഴ്‌സുകൾ, കർഷകർക്കുള്ള ഉപദേശങ്ങൾ എന്നിവ നേടുക.',
        },
        link: 'http://www.kau.in/',
        icon: University,
        category: 'gov',
    },
    {
        id: 'agri-dept',
        title: {
            en: 'Dept. of Agriculture Development',
            ml: 'കൃഷി വകുപ്പ്, കർഷകക്ഷേമം',
        },
        description: {
            en: 'Official portal for agricultural schemes, subsidies, and announcements in Kerala.',
            ml: 'കേരളത്തിലെ സർക്കാർ പദ്ധതികൾ, സബ്‌സിഡികൾ, അറിയിപ്പുകൾ എന്നിവയ്ക്കുള്ള ഔദ്യോഗിക പോർട്ടൽ.',
        },
        link: 'https://keralaagriculture.gov.in/',
        icon: University,
        category: 'gov',
    },
    {
        id: 'fib',
        title: {
            en: 'Farm Information Bureau (FIB)',
            ml: 'ഫാം ഇൻഫർമേഷൻ ബ്യൂറോ (FIB)',
        },
        description: {
            en: 'Find publications and media resources like "Kerala Karshakan" to stay updated.',
            ml: '"കേരള കർഷകൻ" പോലുള്ള പ്രസിദ്ധീകരണങ്ങളും മറ്റ് മീഡിയ ഉറവിടങ്ങളും കണ്ടെത്തുക.',
        },
        link: 'http://www.fibkerala.gov.in/',
        icon: BookOpen,
        category: 'knowledge',
    },
    {
        id: 'kvk',
        title: {
            en: 'Krishi Vigyan Kendra (KVK)',
            ml: 'കൃഷി വിജ്ഞാന കേന്ദ്രം (KVK)',
        },
        description: {
            en: 'Get district-level scientific and technical support. Find your local KVK for personalized help.',
            ml: 'ജില്ലാതല ശാസ്ത്രീയ-സാങ്കേതിക പിന്തുണ നേടുക. സഹായത്തിനായി നിങ്ങളുടെ പ്രാഥേശിക KVK കണ്ടെത്തുക.',
        },
        link: 'http://kvk.kau.in/',
        icon: Users,
        category: 'community',
    },
    {
        id: 'soil-testing',
        title: {
            en: 'Soil Testing Labs',
            ml: 'മണ്ണ് പരിശോധന ലാബുകൾ',
        },
        description: {
            en: 'Find a nearby soil testing laboratory to analyze your soil for better crop management.',
            ml: 'മികച്ച വിള പരിപാലനത്തിനായി നിങ്ങളുടെ മണ്ണ് വിശകലനം ചെയ്യാൻ അടുത്തുള്ള മണ്ണ് പരിശോധന ലാബ് കണ്ടെത്തുക.',
        },
        link: 'http://www.keralasoil.gov.in/index.php/testing-labs',
        icon: LandPlot,
        category: 'knowledge',
    },
     {
        id: 'pmfby',
        title: {
            en: 'Crop Insurance Portal',
            ml: 'വിള ഇൻഷുറൻസ് പോർട്ടൽ',
        },
        description: {
            en: 'National portal for Pradhan Mantri Fasal Bima Yojana (PMFBY) for crop insurance.',
            ml: 'വിള ഇൻഷുറൻസിനായുള്ള പ്രധാൻ മന്ത്രി ഫസൽ ബീമാ യോജനയുടെ (PMFBY) ദേശീയ പോർട്ടൽ.',
        },
        link: 'https://pmfby.gov.in/',
        icon: ShieldCheck,
        category: 'gov',
    },
];

const categories = (language: 'en' | 'ml') => ({
    gov: {
        title: language === 'en' ? 'Government & University Portals' : 'സർക്കാർ & സർവകലാശാല പോർട്ടലുകൾ',
        description: language === 'en' ? 'Official sources for schemes, subsidies, and research.' : 'പദ്ധതികൾ, സബ്‌സിഡികൾ, ഗവേഷണങ്ങൾ എന്നിവയ്ക്കുള്ള ഔദ്യോഗിക ഉറവിടങ്ങൾ.',
    },
    knowledge: {
        title: language === 'en' ? 'Knowledge & Learning' : 'അറിവും പഠനവും',
        description: language === 'en' ? 'Resources to improve your farming techniques and knowledge.' : 'നിങ്ങളുടെ കാർഷിക രീതികളും അറിവും മെച്ചപ്പെടുത്തുന്നതിനുള്ള ഉറവിടങ്ങൾ.',
    },
    community: {
        title: language === 'en' ? 'Community & Support' : 'കമ്മ്യൂണിറ്റിയും പിന്തുണയും',
        description: language === 'en' ? 'Connect with local centers and farmer communities for direct support.' : 'നേരിട്ടുള്ള പിന്തുണയ്ക്കായി പ്രാദേശിക കേന്ദ്രങ്ങളുമായും കർഷക സമൂഹങ്ങളുമായും ബന്ധപ്പെടുക.',
    },
});


export default function ConsultationContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const categoryInfo = categories(language);
  const { consultation_banner } = imageData;
  const { toast } = useToast();

  const [audioState, setAudioState] = useState<{ [key: string]: 'idle' | 'loading' | 'playing' }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Audio cleanup on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    // Reset all playing states to idle
    setAudioState(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => {
            if (newState[key] === 'playing') newState[key] = 'idle';
        });
        return newState;
    });
  };

  const handlePlayAudio = async (cardId: string, title: string, description: string) => {
      stopAudio(); // Stop any currently playing audio
      
      const textToSpeak = `${title}. ${description}`;

      setAudioState(prev => ({ ...prev, [cardId]: 'loading' }));
      try {
          const result = await generateSpeech({ text: textToSpeak, language: language });
          if (result && result.audioDataUri) {
              // Create a new Audio object for each playback
              const audio = new Audio(result.audioDataUri);
              audioRef.current = audio;

              audio.play();
              setAudioState(prev => ({ ...prev, [cardId]: 'playing' }));

              // When audio finishes, reset the state for this card
              audio.onended = () => {
                  setAudioState(prev => ({ ...prev, [cardId]: 'idle' }));
              };
          } else {
              throw new Error("No audio data received.");
          }
      } catch (error) {
          console.error("Error generating speech:", error);
          toast({
              variant: "destructive",
              title: "Speech Error",
              description: "Could not generate audio for this message.",
          });
          setAudioState(prev => ({ ...prev, [cardId]: 'idle' }));
      }
  };


  return (
    <AppShell title={t.consultation} activePage="consultation">
      <main className="flex flex-1 flex-col">
        <div className="relative w-full h-48">
            <Image
                src={`https://picsum.photos/seed/${consultation_banner.seed}/${consultation_banner.width}/${consultation_banner.height}`}
                alt="A farmer talking with an expert in a field"
                fill
                style={{objectFit: 'cover'}}
                className="opacity-90"
                data-ai-hint={consultation_banner.hint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">{t.expertConsultation}</h1>
                <p className="text-white/90 max-w-2xl">{t.consultationDesc}</p>
            </div>
        </div>
        
        <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        {Object.keys(categoryInfo).map(catKey => {
            const category = categoryInfo[catKey as ConsultationCategory];
            const links = consultationLinks.filter(link => link.category === catKey);
            
            if(links.length === 0) return null;

            return (
                <div key={catKey} className="space-y-4">
                    <div className="px-1">
                        <h2 className="text-xl font-semibold">{category.title}</h2>
                        <p className="text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {links.map((item) => {
                            const currentAudioState = audioState[item.id] || 'idle';
                            return (
                             <Card key={item.id} className="flex flex-col">
                                <CardHeader className="flex-row items-start gap-4 space-y-0">
                                   <div className="p-3 rounded-md bg-primary/10 text-primary border border-primary/20">
                                    <item.icon className="h-6 w-6" />
                                   </div>
                                   <div className="flex-1">
                                    <CardTitle className="text-lg">{item.title[language]}</CardTitle>
                                    <CardDescription className="mt-1">{item.description[language]}</CardDescription>
                                   </div>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col justify-end">
                                    {/* This spacer pushes the footer to the bottom */}
                                </CardContent>
                                <CardFooter className="flex items-center justify-between gap-2 pt-4">
                                    <Button asChild className="flex-1">
                                        <Link href={item.link} target="_blank" rel="noopener noreferrer">
                                            {t.visitWebsite} <ExternalLink className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        size="icon"
                                        onClick={() => currentAudioState === 'playing' ? stopAudio() : handlePlayAudio(item.id, item.title[language], item.description[language])}
                                        className="h-10 w-10 flex-shrink-0"
                                    >
                                        {currentAudioState === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
                                        {currentAudioState === 'playing' && <Square className="h-5 w-5" />}
                                        {currentAudioState === 'idle' && <Speaker className="h-5 w-5" />}
                                        <span className="sr-only">{t.playAudio}</span>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )})}
                    </div>
                </div>
            )
        })}
        </div>
      </main>
    </AppShell>
  );
}

    