import Link from 'next/link';
import {
  CloudSun,
  ClipboardList,
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
import { getActivities } from '@/services/activity';
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
  const marketTrends = (await getMarketTrends()).slice(0, 3);
  const govSchemes = (await getGovSchemes()).slice(0, 2);
  const recentActivities = (await getActivities()).slice(0, 1);

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
                    {marketTrends.map((crop) => (
                      <TableRow key={`${crop.name}-${crop.variety}`}>
                        <TableCell>{crop.name}</TableCell>
                        <TableCell className="text-right">₹{crop.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Recent Activity</CardTitle>
                <Link href="/tracking">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                 {recentActivities.length > 0 ? (
                  <div className="flex items-start gap-4">
                    <ClipboardList className="h-6 w-6 text-accent mt-1" />
                    <div>
                      <p className="font-medium">{recentActivities[0].text}</p>
                      <p className="text-sm text-muted-foreground">{new Date(recentActivities[0].date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activities logged.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Featured Government Schemes</CardTitle>
                 <Link href="/schemes">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="grid gap-4">
                {govSchemes.map((scheme) => (
                  <div key={scheme.id} className="border border-border/50 p-3 rounded-lg">
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
