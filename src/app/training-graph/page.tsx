
'use client';

import * as RechartsPrimitive from "recharts"
import dynamic from 'next/dynamic';

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
  { epoch: '1', training: 0.12, validation: 0.10 },
  { epoch: '2', training: 0.35, validation: 0.28 },
  { epoch: '3', training: 0.58, validation: 0.52 },
  { epoch: '4', training: 0.72, validation: 0.68 },
  { epoch: '5', training: 0.81, validation: 0.75 },
  { epoch: '6', training: 0.86, validation: 0.80 },
  { epoch: '7', training: 0.89, validation: 0.82 },
  { epoch: '8', training: 0.91, validation: 0.84 },
  { epoch: '9', training: 0.92, validation: 0.85 },
  { epoch: '10', training: 0.93, validation: 0.84 },
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


export default function TrainingGraphPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Training & Validation Accuracy</CardTitle>
          <CardDescription>Model performance over 10 epochs</CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicAccuracyChart />
        </CardContent>
      </Card>
    </div>
  );
}
