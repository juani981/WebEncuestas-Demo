"use client";

import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Paper, Skeleton, Typography, Box } from "@mui/material";

export const TopEncuestas = ({ data, loading }) => {
  const highlighted = "item";
  const faded = "global";

  const [isLabelVisible, setIsLabelVisible] = useState(true);

  const handleResize = () => {
    setIsLabelVisible(window.innerWidth >= 960); // Assuming 960px is the medium breakpoint
  };

  useEffect(() => {
    handleResize(); // Set initial visibility
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return <Skeleton height={400} />;
  }

  const dataSet = data;

  if (!dataSet || dataSet.length === 0) {
    return (
      <Paper elevation={6} square={true}>
        <Typography variant="body1" sx={{ p: 2 }}>
          Sin datos disponibles.
        </Typography>
      </Paper>
    );
  }

  const maxRespondidas = Math.max(...dataSet.map((item) => item.respondidas));

  const normalizedDataSet = dataSet.map((item) => ({
    ...item,
    porcentaje_incompletas_normalized:
      item.respondidas > 0
        ? (item.respondidas_incompletas / item.respondidas) * item.respondidas
        : 0,
  }));

  const series = [
    {
      data: normalizedDataSet.map((item) => item.respondidas),
      label: "Respuestas",
      highlightScope: { highlighted, faded },
    },
    {
      data: normalizedDataSet.map(
        (item) => item.porcentaje_incompletas_normalized
      ),
      label: "Porcentaje de completitud",
      secondaryAxis: true,
      colorMap: {
        type: "continuous",
        min: 0,
        max: 100,
        color: ["green", "red"],
      },
      highlightScope: { highlighted, faded },
      valueFormatter: (value) =>
        `${((value / maxRespondidas) * 100).toFixed(2)}%`,
    },
  ];

  const chartSetting = {
    xAxis: [
      {
        label: "Top 5 Encuestas más respondidas",
        tickFormat: (value) => Math.round(value),
      },
    ],
    colors: ["#76b7b2", "#4e79a7"],
    margin: {
      left: isLabelVisible ? 230 : 50,
      right: 50,
      top: 50,
      bottom: 50
    },
    width: undefined,
    height: undefined,
    sx: {
      [`& .MuiChartsAxis-tickLabel`]: {
        wordBreak: "break-word",
        whiteSpace: "normal",
        maxWidth: "200px"
      },
      [`& .MuiChartsAxis-tick`]: {
        maxWidth: "100%"
      },
      [`& .MuiChartsBarChart-bar`]: {
        maxHeight: "calc(100% - 20px)", // Clamp height for lg screens
        height: "100%"
      }
    }
  };

  return (
    <Paper
      elevation={6}
      square={true}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
      
          <Typography variant="h5" sx={{ m: 2 , mb: 0 }}>
            Encuestas más respondidas
          </Typography>
        
      <Box sx={{ 
        flexGrow: 1, 
        display: "flex", 
        position: "relative",
        width: "100%",
        height: "calc(100% - 60px)",
        overflow: "hidden"
      }}>
        <BarChart
          series={series}
          {...chartSetting}
          layout="horizontal"
          barGap={16}
          sx={{
            maxHeight: "400px", // Set a fixed max height for debugging
          }}
          yAxis={[
            {
              scaleType: "band",
              data: dataSet.map((item) => item.id_orden),
              max: maxRespondidas,
              tickLabelStyle: {
                textAnchor: "end",
                dominantBaseline: "middle",
                fontSize: "0.75rem",
                lineHeight: "1.5rem",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "normal",
                maxWidth: "200px",
                display: isLabelVisible ? "block" : "none" // Hide on small screens
              },
              valueFormatter: (value) => {
                const item = dataSet.find((item) => item.id_orden === value);
                return item ? item.titulo_encuesta : "";
              },
            },
          ]}
          secondaryAxis={[
            {
              scaleType: "linear",
              label: "Porcentaje Relativo a Respondidas",
              max: maxRespondidas,
            },
          ]}
        />
      </Box>
    </Paper>
  );
};
