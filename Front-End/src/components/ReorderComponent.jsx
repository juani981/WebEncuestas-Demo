import React from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import IconButton from "@mui/material/IconButton";

export const ReorderComponent = ({
  QuestionIndex,
  questionsHook,
  setQuestionsHook,
}) => {
  const handleMoveQuestion = (index, direction) => {
    // const index = questionsHook.findIndex(
    //   (question) => index === index
    // );

    if (index === -1) {
      console.error(`Question with ID ${index} not found.`);
      return;
    }

    // Check if the question can be moved further in the specified direction
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questionsHook.length)
    ) {
      console.error("Cannot move question further.");
      return;
    }
    const newIndex = direction === "up" ? index - 1 : index + 1;

    const newQuestions = [...questionsHook];
    [newQuestions[index], newQuestions[newIndex]] = [
      newQuestions[newIndex],
      newQuestions[index],
    ];
    // [newQuestions[index].order_index, newQuestions[newIndex].order_index] = [
    //   newQuestions[newIndex].order_index,
    //   newQuestions[index].order_index,
    // ];

    setQuestionsHook(newQuestions);
  };

  return (
    <>
      {QuestionIndex > 0 && (
        <>
          <IconButton
            aria-label="Mover Arriba"
            color="primary"
            onClick={() => handleMoveQuestion(QuestionIndex, "up")}>
            <KeyboardArrowUpIcon />
          </IconButton>
          Mover Arriba
        </>
      )}

      {QuestionIndex < questionsHook.length - 1 && (
        <>
          <IconButton
            aria-label="Mover Abajo"
            color="primary"
            onClick={() => handleMoveQuestion(QuestionIndex, "down")}>
            <KeyboardArrowDownIcon />
          </IconButton>
          Mover Abajo
        </>
      )}
    </>
  );
};
