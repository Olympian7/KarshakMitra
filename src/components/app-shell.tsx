import Link from 'next/link';
import {
  Bell,
  ClipboardList,
  Home,
  Landmark,
  LineChart,
  MessageCircle,
  User,
  Languages
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';

type AppShellProps = {
  children: React.ReactNode;
  title: string;
  activePage: 'dashboard' | 'assistant' | 'profile' | 'tracking' | 'schemes' | 'market';
};

export default function AppShell({ children, title, activePage }: AppShellProps) {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const navItems = [
    { id: 'dashboard', href: '/', icon: Home, label: t.dashboard },
    { id: 'assistant', href: '/assistant', icon: MessageCircle, label: t.conversationalAssistant },
    { id: 'profile', href: '/profile', icon: User, label: t.farmProfile },
    { id: 'tracking', href: '/tracking', icon: ClipboardList, label: t.activityTracking },
    { id: 'schemes', href: '/schemes', icon: Landmark, label: t.governmentSchemes },
    { id: 'market', href: '/market', icon: LineChart, label: t.marketTrends },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
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
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    activePage === item.id
                      ? 'bg-muted text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
           <div className="mt-auto p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">N</AvatarFallback>
              </Avatar>
              <div>
                  <p className="font-semibold text-sm">Narayanan</p>
                  <p className="text-xs text-muted-foreground">{t.farmer}</p>
              </div>
            </div>
           </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">
              {title}
            </h1>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleLanguage}>
            <Languages className="h-4 w-4" />
            <span className="sr-only">Toggle Language</span>
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </header>
        {children}
      </div>
    </div>
  );
}
