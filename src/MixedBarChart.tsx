/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Interfaz para los datos del gráfico
interface MixedBarChartData {
  label: string; // Etiqueta del eje Y (e.g., nombre del navegador)
  visitors: number; // Número de visitantes
  fill?: string; // Color personalizado para la barra (opcional)
}

// Configuración genérica para el gráfico
interface MixedBarChartComponentProps {
  title: string; // Título del gráfico
  description: string; // Descripción del gráfico
  data: MixedBarChartData[]; // Datos del gráfico
  dataKey: string; // Clave de los datos para las barras
  labelKey: string; // Clave para las etiquetas del eje Y
  chartConfig?: ChartConfig; // Configuración opcional para colores
}

const defaultChartConfig: ChartConfig = {
  chrome: { label: "Chrome", color: "var(--color-chrome)" },
  safari: { label: "Safari", color: "var(--color-safari)" },
  firefox: { label: "Firefox", color: "var(--color-firefox)" },
  edge: { label: "Edge", color: "var(--color-edge)" },
  other: { label: "Other", color: "var(--color-other)" },
};

export function MixedBarChartComponent({
  data,
  dataKey,
  labelKey,
  chartConfig = defaultChartConfig,
}: MixedBarChartComponentProps) {
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 30,
              top: 16
            }}
            maxBarSize={50}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey={labelKey}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label ?? value.slice(0, 5)
              }
            />
            <XAxis
              dataKey={dataKey}
              type="number"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              hide
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey={dataKey}
              radius={10}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const chartDataExample = [
  { label: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { label: "safari", visitors: 200, fill: "var(--color-safari)" },
  { label: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { label: "edge", visitors: 173, fill: "var(--color-edge)" },
  { label: "other", visitors: 90, fill: "var(--color-other)" },
];

export function ExampleMixedBarChartUsage() {
  return (
    <MixedBarChartComponent
      title="Bar Chart - Mixed"
      description="January - June 2024"
      data={chartDataExample}
      dataKey="visitors"
      labelKey="label"
    />
  );
}
