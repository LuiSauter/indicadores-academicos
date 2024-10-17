import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

// Interfaz para los datos del gráfico de múltiples barras
interface MultipleBarChartData {
  label: string; // Etiqueta para el eje X (e.g., "January", "February")
  [key: string]: number | string; // Clave dinámica para los conjuntos de datos
}

interface BarChartComponentProps {
  title: string; // Título del gráfico
  description: string; // Descripción del gráfico
  data: MultipleBarChartData[]; // Datos que se renderizarán
  dataKeys: string[]; // Las claves de los datos para las barras
  labelKey: string; // La clave de las etiquetas del eje X
  chartConfig?: ChartConfig; // Configuración opcional para los colores
}

const defaultChartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-green)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-blue)",
  },
};

export function MultipleBarChartComponent({
  data,
  dataKeys,
  labelKey,
  chartConfig = defaultChartConfig
}: BarChartComponentProps) {
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={labelKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // Acortar las etiquetas del eje X
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
            />
            {dataKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartConfig[key]?.color || "var(--color-default)"}
                radius={10}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Ejemplo de uso del componente
const chartDataExample = [
  { label: "January", desktop: 186, mobile: 80 },
  { label: "February", desktop: 305, mobile: 200 },
  { label: "March", desktop: 237, mobile: 120 },
  { label: "April", desktop: 73, mobile: 190 },
  { label: "May", desktop: 209, mobile: 130 },
  { label: "June", desktop: 214, mobile: 140 },
];

export function ExampleMultipleBarChartUsage() {
  return (
    <MultipleBarChartComponent
      title="Bar Chart - Multiple"
      description="January - June 2024"
      data={chartDataExample}
      dataKeys={["desktop", "mobile"]} // Claves de los diferentes conjuntos de barras
      labelKey="label" // Clave de las etiquetas del eje X
    />
  );
}
