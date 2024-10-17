import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis } from "recharts";
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
// interface ChartData {
//   label: string; // Etiqueta para el eje X (e.g., "January", "February")
//   value: number; // Valor numérico para las barras
// }

interface ChartData {
  label: string;
  [key: string]: number | string;
}

// Configuración genérica para los colores de las barras
interface BarChartComponentProps {
  title: string; // Título del gráfico
  description: string; // Descripción del gráfico
  data: ChartData[]; // Datos que se renderizarán
  dataKey: string; // La clave de los datos para el gráfico
  labelKey: string; // La clave de las etiquetas del eje X
  chartColor?: string; // Color opcional para las barras
}

const defaultChartConfig = {
  label: <span>Value</span>,
  color: "var(--color-default)", // color por defecto de las barras
};

export function BarChartComponent({
  data,
  dataKey,
  labelKey,
  chartColor = "var(--color-default)", // Default color, customizable
}: BarChartComponentProps) {
  return (
    <Card>
      {/* <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader> */}
      <CardContent className="w-full grid grid-cols-1 justify-center items-end">
        <ChartContainer config={{
          ...defaultChartConfig,
          color: chartColor,
        } as ChartConfig}
        >
          <ResponsiveContainer width="100%" height={"100%"}>
            <BarChart
              accessibilityLayer
              layout="horizontal"
              data={data}
              margin={{
                // top: 10, right: 30, left: 20, bottom: 5
                top: 30
              }}
              // height={1000}
              maxBarSize={50}
              barGap={50} // Espacio entre barras
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={labelKey} // Mapea las etiquetas al eje X
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 5)} // Acorta las etiquetas (e.g., "January" a "Jan")
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Bar dataKey={dataKey} fill={chartColor} radius={8} alignmentBaseline="auto">
                <LabelList
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
