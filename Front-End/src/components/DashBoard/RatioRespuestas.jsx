import axios, { csrf } from "../../api/api";
import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../components/PaperWrapper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Loading from "../../components/Loading";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Paper, Skeleton } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { Gauges } from "../DataReport/Gauges";

export const RatioRespuestas = ({ data, loading }) => {
  console.log("Ratio Respuestas", data);

  if (loading) {
    return <Skeleton height={200} />;
  } else
    return (
      <PaperWrapper>
        <Typography variant="h5" sx={{ mb: 2 }}>Índice de respuestas</Typography>
        <Grid container columns={3}>
          <Grid item xs={1} textAlign="center">
            <Gauges data={data.porcentaje_respondidas} />
            <Typography variant="body1" style={{ fontSize: 14 }}>
              Respuestas Públicas Completas
            </Typography>
          </Grid>
          <Grid item xs={1} textAlign="center">
            {/* <Gauges data={data.porcentaje_respondidas} /> */}
            <Gauges data={48}/>
            <Typography variant="body1" style={{ fontSize: 14 }}>
              Respuestas Privadas Completas
            </Typography>
          </Grid>
          <Grid item xs={1} textAlign="center">
            {/* <Gauges data={data.porcentaje_encuestas_privadas_hechas} /> */}
            <Gauges data={72.7}/>

            <Typography variant="body1" style={{ fontSize: 14 }}>
              Encuestas Privadas Realizadas
            </Typography>
          </Grid>
        </Grid>
      </PaperWrapper>
    );
};
