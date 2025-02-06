import {
  Container,
  Paper,
  Typography,
  Button,
  darken,
  TextField,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import { mapper } from "../../helpers/mapper";
import { preguntaMap, respuestaMap } from "../../helpers/maps";
import { QuestionIteratorComponent } from "../../components/QuestionIteratorComponent";
import { postRespuestas } from "../../helpers/apiPost";
import axios, { csrf } from "../../api/api";
import Loading from "../../components/Loading";
import { PaperWrapper } from "../../components/PaperWrapper";
// import { toast } from "react-toastify";

const AnswersSubmitComponent = ({
  encuestaId,
  correo = null,
  esPiloto = false,
}) => {
  const [currentAnswer, setcurrentAnswer] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [comentarios, setComentarios] = useState("");
  const [loading, setLoading] = useState(true);
  /*const [answers, setAnswers] = useState([
    {
      id_pregunta: "",
      id_encuesta: idEncuesta,
      id_encuestado: "",
      options: [],
      score: "",
      text_entry: "",
    },
  ]);*/
  //A refactorizar
  //const [encuestaData, setEncuestaData] = useState({});

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        await csrf();
        const response = await axios.get(
          `/api/encuestas/${encuestaId}/preguntas`
        );
        const mappedQuestions = mapper.map(response.data, preguntaMap);
        setQuestions(mappedQuestions);
        console.log(questions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreguntas();
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    // Find the question corresponding to the questionId
    const question = questions.find((item) => item.id === questionId);
    if (question) {
      // Create a new answer object with the question and answer
      //const newAnswer = { answer };
      const thisAnswer = {
        id_pregunta: question.id,
        id_encuesta: encuestaId,
        options: null,
        score: null,
        text_entry: null,
        numeric: null,
      };
      if (
        ["multiple choice", "list", "unique choice"].includes(question.type)
      ) {
        thisAnswer.options = answer;
      } else if (question.type === "text") {
        thisAnswer.text_entry = answer;
      } else if (question.type === "rating") {
        thisAnswer.score = answer;
      } else if (question.type === "numeric") {
        thisAnswer.numeric = answer;
      }
      // Update the answers array with the new answer
      console.log(thisAnswer);
      // Update the answers array with the new answer or update existing answer
      setAnswers((prevAnswers) => {
        const existingAnswerIndex = prevAnswers.findIndex(
          (item) => item.id_pregunta === questionId
        );
        if (existingAnswerIndex !== -1) {
          // Update existing answer
          prevAnswers[existingAnswerIndex] = {
            ...prevAnswers[existingAnswerIndex],
            ...thisAnswer,
          };
          return [...prevAnswers];
        } else {
          // Add new answer
          return [...prevAnswers, thisAnswer];
        }
      });
      console.log(answers);
      //return thisAnswer;
    } else {
      // Manejar el caso en el que no se encuentra la pregunta
      console.error(`Pregunta con ID ${questionId} no encontrada.`);
      return null;
    } // o algún valor por defecto
  };

  const handleSaveToDatabase = async (event) => {
    try {
      event.preventDefault();
      await postRespuestas(encuestaId, correo, comentarios, answers);
      // toast.success("Se envió su respuesta!", {
      //   onClose: () => window.location.reload(),
      // });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loading open={loading} />;
  } else
    return (
      <Container component="main" maxWidth="md">
        {/* <Typography variant="h4" align="center" gutterBottom>
          Responder una Encuesta
        </Typography> */}
        <QuestionIteratorComponent
          questions={questions}
          answers={answers}
          setQuestions={setQuestions}
          setAnswers={setAnswers}
          renderForQuestion={false}
          handleAnswerChange={handleAnswerChange}></QuestionIteratorComponent>
        {esPiloto && (
          <PaperWrapper>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              marginBottom={1}>
              Comentenos sobre esta encuesta
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Comentarios"
              multiline
              minRows={2}
              value={comentarios}
              onChange={(e) => {
                setComentarios(e.target.value);
              }}
              placeholder="Escribe alguna crítica o sugerencias para poder mejorar nuestras encuestas. Gracias por responder!"
            />
          </PaperWrapper>
        )}
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleSaveToDatabase}>
            Enviar Respuestas
          </Button>
        </Box>
      </Container>
    );
};
export default AnswersSubmitComponent;
