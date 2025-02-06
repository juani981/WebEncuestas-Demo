import React, { useEffect, useState } from "react";

import { TextTypeComponent } from "./QuestionTypes/TextTypeComponent";
import { RatingTypeComponent } from "./QuestionTypes/RatingTypeComponent";
import { ListTypeComponent } from "./QuestionTypes/ListTypeComponent";
import { MultipleChoiceTypeComponent } from "./QuestionTypes/MultipleChoiceTypeComponent";
import { UniqueChoiceTypeComponent } from "./QuestionTypes/UniqueChoiceTypeComponent";
import { NumericTypeComponent } from "./QuestionTypes/NumericTypeComponent";
import AddOptionsComponent from "./AddOptionsComponent";
import { Divider } from "@mui/material";

export const QuestionBodyComponent = ({
  question,
  setQuestions,
  questionIndex,
  answers = [],
  handleAnswerChange = {},
  handleQuestionChange = {},
  getReadOnlyFlag,
  getLabel,
  renderForQuestion,
}) => {
  const [renderFlag, setRenderFlag] = useState(false);
  const [errorObligatoria, seterrorObligatoria] = useState(false);

  useEffect(() => {
    //setRenderFlag(!renderFlag); // Trigger a re-render
  }, [question, renderFlag]);
  return (
    <>
      {question.type === "text" && (
        <TextTypeComponent
          question={question}
          handleAnswerChange={handleAnswerChange}
          //isreadOnly={getReadOnlyFlag()}
          isDisabled={renderForQuestion}
          isRequired={errorObligatoria}
        />
      )}
      {question.type === "numeric" && (
        <NumericTypeComponent
          question={question}
          handleAnswerChange={handleAnswerChange}
          isreadOnly={getReadOnlyFlag()}
          isDisabled={renderForQuestion}
        />
      )}
      {question.type === "rating" && (
        <RatingTypeComponent
          question={question}
          handleAnswerChange={handleAnswerChange}
          handleQuestionChange={handleQuestionChange}
          isreadOnly={getReadOnlyFlag()}
          renderForQuestion={renderForQuestion}
          isDisabled={renderForQuestion}
        />
      )}
      {question.type === "list" && (
        <ListTypeComponent
          question={question}
          setQuestions={setQuestions}
          renderFlag={renderFlag}
          setRenderFlag={setRenderFlag}
          answers={answers}
          renderForQuestion={renderForQuestion}
          handleAnswerChange={handleAnswerChange}
          label={getLabel(questionIndex)}
          isDisabled={renderForQuestion}
          isreadOnly={getReadOnlyFlag()}
        />
      )}
      {question.type === "multiple choice" && (
        <MultipleChoiceTypeComponent
          question={question}
          setQuestions={setQuestions}
          renderFlag={renderFlag}
          setRenderFlag={setRenderFlag}
          answers={answers}
          renderForQuestion={renderForQuestion}
          handleAnswerChange={handleAnswerChange}
          label={getLabel(questionIndex)}
          isDisabled={renderForQuestion}
          isreadOnly={getReadOnlyFlag()}
        />
      )}
      {question.type === "unique choice" && (
        <UniqueChoiceTypeComponent
          question={question}
          setQuestions={setQuestions}
          renderFlag={renderFlag}
          setRenderFlag={setRenderFlag}
          answers={answers}
          renderForQuestion={renderForQuestion}
          handleAnswerChange={handleAnswerChange}
          label={getLabel(questionIndex)}
          isDisabled={renderForQuestion}
          isreadOnly={getReadOnlyFlag()}
        />
      )}
      {["multiple choice", "unique choice", "list"].includes(question.type) &&
        renderForQuestion === true && (
          <AddOptionsComponent
            question={question}
            renderFlag={renderFlag}
            renderForQuestion={renderForQuestion}
            setRenderFlag={setRenderFlag}
            questionIndex={questionIndex}
            setQuestions={setQuestions}
          />
        )}
    </>
  );
};
