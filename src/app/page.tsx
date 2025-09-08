import Link from 'next/link';
import {
  CloudSun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getWeatherForecast } from '@/services/weather';
import { getMarketTrends } from '@/services/market';
import { getGovSchemes } from '@/services/govSchemes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AppShell from '@/components/app-shell';

export default async function Dashboard() {
  const weather = await getWeatherForecast();
  const marketTrends = await getMarketTrends();
  const govSchemes = (await getGovSchemes()).slice(0, 2);

  return (
    <AppShell title="Dashboard" activePage="dashboard">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">
              Welcome, Farmer!
            </h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Today's Weather</CardTitle>
                <CloudSun className="h-6 w-6 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{weather.temperature}°C</div>
                <p className="text-sm text-muted-foreground">
                  {weather.condition}
                </p>
                <p className="text-sm">Humidity: {weather.humidity}%</p>
                <p className="text-sm">Wind: {weather.windSpeed} km/h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Market Snapshot</CardTitle>
                <Link href="/market">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crop</TableHead>
                      <TableHead className="text-right">Price (per kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketTrends.slice(0, 3).map((crop) => (
                      <TableRow key={`${crop.name}-${crop.variety}`}>
                        <TableCell>{crop.name}</TableCell>
                        <TableCell className="text-right">₹{crop.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Featured Government Schemes</CardTitle>
                 <Link href="/schemes">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {govSchemes.map((scheme) => (
                  <div key={scheme.id} className="border border-border/50 p-4 rounded-lg">
                    <h3 className="font-semibold">{scheme.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{scheme.description.slice(0,100)}...</p>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        </main>
    </AppShell>
  );
}
