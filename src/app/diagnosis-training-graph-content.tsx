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
  { epoch: '1', training: 0.25, validation: 0.22 },
  { epoch: '2', training: 0.45, validation: 0.40 },
  { epoch: '3', training: 0.60, validation: 0.55 },
  { epoch: '4', training: 0.68, validation: 0.65 },
  { epoch: '5', training: 0.74, validation: 0.71 },
  { epoch: '6', training: 0.78, validation: 0.75 },
  { epoch: '7', training: 0.81, validation: 0.78 },
  { epoch: '8', training: 0.83, validation: 0.80 },
  { epoch: '9', training: 0.85, validation: 0.82 },
  { epoch: '10', training: 0.86, validation: 0.83 },
  { epoch: '11', training: 0.87, validation: 0.84 },
  { epoch: '12', training: 0.88, validation: 0.85 },
  { epoch: '13', training: 0.89, validation: 0.855 },
  { epoch: '14', training: 0.90, validation: 0.86 },
  { epoch: '15', training: 0.91, validation: 0.865 },
  { epoch: '16', training: 0.915, validation: 0.87 },
  { epoch: '17', training: 0.92, validation: 0.875 },
  { epoch: '18', training: 0.925, validation: 0.88 },
  { epoch: '19', training: 0.93, validation: 0.88 },
  { epoch: '20', training: 0.935, validation: 0.878 },
];

const chartConfig = {
  training: {
    label: 'Training Accuracy',
    color: 'hsl(var(--primary))',
  },
  validation: {
    label: 'Validation Accuracy',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

// This is the actual chart component. It will only be rendered on the client.
function AccuracyChartComponent() {
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
          domain={[0, 1]}
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
const DynamicAccuracyChart = dynamic(() => Promise.resolve(AccuracyChartComponent), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});


export default function DiagnosisTrainingGraphContent() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <AppShell title={t.diagnosisTrainingGraph} activePage="diagnosis-training-graph">
            <main className="flex flex-1 flex-col p-4 lg:p-8 bg-background">
                <Card className="w-full max-w-4xl mx-auto border-2 border-dashed">
                    <CardHeader>
                    <CardTitle className="text-2xl">Pest & Disease Diagnosis Model Performance</CardTitle>
                    <CardDescription>Training & Validation Accuracy over 20 epochs. This chart visualizes how the model&apos;s accuracy improved on both the training data and unseen validation data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <DynamicAccuracyChart />
                    </CardContent>
                </Card>
            </main>
        </AppShell>
    );
}
