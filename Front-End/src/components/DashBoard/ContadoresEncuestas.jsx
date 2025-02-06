import axios, { csrf } from "../../api/api";
import React, { useEffect, useState } from "react";
import { PaperWrapper } from "../../components/PaperWrapper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Skeleton } from "@mui/material";

export const ContadoresEncuestas = ({ data, loading }) => {
  //const [data, setData] = useState();
  //const [loading, setLoading] = useState(true);
  //const { id } = useParams();
  /*useEffect(() => {
    const fetchContadoresEncuestas = async () => {
      try {
        await csrf();
        const response = await axios.get(`/api/dashboard/contadores_encuestas`);
        setEncuestaData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContadoresEncuestas();
  }, []);*/
  //setLoading(false);
  console.log("log", data);

  if (loading) {
    return <Skeleton height={200} />;
    //return <div>Cargando...</div>;
  } else
    return (
      <PaperWrapper>
        <Grid
          container
          spacing={2}
          columns={6}
          display="flex"
          justifyContent="center"
          size="grow">
          <Grid
            item
            xs={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
            size="grow">
            <Typography variant="h4">Encuestas</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h3">{data.total_encuestas}</Typography>
            <Typography variant="subtitle1">Creadas</Typography>
          </Grid>
          <Grid
            item
            xs={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            size="grow">
            <Divider orientation="vertical" flexItem sx={{ opacity: 0.6 }} />
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h3">{data.publicadas}</Typography>
            <Typography variant="subtitle1">Publicadas</Typography>
          </Grid>
          <Grid
            item
            xs={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            size="grow">
            <Divider orientation="vertical" flexItem sx={{ opacity: 0.6 }} />
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h3">{data.borradores}</Typography>
            <Typography variant="subtitle1">Borradores</Typography>
          </Grid>
          <Grid item xs={6}>
            <Divider flexItem sx={{ opacity: 0.6 }} />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="h3">{data.modo_piloto}</Typography>
            <Typography variant="subtitle1">Pilotos</Typography>
          </Grid>
          <Grid
            item
            xs={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            size="grow">
            <Divider orientation="vertical" flexItem sx={{ opacity: 0.6 }} />
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h3">{data.privadas}</Typography>
            <Typography variant="subtitle1">Privadas</Typography>
          </Grid>
          <Grid
            item
            xs={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            size="grow">
            <Divider orientation="vertical" flexItem sx={{ opacity: 0.6 }} />
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h3">{data.anonimas}</Typography>
            <Typography variant="subtitle1">Anónimas</Typography>
          </Grid>
          <Grid item xs={6}>
            <Divider flexItem />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </PaperWrapper>
    );
};
