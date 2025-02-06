import React, { useState, useCallback, useEffect, useRef } from "react";
import { Divider, Grid } from "@mui/material";
import { Typography } from "@mui/joy";
import { PaperWrapper } from "./PaperWrapper";
import { DeleteQuestionComponent } from "./DeleteQuestionComponent";
import { QuestionBodyComponent } from "./QuestionBodyComponent";
import { RequiredQuestionComponent } from "./RequiredQuestionComponent";
import { ReorderComponent } from "./ReorderComponent";
import { useSprings, animated, config } from "react-spring";
import { QuestionTitleComponent } from "./QuestionTitleComponent";

export const QuestionIteratorComponent = ({
  questions,
  answers,
  setQuestions,
  renderForQuestion,
  handleAnswerChange = () => {},
  onDeleteQuestion,
}) => {
  const [errors] = useState({});
  const [deletedQuestionId, setDeletedQuestionId] = useState(null);
  // const [animationPhase, setAnimationPhase] = useState(0);
  // const [deletedIndex, setDeletedIndex] = useState(-1);
  // const itemHeights = useRef({});
  const [deletedIdentifier, setDeletedIdentifier] = useState(null);

  const getLabel = (questionIndex) => {
    return renderForQuestion ? `Pregunta ${questionIndex}` : "Respuesta";
  };

  const getReadOnlyFlag = () => {
    return !renderForQuestion;
  };

  const handleQuestionChange = (questionId, updatedQuestion) => {
    setQuestions(
      questions.map((question) =>
        question.order_index === questionId ? updatedQuestion : question
      )
    );
  };

  // const measureHeight = (el, questionId) => {
  //   if (el) {
  //     itemHeights.current[questionId] = el.getBoundingClientRect().height;
  //   }
  // };

  const handleDeleteAnimation = (identifier) => {
    setDeletedIdentifier(identifier);

    setTimeout(() => {
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => (q.id || q.order_index) !== identifier)
      );
      setDeletedIdentifier(null);
    }, 300); // Adjust this timing to match your animation duration
  };

  const [springs, api] = useSprings(questions.length, (index) => ({
    x: 0,
    opacity: 1,
    config: config.gentle,
  }));

  useEffect(() => {
    api.start((index) => {
      const isDeleted =
        (questions[index].id || questions[index].order_index) ===
        deletedIdentifier;

      if (isDeleted) {
        return {
          x: -100,
          opacity: 0,
          config: { tension: 300, friction: 20 },
        };
      }
      return {
        x: 0,
        opacity: 1,
      };
    });
  }, [api, questions, deletedIdentifier]);

  return questions.map((question, index) => {
    const style = springs[index];

    return (
      <animated.div
        key={question.id || question.order_index}
        style={style}
        // ref={(el) => measureHeight(el, question.id)}
      >
        <Grid
          container
          display="flex"
          direction="row"
          justifyContent="space-evenly"
          alignItems="center">
          {renderForQuestion && (
            <Grid
              item
              display="flex"
              direction="column"
              justifyContent="center"
              alignItems="center"
              xs={1}>
              <Grid item xs={1}>
                <DeleteQuestionComponent
                  question={question}
                  setQuestions={setQuestions}
                  onDelete={onDeleteQuestion}
                  deleteAnimation={handleDeleteAnimation}
                />
              </Grid>
              <Grid item xs={1}>
                <RequiredQuestionComponent
                  question={question}
                  setQuestions={setQuestions}
                />
              </Grid>
            </Grid>
          )}

          <Grid item xs={8} justifyContent="center" alignItems="center">
            <PaperWrapper>
              <QuestionTitleComponent
                key={question.id}
                questions={questions}
                question={question}
                isReadOnly={getReadOnlyFlag()}
                //handleTitleChange={handleTitleChange}
                index={index}
              />
              <QuestionBodyComponent
                question={question}
                questionIndex={question.id}
                setQuestions={setQuestions}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
                handleQuestionChange={handleQuestionChange}
                getReadOnlyFlag={getReadOnlyFlag}
                getLabel={getLabel}
                renderForQuestion={renderForQuestion}
              />
              {errors[question.id] && (
                <Typography color="error">{errors[question.id]}</Typography>
              )}
            </PaperWrapper>
            <Divider flexItem sx={{ margin: 2 }} />
          </Grid>
          {renderForQuestion && (
            <Grid item xs={1}>
              <ReorderComponent
                QuestionIndex={index}
                questionsHook={questions}
                setQuestionsHook={setQuestions}
              />
            </Grid>
          )}
        </Grid>
      </animated.div>
    );
  });
};
