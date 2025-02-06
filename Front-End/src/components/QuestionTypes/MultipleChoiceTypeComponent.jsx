import { Label } from "@mui/icons-material";
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Grid,
  FormHelperText,
  FormGroup,
} from "@mui/material";
import { DeleteOptionComponent } from "../DeleteOptionComponent";
import React, { useEffect, useState } from "react";

export const MultipleChoiceTypeComponent = ({
  question,
  setQuestions,
  answers,
  renderFlag,
  setRenderFlag,
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
  const [updatedoptions, setupdatedoptions] = useState();
  const [error, seterror] = useState(false);

  /*useEffect(() => {
    validateField(currentOption);
  });*/
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
      setupdatedoptions(updatedOptions);
      return updatedOptions;
    });
  }, [question.options]);

  const handleCheckboxChange = (option) => {
    const selectedOptions = [...currentOption];
    const indexOfOption = selectedOptions.indexOf(option);

    if (indexOfOption === -1) {
      selectedOptions.push(option);
    } else {
      selectedOptions.splice(indexOfOption, 1);
    }

    setCurrentOption(selectedOptions);
    if (selectedOptions.length < 1 && question.required) {
      seterror(true);
      //setHelperText("Ésta pregunta es obligatoria");
    }
    handleAnswerChange(question.id, selectedOptions);
    validateField(selectedOptions);
  };
  const validateField = (fieldValue) => {
    if (question.required && fieldValue.length === 0) {
      seterror(true);
    } else {
      seterror(false);
    }
  };

  const handleBlur = () => {
    validateField(currentOption);
  };
  return (
    <FormControl
      fullWidth
      required={question.required}
      error={error}
      component="fieldset"
      margin="normal"
      key={question.id}
      //onChange={validateField(currentOption)}
    >
      <FormLabel>
        {isreadOnly ? "Elija una o más opciones" : "Cree sus opciones"}
      </FormLabel>
      {question.options.map((option, index) => (
        <FormGroup key={index}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            //sx={{ marginBottom: 1 }}
          >
            <Grid item>
              <FormControlLabel
                key={index}
                label={option}
                control={
                  <Checkbox
                    disabled={isDisabled}
                    checked={currentOption.includes(option)}
                    onChange={() => {
                      handleCheckboxChange(option);
                      //validateField(updatedoptions);
                    }}
                    onBlur={handleBlur}
                  />
                }
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
        </FormGroup>
      ))}
      <FormHelperText>{error && "Ésta pregunta es obligatoria"}</FormHelperText>
    </FormControl>
  );
};
