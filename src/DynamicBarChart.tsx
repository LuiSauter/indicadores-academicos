/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { useDynamicBarChartData } from "./hook/useDynamicBar";

interface DynamicBar {
  backendData: Record<string, any>[];
  chartConfig: Record<string, { label: string; color?: string }>;
}

export default function DynamicBarChart({ backendData, chartConfig }: DynamicBar) {
  // Aquí transformamos los datos usando `useDynamicBarChartData`
  const chartData = useDynamicBarChartData({
    rawData: backendData,
    xKey: 'localityName',
    yKey: 'sum_t_inscritos',
    config: chartConfig
  });

  return (
    <div>
      <BarChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="localityName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sum_t_inscritos" fill="#8884d8" />
      </BarChart>
      {/* <ScrollArea> */}
      <table>
        <thead>
          <tr>
            <th>Localidad</th>
            <th>Inscritos</th>
          </tr>
        </thead>
        <tbody>
          {backendData.map((item, index) => (
            <tr key={index}>
              <td>{item.localityName}</td>
              <td>{item.sum_t_inscritos}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* </ScrollArea> */}
    </div>
  );
}