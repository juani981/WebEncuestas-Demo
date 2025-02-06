import { useState, useEffect } from "react";
import axios, { csrf } from "../../api/api";
import { Typography, Grid, Button, Box, styled, TableRow, Table, TableHead, TableCell, TableBody } from "@mui/material";
import { PaperWrapper } from "../../components/PaperWrapper";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import { InformeOpciones } from "./InformeOpciones";
import BasicPie from "./PlotPieChart";
import Barsfrequency from "./PlotBars";
import SimilBoxChart from "./PlotBoxChartFake";
import BasicGauge from "./PlotGauge";

const StyledTable = styled(Table)(({ theme }) => ({
  width: '90%',
  margin: '50px 0 0 50px',
  [theme.breakpoints.up('lg')]: {
    maxWidth: '1200px',
    margin: 'auto',
  },
}));

const THead = styled(TableRow)`
  & > th {
      font-size: 20px;
      background: #000000;
      color: #FFFFFF;
      text-align: center;
  }
`;

// const TRow = styled(TableRow)`
//   & > td {
//       font-size: 18px;
//       text-align: center;
//   }
// `;
const TRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '& > td': {
    fontSize: '18px',
    textAlign: 'center',
  }
}));

export const Informe = () => {
  const { idEncuesta, encuestadoId, hash } = useParams();
  const [informeData, setInformeData] = useState([]);
  const { user } = useAuth();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (!idEncuesta) return;
    const fetchInforme = async () => {
      try {
        await csrf();

        const requestData = encuestadoId && hash
          ? { encuestadoId: encuestadoId, hash: hash }
          : {};

        const response = await axios.post(`/api/encuestas/${idEncuesta}/informe`, requestData);

        setInformeData(response.data);
        setloading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchInforme();
  }, []);

  if (loading) {
    return <Loading open={loading} />;
  } else
    return (
      <Box sx={{ flexGrow: 1, maxWidth: 1600, padding: 2 }} margin="auto">
        <Grid container spacing={2} direction={{ xs: "column", sm: "row" }} alignItems="flex-start" justifyContent="center">
          {user && (
            <Grid
              item
              xs={12}
              sm={2}
              sx={{
                top: { sm: "20px" },
                display: "flex",
                justifyContent: "center",
                position: { xs: "static", sm: "sticky" },
              }}>
              <InformeOpciones />
            </Grid>
          )}
          <Grid item xs={12} sm={10}>
            <PaperWrapper>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                marginBottom={1}>
                Informe
              </Typography>
              <Typography variant="h4" component="h1" gutterBottom>
                {informeData.titulo_encuesta}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ ml: 2 }}>
                    <p>Días restantes: {informeData.dias_restantes}</p>
                    <p>Número de respuestas: {informeData.numero_respuestas}</p>
                    <p>Fecha del Informe: {informeData.fecha_informe}</p>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                  <BasicGauge value={informeData.ratio_respuestas.porcentaje} />
                  <Typography variant="subtitle2" color="textSecondary">
                    % Respuestas completas
                  </Typography>
                </Grid>
              </Grid>
              {informeData.preguntas && informeData.numero_respuestas > 0 ? (
                informeData.preguntas.map((pregunta, index) => (
                  <Grid
                    item
                    justifyContent="space-between"
                    alignItems="center"
                    key={index}
                  // xs={1}
                  >
                    <Typography variant="h5" component="h2" sx={{ mt: 4 }}>
                      {pregunta.titulo_pregunta}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
                      Pregunta del tipo {pregunta.tipo_pregunta}
                    </Typography>
                    {pregunta.tipo_pregunta === 'texto libre' && user && (
                      <Button variant="outlined" component={Link} to={`/respuestas_texto/${pregunta.id_pregunta}`} sx={{ mb: 2 }} >
                        ver respuestas de texto libre
                      </Button>
                    )}

                    <StyledTable>
                      <TableHead>
                        <THead>
                          <TableCell>Opción</TableCell>
                          <TableCell>Resultados</TableCell>
                          <TableCell>Porcentaje</TableCell>
                        </THead>
                      </TableHead>
                      <TableBody>
                        {pregunta.resultados.map((resultado, index) => (
                          <TRow key={index}>
                            <TableCell>{resultado.titulo_opcion}</TableCell>
                            <TableCell>{resultado.resultado_opcion}</TableCell>
                            <TableCell>{resultado.porcentaje}%</TableCell>
                          </TRow>
                        ))}
                      </TableBody>
                    </StyledTable>

                    <Grid container item xs={12} spacing={2} sx={{ width: '95%', margin: 'auto' }}>
                      {/* Primer tercio: Lista de estadísticas clave-valor sin graficos*/}
                      <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ mt: 3 }}>
                          Estadísticas:
                        </Typography>
                        <ul>
                          {Object.entries(pregunta.estadisticas).map(([key, value], index) => {
                            if (
                              key !== 'frecuencia_por_intervalos' &&
                              key !== 'palabras_mas_usadas' &&
                              key !== 'expresiones_mas_usadas' &&
                              key !== 'frecuencia_combinaciones'
                            ) {
                              if (key === 'cuartiles' && value) {
                                return (
                                  <li key={`${key}-${index}`}>
                                    {key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}: <strong>{value.join(', ')}</strong>
                                  </li>
                                );
                              } else {
                                return (
                                  <li key={`${key}-${index}`}>
                                    {key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}: <strong>{value ?? 'N/A'}</strong>
                                  </li>
                                );
                              }
                            }
                            return null; // Evitar renderizar un elemento vacío
                          })}
                        </ul>
                      </Grid>

                      {/* Segundo tercio: Gráfico 1 para cuartiles o palabras más usadas o MEJORES COMBINACIONES*/}
                      {pregunta.estadisticas.cuartiles ? (
                        <>
                          <Grid item xs={12} md={4}>
                            <SimilBoxChart
                              max={pregunta.estadisticas.maximo}
                              min={pregunta.estadisticas.minimo}
                              quantiles={pregunta.estadisticas.cuartiles}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Barsfrequency
                              data={pregunta.estadisticas.frecuencia_por_intervalos}
                              titulo={'Frecuencia'}
                              color={'#af7aa1'}
                            />
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item xs={12} md={4}>
                            {pregunta.estadisticas.palabras_mas_usadas && (
                              <Barsfrequency
                                data={pregunta.estadisticas.palabras_mas_usadas}
                                titulo={'Palabras más usadas'}
                                color={'#4e79a7'}
                              />
                            )}
                            {!pregunta.estadisticas.palabras_mas_usadas && pregunta.estadisticas.frecuencia_por_intervalos && (
                              <Barsfrequency data={pregunta.estadisticas.frecuencia_por_intervalos}
                                titulo={'Frecuencia'}
                                color={'#4e79a7'}
                              />
                            )}
                          </Grid>
                          {/* Tercer tercio: Gráfico 2 para frecuencias o expresiones más usadas */}
                          <Grid item xs={12} md={4} >
                            {pregunta.estadisticas.expresiones_mas_usadas && (
                              <Barsfrequency data={pregunta.estadisticas.expresiones_mas_usadas}
                                titulo={'Expresiones más usadas'}
                                color={'#76b7b2'}
                              />
                            )}
                            {!pregunta.estadisticas.expresiones_mas_usadas && pregunta.estadisticas.frecuencia_combinaciones && (
                              <BasicPie data={pregunta.estadisticas.frecuencia_combinaciones} />
                            )}
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
                  (No hay respuestas disponibles)
                </Typography>
              )}
            </PaperWrapper>
          </Grid>
        </Grid>
      </Box>
    );
};
