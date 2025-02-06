import Grid from "@mui/material/Unstable_Grid2";
import { PaperWrapper } from "../components/PaperWrapper";
import { ContadoresEncuestas } from "../components/DashBoard/ContadoresEncuestas";
import { TopEncuestas } from "../components/DashBoard/TopEncuestas";
import { RatioRespuestas } from "../components/DashBoard/RatioRespuestas";
import Novedades from "../components/DashBoard/Novedades";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios, { csrf } from "../api/api";

export const Dashboard = () => {
  const { user } = useAuth();
  const [encuestaData, setEncuestaData] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingDashboard, setloadingDashboard] = useState(true);
  useEffect(() => {
    const fetchTopEncuestas = async () => {
      try {
        await csrf();
        const response = await axios.get(`api/dashboard/informes`);
        console.log(response.data);
        setEncuestaData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTopEncuestas();
  }, [user]);
  //console.log("contadores_encuestas", encuestaData["contadores_encuestas"]);
  //console.log("novedades_encuestas", encuestaData["novedades_encuestas"]);
  //console.log("ratio_respuestas", encuestaData["ratio_respuestas"]);
  //console.log("top_respondidas", encuestaData["top_respondidas"]);
  //if (!loading) {
  return (
    user && (
      <>
        <Grid container spacing={{ xs: 2, md: 4, lg: 5 }} margin={0} padding={0}>
          <Grid xs={12} lg={4}>
            <ContadoresEncuestas
              data={encuestaData["contadores_encuestas"]}
              loading={loading}
            />
          </Grid>
          <Grid xs={12} lg={8}>
            <TopEncuestas
              data={encuestaData["top_respondidas"]}
              loading={loading}
            />
          </Grid>
          <Grid xs={12} lg={6}>
            <Novedades
              data={encuestaData["novedades_encuestas"]}
              loading={loading}
            />
          </Grid>
          <Grid xs={12} lg={6}>
            <RatioRespuestas
              data={encuestaData["ratio_respuestas"]}
              loading={loading}
            />
          </Grid>
        </Grid>
      </>
    )
  );
  //}
};
