import { getMarketTrends } from '@/services/market';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AppShell from '@/components/app-shell';

export default async function MarketPage() {
  const marketTrends = await getMarketTrends();

  return (
    <AppShell title="Market Trends" activePage="market">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Latest Crop Prices</CardTitle>
            <CardDescription>
              Real-time market prices for crops in your region.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop</TableHead>
                  <TableHead>Variety</TableHead>
                  <TableHead className="text-right">Price (per kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketTrends.map((crop) => (
                  <TableRow key={`${crop.name}-${crop.variety}`}>
                    <TableCell className="font-medium">{crop.name}</TableCell>
                    <TableCell>{crop.variety}</TableCell>
                    <TableCell className="text-right">₹{crop.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
