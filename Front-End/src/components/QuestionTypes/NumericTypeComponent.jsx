import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Any } from "react-spring";

export const NumericTypeComponent = ({
  question,
  handleAnswerChange,
  handleQuestionChange,
  isDisabled,
  renderForQuestion,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const validateField = (fieldValue) => {
    if (question.required && fieldValue.trim() === "") {
      setError(true);
    } else {
      setError(false);
    }
  };

  // useEffect(() => {
  //   validateField(value);
  // }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    validateField(newValue);
    handleAnswerChange(question.id, newValue);
  };

  const handleBlur = () => {
    validateField(value);
  };
  return (
    <>
      <TextField
        label="Respuesta"
        fullWidth
        margin="normal"
        variant="outlined"
        required={question.required}
        disabled={isDisabled}
        type="number"
        slotProps={{
          step: "any",
        }}
        error={error}
        helperText={error ? "Pregunta Obligatoria" : ""}
        InputLabelProps={{
          shrink: true,
        }}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </>
  );
};
