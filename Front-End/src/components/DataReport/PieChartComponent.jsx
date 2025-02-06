import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export const PieChartComponent = () => {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: "opcion A" },
            { id: 1, value: 15, label: "opcion B" },
            { id: 2, value: 20, label: "opcion C" },
          ],
        },
      ]}
      width={800}
      height={300}
    />
  );
};
