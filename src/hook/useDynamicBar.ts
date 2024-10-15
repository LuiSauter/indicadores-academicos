/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

export type ChartData = Record<string, any>;
type Config = Record<string, { label: string; color?: string }>;

interface UseDynamicBarChartDataProps {
  rawData: ChartData[];
  xKey: string;
  yKey: string;
  fillKey?: string; // Campo opcional para color personalizado
  config?: Config;
}

export function useDynamicBarChartData({ rawData, xKey, yKey, fillKey, config }: UseDynamicBarChartDataProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const transformedData = rawData.map((item) => ({
      [xKey]: item[xKey],
      [yKey]: parseInt(item[yKey], 10), // Asegurarse de convertir los valores numéricos correctamente
      fill: fillKey && item[fillKey] ? item[fillKey] : config?.[item[xKey]]?.color || "var(--color-default)"
    }));
    setChartData(transformedData);
  }, [rawData, xKey, yKey, fillKey, config]);

  return chartData;
}
