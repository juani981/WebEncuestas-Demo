import { Label } from "@mui/icons-material";
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  Grid,
  FormHelperText,
} from "@mui/material";
import { DeleteOptionComponent } from "../DeleteOptionComponent";
import React, { useEffect, useState } from "react";

export const UniqueChoiceTypeComponent = ({
  question,
  setQuestions,
  renderFlag,
  setRenderFlag,
  answers,
  handleAnswerChange,
  isDisabled,
  isreadOnly,
  label,
}) => {
  const selectedAnswer = answers.find(
    (answer) => answer.id_pregunta === question.id
  );
  const [currentOption, setCurrentOption] = useState(
    selectedAnswer ? selectedAnswer.options : []
  );
  const [options, setoptions] = useState([question.options]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setCurrentOption(selectedAnswer ? selectedAnswer.options : []);
  }, [selectedAnswer]);

  // Añadir useEffect para monitorear cambios en question.options
  useEffect(() => {
    // Actualizar currentOption cuando question.options cambie
    setCurrentOption((prevOptions) => {
      // Mantener opciones previas seleccionadas
      const updatedOptions = prevOptions.filter((option) =>
        question.options.includes(option)
      );
      return updatedOptions;
    });
  }, [question]);

  const handleCheckboxChange = (option) => {
    setCurrentOption(option);
    if (!currentOption) {
      seterror(true);
    }
    handleAnswerChange(question.id, option);
  };
  const validateField = (fieldValue) => {
    if (question.required && fieldValue.trim() === "") {
      setError(true);
    } else {
      setError(false);
    }
  };
  return (
    <FormControl
      component="fieldset"
      margin="normal"
      fullWidth
      //required={question.required ? true : false}
      required={question.required}
      error={error}
      helperText={error && "Ésta pregunta es obligatoria"}>
      <FormLabel>
        {isreadOnly ? "Elija una opción" : "Cree sus opciones"}
      </FormLabel>
      {question.options.map((option, index) => (
        <Grid
          container
          key={index}
          alignItems="center"
          justifyContent="space-between"
          //sx={{ marginBottom: 1 }}
        >
          <Grid item>
            <FormControlLabel
              label={option}
              control={
                question.type === "unique choice" && (
                  <Radio
                    disabled={isDisabled}
                    checked={currentOption === option}
                    onChange={() => {
                      handleCheckboxChange(option);
                      validateField(currentOption);
                      console.log(question);
                    }}
                  />
                )
              }
              sx={{ marginRight: 2 }}
            />
          </Grid>
          {!isreadOnly && (
            <Grid item>
              <DeleteOptionComponent
                question={question}
                setQuestions={setQuestions}
                option={index}
                renderFlag={renderFlag}
                setRenderFlag={setRenderFlag}
              />
            </Grid>
          )}
        </Grid>
      ))}
      <FormHelperText>{error && "Ésta pregunta es obligatoria"}</FormHelperText>
    </FormControl>
  );
};
