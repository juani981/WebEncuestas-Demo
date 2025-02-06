import { TextField } from "@mui/material";
import { useState } from "react";

export const QuestionTitleComponent = ({
  questions,
  question,
  index,
  isReadOnly,
  //handleTitleChange = () => {},
}) => {
  const [error, setError] = useState(false);

  const handleTitleChange = (questionIndex, title) => {
    const trimmedTitle = title.trim();
    if (trimmedTitle === "") {
      setError(true);
    } else {
      setError(false);
    }
    const question = questions.find(
      (item) => item.order_index === questionIndex
    );
    if (question) {
      question.title = trimmedTitle;
      return question.title;
    } else {
      console.error(`Pregunta con index ${questionIndex} no encontrada.`);
      return null;
    }
  };
  return (
    <>
      <TextField
        label={`Pregunta ${index + 1}`}
        defaultValue={question.title}
        fullWidth
        margin="normal"
        variant="standard"
        error={error}
        helperText={
          error ? "El título no puede quedar vacío" : "Título de la pregunta"
        }
        InputProps={{
          readOnly: isReadOnly,
        }}
        InputLabelProps={{
          shrink: true,
        }}
        // onChange={(e) =>
        //   handleTitleChange
        //     ? handleTitleChange(question.order_index, e.target.value)
        //     : null
        // }
        onChange={(e) =>
          handleTitleChange(question.order_index, e.target.value)
        }
      />
    </>
  );
};
