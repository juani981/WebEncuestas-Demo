import { Button, IconButton } from "@mui/material";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

export const DeleteOptionComponent = ({
  renderFlag,
  setRenderFlag,
  question,
  setQuestions,
  option,
  renderForQuestion = true,
}) => {
  const handleDeleteOption = () => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.order_index === question.order_index
          ? {
              ...q,
              options: q.options.filter((item, index) => index !== option),
            }
          : q
      )
    );
    console.log(question.options);
    setRenderFlag(!renderFlag);
  };
  if (renderForQuestion)
    return (
      <IconButton
        aria-label="Borrar Opción"
        color="error"
        onClick={handleDeleteOption}>
        <IndeterminateCheckBoxIcon color="error" />
      </IconButton>
    );
};
