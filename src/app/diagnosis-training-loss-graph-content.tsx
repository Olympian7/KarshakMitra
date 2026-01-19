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
  { epoch: '1', training: 2.3, validation: 2.1 },
  { epoch: '2', training: 1.8, validation: 1.6 },
  { epoch: '3', training: 1.4, validation: 1.3 },
  { epoch: '4', training: 1.1, validation: 1.0 },
  { epoch: '5', training: 0.9, validation: 0.85 },
  { epoch: '6', training: 0.75, validation: 0.7 },
  { epoch: '7', training: 0.65, validation: 0.62 },
  { epoch: '8', training: 0.58, validation: 0.55 },
  { epoch: '9', training: 0.52, validation: 0.51 },
  { epoch: '10', training: 0.48, validation: 0.49 },
  { epoch: '11', training: 0.45, validation: 0.47 },
  { epoch: '12', training: 0.42, validation: 0.46 },
  { epoch: '13', training: 0.40, validation: 0.45 },
  { epoch: '14', training: 0.38, validation: 0.44 },
  { epoch: '15', training: 0.36, validation: 0.43 },
  { epoch: '16', training: 0.34, validation: 0.435 },
  { epoch: '17', training: 0.33, validation: 0.44 },
  { epoch: '18', training: 0.32, validation: 0.445 },
  { epoch: '19', training: 0.31, validation: 0.45 },
  { epoch: '20', training: 0.30, validation: 0.455 },
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


export default function DiagnosisTrainingLossGraphContent() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <AppShell title={t.diagnosisTrainingLossGraph} activePage="diagnosis-training-loss-graph">
            <main className="flex flex-1 flex-col items-center justify-center p-4 bg-muted/40">
                <Card className="w-full max-w-3xl">
                    <CardHeader>
                    <CardTitle>Pest & Disease Diagnosis Model Performance</CardTitle>
                    <CardDescription>Training & Validation Loss over 20 epochs</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <DynamicLossChart />
                    </CardContent>
                </Card>
            </main>
        </AppShell>
    );
}
