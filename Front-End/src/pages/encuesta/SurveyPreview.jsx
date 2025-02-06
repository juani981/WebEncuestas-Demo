import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import { SaveSurveyComponent } from "../../components/SaveSurveyComponent";
import { QuestionIteratorComponent } from "../../components/QuestionIteratorComponent";
import { mapper } from "../../helpers/mapper";
import { preguntaMap, respuestaMap } from "../../helpers/maps";
import axios, { csrf } from "../../api/api";
import { postPreguntas } from "../../helpers/apiPost";
import { useParams } from "react-router-dom";
import { PaperWrapper } from "../../components/PaperWrapper";
import { QuestionTitleComponent } from "../../components/QuestionTitleComponent";
import { QuestionBodyComponent } from "../../components/QuestionBodyComponent";
import Loading from "../../components/Loading";
import { SurveyProperties } from "./SurveyProperties";

export const SurveyPreviewComponent = (renderForQuestion = true) => {
  const { idEncuesta } = useParams();
  const [questions, setQuestions] = useState([]);
  const [encuestaData, setEncuestaData] = useState([]);
  const buttonRef = useRef(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (!idEncuesta) return;
    const fetchPreguntas = async () => {
      try {
        await csrf();
        const response = await axios.get(
          `/api/encuestas/${idEncuesta}/preguntas`
        );
        const response2 = await axios.get(`/api/encuestas/${idEncuesta}/edit`);
        setEncuestaData(response2.data);
        const mappedQuestions = mapper.map(response.data, preguntaMap);
        setQuestions(mappedQuestions);
      } catch (error) {
        console.error(error);
        // toast.error("Ha ocurrido un error.", {
        //   onClose: () => navigate('/encuesta')
        // });
      } finally {
        setloading(false);
      }
    };
    fetchPreguntas();
  }, []);
  const getLabel = (questionIndex) => {
    var label = "";
    if (renderForQuestion === true) {
      label = `Pregunta${questionIndex}`;
    } else {
      label = "Respuesta";
    }
    return label;
  };
  const getReadOnlyFlag = () => {
    if (renderForQuestion) {
      // Default to read-only when rendering questions
      return true;
    } else {
      // Allow editing of answers when rendering answers
      return false;
    }
  };

  if (loading) {
    return <Loading open={loading} />;
    // return <div>Cargando...</div>;
  } else
    return (
      <Box sx={{ flexGrow: 1, maxWidth: 1600, padding: 2 }} margin="auto">
        <Grid
          container
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems="flex-start">
          <Grid
            item
            xs={12}
            sm={3}
            sx={{
              top: { sm: "20px" },
              display: "flex",
              justifyContent: "center",
              position: { xs: "static", sm: "sticky" },
            }}>
            <SurveyProperties encuestaData={encuestaData} />
          </Grid>
          <Grid item xs={12} sm={9}>
            <PaperWrapper>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                marginBottom={1}>
                Previsualización
              </Typography>
              <Typography variant="h4" component="h1" gutterBottom>
                {encuestaData.titulo_encuesta}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  padding: 2,
                  fontSize: "1.3rem",
                  fontStyle: "italic",
                  display: "block",
                }}>
                {encuestaData.descripcion}
              </Typography>
              {questions.map((question, index) => (
                <Grid
                  item
                  justifyContent="space-between"
                  alignItems="center"
                  key={index}
                  // xs={1}
                >
                  <QuestionTitleComponent
                    key={question.order_index}
                    question={question}
                    isReadOnly={true}
                    index={index}
                  />
                  <QuestionBodyComponent
                    question={question}
                    questionIndex={question.order_index}
                    getReadOnlyFlag={getReadOnlyFlag}
                    getLabel={getLabel}
                    renderForQuestion={renderForQuestion}
                    isDisabled={true}
                  />
                </Grid>
              ))}
            </PaperWrapper>
          </Grid>
          {/* <Grid
          style={{ width: "50vw", margin: "auto" }}
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center">
          <Grid container alignContent="center">
            <Grid item xs={12} sm={12} md={4}>
              <Button
                variant="contained"
                color="error"
                component={Link}
                to={"/encuesta"}>
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button variant="contained" color="primary" disabled={true}>
                Guardar Borrador
              </Button>
            </Grid>
          </Grid>
        </Grid> */}
        </Grid>
      </Box>
    );
};
