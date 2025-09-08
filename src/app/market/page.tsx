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
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function MarketPage() {
  const marketTrends = await getMarketTrends();

  return (
    <AppShell title="Market Trends" activePage="market">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Latest Crop Prices</CardTitle>
            <CardDescription>
              Real-time market prices for crops in your region, updated daily.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop</TableHead>
                  <TableHead>Variety</TableHead>
                  <TableHead>Price (per kg)</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketTrends.map((crop) => (
                  <TableRow key={`${crop.name}-${crop.variety}`}>
                    <TableCell className="font-medium">{crop.name}</TableCell>
                    <TableCell>{crop.variety}</TableCell>
                    <TableCell>₹{crop.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={crop.changeDirection === 'up' ? 'default' : 'destructive'}
                        className={`flex items-center justify-end gap-1 w-20 ml-auto ${crop.changeDirection === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {crop.changeDirection === 'up' ? 
                          <ArrowUp className="h-3 w-3" /> : 
                          <ArrowDown className="h-3 w-3" />
                        }
                        <span>{crop.change.toFixed(2)}%</span>
                      </Badge>
                    </TableCell>
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
