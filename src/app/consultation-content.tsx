
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
    title: { en: string; ta: string };
    description: { en: string; ta: string };
    link: string;
    icon: LucideIcon;
    category: ConsultationCategory;
}

const consultationLinks: ConsultationLink[] = [
    {
        id: 'tnau',
        title: {
            en: 'Tamil Nadu Agricultural University (TNAU)',
            ta: 'தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழகம் (TNAU)',
        },
        description: {
            en: 'Access research, e-courses, and farmer advisories from the leading agricultural university.',
            ta: 'முன்னணி வேளாண் பல்கலைக்கழகத்திலிருந்து ஆராய்ச்சி, படிப்புகள் மற்றும் రైతు సలహాలను அணுகండి.',
        },
        link: 'https://tnau.ac.in/',
        icon: University,
        category: 'gov',
    },
    {
        id: 'agri-dept-tn',
        title: {
            en: 'Dept. of Agriculture, Tamil Nadu',
            ta: 'வேளாண்மைத் துறை, தமிழ்நாடு அரசு',
        },
        description: {
            en: 'Official portal for agricultural schemes, subsidies, and announcements in Tamil Nadu.',
            ta: 'தமிழ்நாட்டில் விவசாயத் திட்டங்கள், மானியங்கள் மற்றும் அறிவிப்புகளுக்கான அதிகாரப்பூர்வ போர்டல்.',
        },
        link: 'https://www.tn.gov.in/department/1',
        icon: University,
        category: 'gov',
    },
    {
        id: 'uzhavan-app',
        title: {
            en: 'Uzhavan App',
            ta: 'உழவன் செயலி',
        },
        description: {
            en: 'Find information on subsidies, farm machinery, and crop insurance provided by the government.',
            ta: 'அரசு வழங்கும் மானியங்கள், பண்ணை இயந்திரங்கள் மற்றும் பயிர் காப்பீடு பற்றிய தகவல்களைக் கண்டறியவும்.',
        },
        link: 'https://play.google.com/store/apps/details?id=com.uzhavan.app',
        icon: BookOpen,
        category: 'knowledge',
    },
    {
        id: 'kvk-tn',
        title: {
            en: 'Krishi Vigyan Kendra (KVK) - TNAU',
            ta: 'கிருஷி విజ్ఞాన కేంద్రం (KVK) - TNAU',
        },
        description: {
            en: 'Get district-level scientific and technical support. Find your local KVK for personalized help.',
            ta: 'மாவட்ட அளவிலான அறிவியல் மற்றும் தொழில்நுட்ப ஆதரவைப் பெறுங்கள். தனிப்பயனாக்கப்பட்ட உதவிக்கு உங்கள் உள்ளூர் KVK-ஐக் கண்டறியவும்.',
        },
        link: 'https://tnau.ac.in/kvk/',
        icon: Users,
        category: 'community',
    },
    {
        id: 'soil-testing-tn',
        title: {
            en: 'Soil Testing Labs (TN)',
            ta: 'மண் பரிசோதனை ஆய்வகங்கள் (TN)',
        },
        description: {
            en: 'Find a nearby soil testing laboratory to analyze your soil for better crop management.',
            ta: 'சிறந்த பயிர் நிர்வாகத்திற்காக உங்கள் மண்ணைப் பகுப்பாய்வு செய்ய அருகிலுள்ள மண் பரிசோதனை ஆய்வகத்தைக் கண்டறியவும்.',
        },
        link: 'https://www.tnagrisnet.tn.gov.in/tnhort/soiltesting',
        icon: LandPlot,
        category: 'knowledge',
    },
     {
        id: 'pmfby',
        title: {
            en: 'Crop Insurance Portal',
            ta: 'பயிர் காப்பீட்டு போர்டல்',
        },
        description: {
            en: 'National portal for Pradhan Mantri Fasal Bima Yojana (PMFBY) for crop insurance.',
            ta: 'பயிர் காப்பீட்டிற்கான பிரதான் மந்திரி ஃபசல் பீமா யோஜனா (PMFBY) தேசிய போர்டல்.',
        },
        link: 'https://pmfby.gov.in/',
        icon: ShieldCheck,
        category: 'gov',
    },
];

const categories = (language: 'en' | 'ta') => ({
    gov: {
        title: language === 'en' ? 'Government & University Portals' : 'அரசு மற்றும் பல்கலைக்கழக இணையதளங்கள்',
        description: language === 'en' ? 'Official sources for schemes, subsidies, and research.' : 'திட்டங்கள், மானியங்கள் மற்றும் ஆராய்ச்சிக்கான அதிகாரப்பூர்வ ஆதாரங்கள்.',
    },
    knowledge: {
        title: language === 'en' ? 'Knowledge & Learning' : 'அறிவு மற்றும் கற்றல்',
        description: language === 'en' ? 'Resources to improve your farming techniques and knowledge.' : 'உங்கள் விவசாய நுட்பங்களையும் அறிவையும் மேம்படுத்துவதற்கான ஆதாரங்கள்.',
    },
    community: {
        title: language === 'en' ? 'Community & Support' : 'சமூகம் மற்றும் ஆதரவு',
        description: language === 'en' ? 'Connect with local centers and farmer communities for direct support.' : 'நேரடி ஆதரவிற்காக உள்ளூர் மையங்கள் மற்றும் விவசாய சமூகங்களுடன் இணையுங்கள்.',
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
    const audioEl = audioRef.current;
    return () => {
      if (audioEl) {
        audioEl.pause();
        audioEl.src = '';
      }
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    setAudioState(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => {
            if (newState[key] === 'playing') newState[key] = 'idle';
        });
        return newState;
    });
  };

  const handlePlayAudio = async (cardId: string, title: string, description: string) => {
    stopAudio();
    const textToSpeak = `${title}. ${description}`;

    setAudioState(prev => ({ ...prev, [cardId]: 'loading' }));
    try {
        const result = await generateSpeech({ text: textToSpeak, language });
        if (result && result.audioDataUri) {
            if (!audioRef.current) {
              audioRef.current = new Audio();
              audioRef.current.onended = stopAudio;
            }
            
            audioRef.current.src = result.audioDataUri;
            audioRef.current.play();
            setAudioState(prev => ({ ...prev, [cardId]: 'playing' }));
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
