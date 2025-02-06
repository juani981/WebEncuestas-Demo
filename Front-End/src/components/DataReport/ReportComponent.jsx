import React from "react";
import { BarsChartComponent } from "./BarsChartComponent";
import { FunctionChartComponent } from "./FunctionChartComponent";
import { PieChartComponent } from "./PieChartComponent";

export const ReportComponent = () => {
  return (
    <>
      {/* Reporte completo */}
      <p>Gráfico de barras para elecciones discretas no comparables</p>
      <BarsChartComponent></BarsChartComponent>
      <p>Une los puntos por interpolación, para datos comparables numéricos</p>
      <FunctionChartComponent></FunctionChartComponent>
      <p>Gráfico porcentual útil para múltiple choice</p>
      <PieChartComponent></PieChartComponent>
    </>
  );
};
