import { TextField } from "@mui/material";
import { useState, useEffect } from "react";

export const TextTypeComponent = ({
  question,
  handleAnswerChange,
  isDisabled,
  isRequired,
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

  /* useEffect(() => {
    validateField(value);
  }, [value]);*/

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
    <TextField
      label="Respuesta"
      fullWidth
      margin="normal"
      variant="outlined"
      required={question.required}
      disabled={isDisabled}
      error={error}
      helperText={error ? "Ésta pregunta es obligatoria" : ""}
      InputLabelProps={{
        shrink: true,
      }}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
