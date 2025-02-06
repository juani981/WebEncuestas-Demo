import React, { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export const RequiredQuestionComponent = ({ question, setQuestions }) => {
  const [required, setRequired] = useState(question.required || false);
  const handleChange = (event) => {
    const isChecked = event.target.checked;
    setRequired(isChecked);
    console.log("es_obligatoria:", isChecked);
    // Update the question's required property directly with the event value
    question.required = isChecked;

    // Update the questions state to trigger re-render if needed
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.order_index === question.order_index
          ? { ...q, required: isChecked }
          : q
      )
    );
  };

  return (
    <FormControlLabel
      //required
      control={<Checkbox checked={required} onChange={handleChange} />}
      label="Marcar como Obligatoria"
      labelPlacement="bottom"
      sx={{
        "& .MuiFormControlLabel-label": {
          textAlign: "center",
        },
      }}
    />
  );
};
