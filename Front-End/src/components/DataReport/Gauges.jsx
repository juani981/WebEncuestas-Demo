import axios from "../../api/api";
import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../components/PaperWrapper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Loading from "../../components/Loading";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Paper, Skeleton } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";

export const Gauges = ({ data }) => {
  console.log("miData" + data);
  function getGradient(value) {
    // Asegurarse de que el valor esté dentro del rango permitido
    value = Math.max(0, Math.min(100, value));

    if (value <= 25) {
      // Rojo oscuro a rojo claro (0 a 25)
      let ratio = value / 25;
      return `rgb(${Math.round(50 + ratio * (255 - 50))}, 0, 0)`;
    } else if (value <= 60) {
      // Rojo a amarillo (25 a 70)
      let ratio = (value - 25) / (70 - 25);
      return `rgb(255, ${Math.round(ratio * 255)}, 0)`;
    } else {
      // Amarillo a verde (71 a 100)
      let ratio = (value - 70) / (100 - 70);
      return `rgb(${Math.round(255 - ratio * 255)}, 255, 0)`;
    }
  }
  return (
    <Gauge
      value={data}
      startAngle={-110}
      endAngle={110}
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 20,
          transform: "translate(0px, 0px)",
          height: "50%",
          width: "50%",
          marginBottom: "0px",
          paddingBottom: "0px",
        },

        [`& .${gaugeClasses.valueArc}`]: {
          fill: getGradient(data),
        },

        [`& .${gaugeClasses.referenceArc}`]: {
          fill: theme.palette.text.disabled,
        },
      })}
      height={100}
      //text={({ value, valueMax }) => `${value} / ${valueMax}`}
      text={`${data}%`}
    />
  );
};
