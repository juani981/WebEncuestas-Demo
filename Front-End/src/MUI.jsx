import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Fab,
  Menu,
  MenuItem,
  Radio,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  InputLabel,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// ... (importaciones)

const SurveyForm = () => {
    const [questions, setQuestions] = useState([]);
    const [showFirstQuestion, setShowFirstQuestion] = useState(false);
    const [answers, setAnswers] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
  
    const handleAnswerChange = (questionId, answer) => {
        setAnswers((prevAnswers) => {
          const updatedAnswers = { ...prevAnswers };
          const question = questions.find((q) => q.id.toString() === questionId);
      
          if (question && question.type === 'select') {
            updatedAnswers[questionId] = answer || ''; // Tomar el valor seleccionado o cadena vacía si no hay selección
          } else {
            updatedAnswers[questionId] = answer;
          }
      
          // Cierra manualmente el menú de selección al elegir una opción
          const selectElement = document.getElementById(`select-${questionId}`);
          if (selectElement) {
            selectElement.blur();
          }
      
          return updatedAnswers;
        });
      };
      
      
  
    const handleTypeMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleTypeMenuItemClick = (type) => {
      setAnchorEl(null);
      const newQuestionId = questions.length + 1;
      let newQuestion;
      if (type === 'text') {
        newQuestion = {
          id: newQuestionId,
          label: `Pregunta ${newQuestionId}`,
          type: 'text',
        };
      } else if (type === 'choice' || type === 'radio') {
        newQuestion = {
          id: newQuestionId,
          label: `Pregunta ${newQuestionId}`,
          type: type,
          options: ['Opción 1', 'Opción 2', 'Opción 3'],
        };
      } else if (type === 'select') {
        newQuestion = {
          id: newQuestionId,
          label: `Pregunta ${newQuestionId}`,
          type: 'select',
          options: ['Opción 1', 'Opción 2', 'Opción 3'],
        };
      } else if (type === 'calendar') {
        newQuestion = {
          id: newQuestionId,
          label: `Pregunta ${newQuestionId}`,
          type: 'calendar',
        };
      }
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
      setShowFirstQuestion(true);
    };
  
    const handleSubmit = () => {
      // Modificar el manejo de respuestas para preguntas de tipo 'choice'
      const updatedAnswers = {};
      Object.keys(answers).forEach((questionId) => {
        const question = questions.find((q) => q.id.toString() === questionId);
        if (question && ['choice', 'select'].includes(question.type)) {
          updatedAnswers[questionId] = answers[questionId] || []; // Tomar el array de opciones seleccionadas o un array vacío
        } else {
          updatedAnswers[questionId] = answers[questionId];
        }
      });
  
      console.log('Respuestas enviadas:', updatedAnswers);
    };
  
    return (
      <Container component="main" maxWidth="md">
        <Paper
          elevation={3}
          style={{
            padding: 20,
            marginTop: 50,
            position: 'relative',
            width: 400,
            margin: 'auto',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Formulario de Encuesta
          </Typography>
  
          {showFirstQuestion && (
            <Grid container spacing={2}>
              {questions.map((question) => (
                <Grid item xs={12} key={question.id}>
                  {question.type === 'text' && (
                    <TextField
                      label={question.label}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                  )}
                  {['choice', 'radio'].includes(question.type) && (
                    <FormControl component="fieldset" margin="normal">
                      <FormLabel>{question.label}</FormLabel>
                      {question.options.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            question.type === 'choice' ? (
                              <Checkbox
                                checked={answers[question.id]?.includes(option) || false}
                                onChange={() => {
                                  const selectedOptions = answers[question.id] || [];
                                  const updatedOptions = selectedOptions.includes(option)
                                    ? selectedOptions.filter((o) => o !== option)
                                    : [...selectedOptions, option];
                                  handleAnswerChange(question.id, updatedOptions);
                                }}
                              />
                            ) : (
                              <Radio
                                checked={answers[question.id] === option}
                                onChange={() => handleAnswerChange(question.id, option)}
                              />
                            )
                          }
                          label={option}
                        />
                      ))}
                    </FormControl>
                  )}
                  {question.type === 'select' && (
  <FormControl fullWidth margin="normal">
    <InputLabel>{question.label}</InputLabel>
    <Select
      value={answers[question.id] || ''}
      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
      autoWidth  // Añadir la prop autoWidth
    >
      {question.options.map((option, index) => (
        <MenuItem key={index} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}

                  {question.type === 'calendar' && (
                    <TextField
                      label={question.label}
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          )}
  
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Enviar Respuestas
          </Button>
  
          <Fab
            color="primary"
            aria-label="add"
            style={{
              position: 'absolute',
              bottom: 55,
              right: 16,
            }}
            onClick={handleTypeMenuOpen}
          >
            <AddIcon />
          </Fab>
  
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleTypeMenuItemClick('text')}>Texto</MenuItem>
            <MenuItem onClick={() => handleTypeMenuItemClick('choice')}>Elección Múltiple</MenuItem>
            <MenuItem onClick={() => handleTypeMenuItemClick('radio')}>Radio</MenuItem>
            <MenuItem onClick={() => handleTypeMenuItemClick('select')}>Seleccionar</MenuItem>
            <MenuItem onClick={() => handleTypeMenuItemClick('calendar')}>Calendario</MenuItem>
          </Menu>
        </Paper>
      </Container>
    );
  };
  
  export default SurveyForm;
  