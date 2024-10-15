/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

type ChartData = Record<string, any>;
type Config = Record<string, { label: string; color?: string }>;

interface UseBarChartDataProps {
  rawData: ChartData[];
  xKey: string;
  yKey: string;
  fillKey?: string; // Campo opcional para color personalizado
  config?: Config;
}

export function useBarChartData({ rawData, xKey, yKey, fillKey, config }: UseBarChartDataProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const transformedData = rawData.map((item) => ({
      [xKey]: item[xKey],
      [yKey]: item[yKey],
      fill: fillKey && item[fillKey] ? item[fillKey] : config?.[item[xKey]]?.color || "var(--color-default)"
    }));
    setChartData(transformedData);
  }, [rawData, xKey, yKey, fillKey, config]);

  return chartData;
}
