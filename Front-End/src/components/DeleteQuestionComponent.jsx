import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export const DeleteQuestionComponent = ({
  question,
  setQuestions,
  onDelete,
  deleteAnimation,
  deletedQuestions,
  setDeletedQuestions,
}) => {
  const handleDeleteQuestion = () => {
    const identifierToDelete = question.id || question.order_index;
    deleteAnimation(identifierToDelete);
    // Add a small delay before calling the delete logic
    setTimeout(() => {
      onDelete(identifierToDelete); // Proceed with the delete logic after animation
    }, 300); // Adjust the timeout duration to match your animation length
  };

  return (
    <IconButton
      aria-label="Borrar Pregunta"
      color="error"
      onClick={handleDeleteQuestion}>
      <DeleteIcon />
    </IconButton>
  );
};
