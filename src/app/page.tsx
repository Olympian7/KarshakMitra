import {
  Bell,
  BotMessageSquare,
  ClipboardList,
  Home,
  Landmark,
  LineChart,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-primary-foreground md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M12 4c-2.3 0-4.4.9-6 2.5-1.6 1.6-2.5 3.7-2.5 6 0 2.3.9 4.4 2.5 6 1.6 1.6 3.7 2.5 6 2.5s4.4-.9 6-2.5c1.6-1.6 2.5-3.7 2.5-6 0-2.3-.9-4.4-2.5-6C16.4 4.9 14.3 4 12 4z" />
                <path d="M12 12c-2.3 0-4.4-.9-6-2.5" />
                <path d="M12 12c2.3 0 4.4-.9 6-2.5" />
                <path d="M12 12v10" />
                <path d="M12 12c-2.3 0-4.4.9-6 2.5" />
                <path d="m12 12 6 2.5" />
                <path d="m6 9.5 6 2.5" />
              </svg>
              <span className="">Kerala Karshak Mitra</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <User className="h-4 w-4" />
                Farm Profile
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BotMessageSquare className="h-4 w-4" />
                Conversational Assistant
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ClipboardList className="h-4 w-4" />
                Activity Tracking
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Landmark className="h-4 w-4" />
                Government Schemes
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Market Trends
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">
              Welcome, Farmer!
            </h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Farm Profile</CardTitle>
                <CardDescription>
                  View and manage your farm's digital twin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Go to Profile</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Conversational Assistant</CardTitle>
                <CardDescription>
                  Ask questions and get instant advice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Start Chat</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Activity Tracking</CardTitle>
                <CardDescription>
                  Log your farming activities with your voice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Log Activity</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Government Schemes</CardTitle>
                <CardDescription>
                  Explore schemes and check your eligibility.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>View Schemes</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Market Trends</CardTitle>
                <CardDescription>
                  Get the latest market prices and insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>See Trends</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Alerts & Reminders</CardTitle>
                <CardDescription>
                  Stay updated with proactive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>View Alerts</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
