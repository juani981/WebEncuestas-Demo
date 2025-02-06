import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import { SaveSurveyComponent } from "../../components/SaveSurveyComponent";
import AddQuestionComponent from "../../components/AddQuestionComponent";
import { QuestionIteratorComponent } from "../../components/QuestionIteratorComponent";
import { mapper } from "../../helpers/mapper";
import { preguntaMap } from "../../helpers/maps";
import axios, { csrf, deleteFromDataBase } from "../../api/api";
import { postPreguntas } from "../../helpers/apiPost";
import Loading from "../../components/Loading";

const QuestionsCreatorComponent = ({ encuestaId, triggerFormSubmit }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [deletionQueue, setDeletionQueue] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!encuestaId) return;
    const fetchPreguntas = async () => {
      try {
        await csrf();
        const response = await axios.get(
          `/api/encuestas/${encuestaId}/preguntas`
        );
        console.log("preguntas Creadas: ", response.data);
        const mappedQuestions = mapper.map(response.data, preguntaMap);
        setQuestions(mappedQuestions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreguntas();
  }, [encuestaId]);

  const addToDeletionQueue = (itemId) => {
    setDeletionQueue((prevQueue) => [...prevQueue, itemId]);
  };
  const handleDeleteQuestion = (identifier) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter(
        (question) => (question.id || question.order_index) !== identifier
      )
    );

    if (typeof identifier === "number") {
      addToDeletionQueue(identifier);
      console.log("borrar:" + deletionQueue);
    }
  };
  const handleQueueDeletions = async () => {
    try {
      if (deletionQueue.length > 0) {
        deletionQueue.forEach((PreguntaId) => {
          deleteFromDataBase(`preguntas`, PreguntaId);
          //axios.delete(`/api/preguntas/${PreguntaId}`);
        });
        setDeletionQueue([]);
      }
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };
  const handleSavetoDB = async (event, publicar = false) => {
    event.preventDefault();

    // Llama a la función para simular el clic en el botón de guardar del SurveyForm
    triggerFormSubmit();

    handleQueueDeletions();
    console.log("Guardando Preguntas: ", questions);

    try {
      await postPreguntas(encuestaId, questions);
      console.log("Enviadas: ", questions);
      if (publicar) {
        navigate(`/encuesta/${encuestaId}/preview`);
      } else {
        navigate("/encuesta");
      }
    } catch (error) {
      console.error("Error saving questions:", error);
    }
  };

  if (loading) {
    return <Loading open={loading} />;
  }

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Creación de Preguntas
      </Typography>

      <QuestionIteratorComponent
        questions={questions}
        answers={answers}
        setQuestions={setQuestions}
        setAnswers={setAnswers}
        renderForQuestion={true}
        onDeleteQuestion={handleDeleteQuestion}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          gap: 2,
          flexDirection: "column",
          maxWidth: "100%",
          width: "100%",
        }}>
        <AddQuestionComponent
          questions={questions}
          setQuestions={setQuestions}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
            mb: 4,
          }}>
          <Button
            variant="contained"
            color="error"
            component={Link}
            to={"/encuesta"}>
            Cancelar
          </Button>
          <SaveSurveyComponent handleSubmit={handleSavetoDB} />
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => handleSavetoDB(event, true)}>
            Publicar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default QuestionsCreatorComponent;
