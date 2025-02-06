import axios, { csrf } from "../../api/api";
import React, { useCallback, useEffect, useState } from "react";
import { PaperWrapper } from "../../components/PaperWrapper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Loading from "../../components/Loading";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Paper, Skeleton, Stack, TextField } from "@mui/material";
import { Link } from "react-router-dom";

const Novedades = ({ data, loading }) => {
  const [encuestaData, setEncuestaData] = useState(data);
  //const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];
  const [Fecha, setFecha] = useState(today);
  //fecha para testing `2024-08-29`

  const fetchNovedades = async (selectedDate) => {
    try {
      await csrf();
      const response = await axios.get(
        `api/dashboard/novedades_encuestas?fecha=${selectedDate}`
      );
      console.log(response.data);
      setEncuestaData(response.data);
      //setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (Fecha) {
      fetchNovedades(Fecha);
    }
  }, [Fecha]);

  console.log("log", encuestaData);

  if (loading) return <Skeleton height={200} />;
  else
    return (
      <PaperWrapper>
        <Grid
          container
          spacing={2}
          columns={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          size="grow">
          <Grid item xs={1}>
            <Typography variant="h4">Novedades</Typography>
          </Grid>
          <Grid item xs={1}>
            <TextField
              type="date"
              name="fecha_finalizacion"
              value={Fecha}
              onChange={(e) => setFecha(e.target.value)}
              fullWidth
              inputProps={{ max: today }}
            />
          </Grid>
          <Grid item xs={2}>
            <Box sx={{ width: "100%" }}>
              <Stack
                spacing={2}
                divider={<Divider flexItem sx={{ opacity: 1 }} />}>
                {encuestaData &&
                  encuestaData.map((item, index) => (
                    <React.Fragment key={index}>
                      <Typography variant="h5" component="div"
                        sx={{
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        <Link to={`/encuesta/${item.id}/preview`}>
                          {item.titulo_encuesta}
                        </Link>
                      </Typography>
                      <Typography variant="subtitle2" color={"GrayText"}>
                        Estado actual: {item.estado}
                      </Typography>
                      <Typography variant="h6">
                        Ha sido: {item.actividad.replace(/ /g, ' - ')}
                      </Typography>
                    </React.Fragment>
                  ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </PaperWrapper>
    );
};

export default Novedades;
