'use client';

import * as RechartsPrimitive from "recharts"
import dynamic from 'next/dynamic';

import AppShell from '@/components/app-shell';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
    ChartContainer, 
    ChartTooltip, 
    ChartTooltipContent,
    type ChartConfig 
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const chartData = [
  { epoch: '1', training: 0.62, validation: 0.55 },
  { epoch: '2', training: 0.41, validation: 0.38 },
  { epoch: '3', training: 0.35, validation: 0.32 },
  { epoch: '4', training: 0.31, validation: 0.29 },
  { epoch: '5', training: 0.28, validation: 0.27 },
  { epoch: '6', training: 0.25, validation: 0.24 },
  { epoch: '7', training: 0.23, validation: 0.22 },
  { epoch: '8', training: 0.21, validation: 0.20 },
  { epoch: '9', training: 0.19, validation: 0.19 },
  { epoch: '10', training: 0.18, validation: 0.18 },
  { epoch: '11', training: 0.17, validation: 0.17 },
  { epoch: '12', training: 0.16, validation: 0.16 },
  { epoch: '13', training: 0.15, validation: 0.155 },
  { epoch: '14', training: 0.14, validation: 0.15 },
  { epoch: '15', training: 0.13, validation: 0.145 },
  { epoch: '16', training: 0.12, validation: 0.14 },
  { epoch: '17', training: 0.11, validation: 0.135 },
  { epoch: '18', training: 0.10, validation: 0.13 },
  { epoch: '19', training: 0.09, validation: 0.125 },
  { epoch: '20', training: 0.08, validation: 0.12 },
];


const chartConfig = {
  training: {
    label: 'Training Loss',
    color: 'hsl(var(--primary))',
  },
  validation: {
    label: 'Validation Loss',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

// This is the actual chart component. It will only be rendered on the client.
function LossChartComponent() {
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <RechartsPrimitive.LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <RechartsPrimitive.CartesianGrid vertical={false} />
        <RechartsPrimitive.XAxis
          dataKey="epoch"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `Epoch ${value}`}
        />
        <RechartsPrimitive.YAxis
          tickFormatter={(value) => value.toFixed(2)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <RechartsPrimitive.Legend />
        <RechartsPrimitive.Line
          dataKey="training"
          type="monotone"
          stroke="var(--color-training)"
          strokeWidth={2}
          dot={false}
        />
        <RechartsPrimitive.Line
          dataKey="validation"
          type="monotone"
          stroke="var(--color-validation)"
          strokeWidth={2}
          dot={false}
        />
      </RechartsPrimitive.LineChart>
    </ChartContainer>
  );
}

// Dynamically import the chart component with SSR turned off.
const DynamicLossChart = dynamic(() => Promise.resolve(LossChartComponent), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});


export default function LstmLossGraphContent() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <AppShell title={t.lstmLossGraph} activePage="lstm-loss-graph">
            <main className="flex flex-1 flex-col p-4 lg:p-8 bg-background">
                <Card className="w-full max-w-4xl mx-auto border-2 border-dashed">
                    <CardHeader>
                    <CardTitle className="text-2xl">LSTM Model Performance</CardTitle>
                    <CardDescription>Training & Validation Loss over 20 epochs. This chart tracks the error reduction for the market price prediction model.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <DynamicLossChart />
                    </CardContent>
                </Card>
            </main>
        </AppShell>
    );
}
