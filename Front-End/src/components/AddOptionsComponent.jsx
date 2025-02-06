import React, { useEffect, useState } from "react";
import { TextField, Button, Grid } from "@mui/material";

const AddOptionsComponent = ({
  questionIndex,
  renderFlag,
  setRenderFlag,
  question,
  setQuestions,
  esTexto,
  setEsTexto,
}) => {
  //Hooks
  const [newOption, setNewOption] = useState("");
  //Funciones
  /*const handleAddOption = () => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      const lastQuestion = updatedQuestions[updatedQuestions.length - 1];

      if (
        lastQuestion &&
        (lastQuestion.type === "multiple choice" ||
          lastQuestion.type === "unique choice" ||
          lastQuestion.type === "list")
      ) {
        //setEsTexto(false);
        lastQuestion.options.push(newOption);
      }

      return updatedQuestions;
    });
    setNewOption("");
  };*/
  /*const handleAddOption = (newOption) => {
    const option = { value: newOption };
    //setNewOption(option);
    return option;
  };*/
  const handleAddOption = () => {
    question.options = [...question.options];
    question.options.push(newOption);
    //question.options.push("bar");
    //console.log(questionIndex);
    console.log(question);
    setNewOption("");
    setRenderFlag(!renderFlag); // Trigger a re-render

    /*setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      const thisQuestion = updatedQuestions.find((item) => {
        item.id == questionId;
      });
      if (thisQuestion) {
        if (!thisQuestion.options) {
          thisQuestion.options = [];
        }
        thisQuestion.options.push(newOption);
      }
      return updatedQuestions;
    });*/
  };
  /*const handleAddOption = (questionId) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question) => {
        if (question.id === questionId) {
          return {
            //...question,
            //options: [...question.options, newOption],
            options: [...question.options, newOption],
          };
        }
        return question;
      });
      return updatedQuestions;
    });
    console.log(newOption);
    setNewOption("");
  };*/

  return (
    // <>
    //   <div
    //     style={{
    //       display: "flex",
    //       flexDirection: "column",
    //       justifyContent: "center",
    //       alignItems: "start",
    //       textAlign: "center",
    //     }}>
    <Grid
      container
      alignItems="center"
      justifyContent="start"
      //sx={{ marginBottom: 1 }}
    >
      <Grid item>
        <TextField
          label="Nueva Opción"
          variant="outlined"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
        />
      </Grid>
      <Grid item sx={{ marginLeft: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddOption}
          //  style={{ marginLeft: 8 }}
        >
          Añadir
        </Button>
      </Grid>
    </Grid>
    //</div>
    //</>
  );
};
export default AddOptionsComponent;
