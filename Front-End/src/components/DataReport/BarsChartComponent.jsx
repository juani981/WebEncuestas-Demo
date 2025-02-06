import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { data } from "autoprefixer";

const chartSetting = {
  xAxis: [
    {
      label: "rainfall (mm)",
    },
  ],
  width: 500,
  height: 400,
};

export default function BarsChartComponent() {
  return (
    <BarChart
      yAxis={[
        {
          scaleType: "band",
          data: [
            "Encuesta N° 1",
            "Encuesta N° 2",
            "Encuesta N° 3",
            "Encuesta N° 4",
            "Encuesta N° 5",
          ],
        },
      ]}
      series={[{ data: [1, 2, 3, 4, 5], label: "Encuestas más respondidas" }]}
      layout="horizontal"
      {...chartSetting}
    />
  );
}
