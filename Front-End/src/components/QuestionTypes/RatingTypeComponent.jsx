import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { TextField, Grid } from "@mui/material";

function valuetext(value) {
  return `${value}`;
}
function createArrayOfObjectsWithStep(min, max, step) {
  const result = [];
  min = parseInt(min);
  max = parseInt(max);
  step = parseInt(step);
  for (let i = min; i <= max; i += step) {
    const obj = {
      value: i,
      label: `${i}`,
    };
    result.push(obj);
  }

  return result;
}

export const RatingTypeComponent = ({
  question,
  handleAnswerChange,
  handleQuestionChange,
  isDisabled,
  isreadOnly,
  renderForQuestion,
}) => {
  const [minError, setMinError] = useState(false);
  const [minErrorMessage, setminErrorMessage] = useState();
  const [maxError, setMaxError] = useState(false);
  const [maxErrorMessage, setmaxErrorMessage] = useState();
  const [stepError, setStepError] = useState(false);
  const [stepErrorMessage, setstepErrorMessage] = useState();
  const [minValue, setMinValue] = useState(
    question.range[0] ? question.range[0] : 1
  );
  const [maxValue, setMaxValue] = useState(
    question.range[1] ? question.range[1] : 5
  );
  const [stepValue, setStepValue] = useState(
    question.range[2] ? question.range[2] : 1
  );
  question.range = [minValue, maxValue, stepValue];
  const marksArray = createArrayOfObjectsWithStep(
    minValue,
    maxValue,
    stepValue
  );

  const validateField = (fieldValue, error, setError, setmessage) => {
    let message;
    setError(false);
    if (typeof fieldValue !== "string") {
      fieldValue = fieldValue.toString();
    }
    if (fieldValue.trim() === "") {
      setError(true);
      message = "Este campo es requerido";
      setmessage(message);
    }
    if (fieldValue < 0) {
      setError(true);
      message = "El valor debe ser positivo";
      setmessage(message);
    }
    if (fieldValue === minValue && minValue > maxValue) {
      setError(true);
      message = "El valor minimo debe ser menor al valor maximo";
      setmessage(message);
    }
  };
  const handleMinChange = (e) => {
    validateField(e.target.value, minError, setMinError, setminErrorMessage);
    setMinValue(e.target.value);
    const updatedRange = [...question.range];
    updatedRange[0] = e.target.value;
    const updatedQuestion = { ...question }; //, range: updatedRange };
    updatedQuestion.range[0] = updatedRange[0];
    handleQuestionChange(question.id, updatedQuestion);
  };

  const handleMaxChange = (e) => {
    validateField(e.target.value, maxError, setMaxError, setmaxErrorMessage);
    setMaxValue(e.target.value);
    const updatedRange = [...question.range];
    updatedRange[1] = e.target.value;
    const updatedQuestion = { ...question }; //, range: updatedRange };
    updatedQuestion.range[1] = updatedRange[1];
    handleQuestionChange(question.id, updatedQuestion);
  };

  const handleStepChange = (e) => {
    validateField(e.target.value, stepError, setStepError, setstepErrorMessage);
    stepError ? setStepValue(1) : setStepValue(e.target.value);
    //setStepValue(e.target.value);
    const updatedRange = [...question.range];
    updatedRange[2] = e.target.value;
    const updatedQuestion = { ...question }; //, range: updatedRange };
    updatedQuestion.range[2] = updatedRange[2];
    handleQuestionChange(question.id, updatedQuestion);
  };

  /*useEffect(() => {
    validateField(minValue, minError, setMinError, setminErrorMessage);
    validateField(maxValue, maxError, setMaxError, setmaxErrorMessage);
    validateField(stepValue, stepError, setStepError, setstepErrorMessage);
  }, [minValue, maxValue, stepValue]);*/

  return !renderForQuestion ? (
    <Slider
      aria-label="Puntuación"
      defaultValue={Math.ceil(
        (question.range[1] / question.range[2]) * question.range[2]
      )}
      getAriaValueText={valuetext}
      valueLabelDisplay="auto"
      step={parseInt(question.range[2])}
      marks={marksArray}
      min={parseInt(question.range[0])}
      max={parseInt(question.range[1])}
      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
      readOnly={isreadOnly}
      required={question.required}
    />
  ) : (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Mínimo"
            fullWidth
            margin="normal"
            variant="outlined"
            value={minValue}
            error={minError}
            helperText={minError && minErrorMessage}
            //defaultValue={1}
            onChange={handleMinChange}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: isreadOnly,
            }}
            inputProps={{
              step: stepValue,
              max: parseInt(maxValue) - parseInt(stepValue),
              min: 0,
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Paso"
            fullWidth
            margin="normal"
            variant="outlined"
            value={stepValue}
            error={stepError}
            helperText={stepError && stepErrorMessage}
            //defaultValue={1}
            onChange={handleStepChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: isreadOnly,
            }}
            inputProps={{
              step: stepValue,
              min: 1,
              max: parseInt(maxValue) - parseInt(stepValue), //maxValue - minValue,
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Máximo"
            fullWidth
            margin="normal"
            variant="outlined"
            value={maxValue}
            error={maxError}
            helperText={maxError && maxErrorMessage}
            //defaultValue={5}
            onChange={handleMaxChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: isreadOnly,
            }}
            inputProps={{
              step: stepValue,
              min: parseInt(minValue) + parseInt(stepValue),
              max: 100,
            }}
          />
        </Grid>
      </Grid>
      <Slider
        aria-label="Puntuación"
        defaultValue={Math.ceil((maxValue - minValue) / 2)}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={parseInt(stepValue)}
        marks={marksArray}
        min={parseInt(minValue)}
        max={parseInt(maxValue)}
        //onChange={(e) => handleAnswerChange(question.id, e.target.value)}
        disabled={isDisabled}
      />
    </>
  );
};
