import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  List,
  ListItemText,
  ListItem,
  Divider,
  Grid,
  FormLabel,
} from "@mui/material";
import { DeleteOptionComponent } from "../DeleteOptionComponent";

export const ListTypeComponent = ({
  question,
  setQuestions,
  answers,
  renderFlag,
  setRenderFlag,
  handleAnswerChange,
  isDisabled,
  isreadOnly,
  label,
}) => {
  const selectedAnswer = answers.find(
    (answer) => answer.id_pregunta === question.id
  );
  const selectedOption = selectedAnswer ? selectedAnswer.options : "";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Re-render when question changes (for creating new options)
    if (isDisabled && question.options.length > 0) {
      setOpen(true);
    }
  }, [question, isDisabled]);

  const handleChange = (event) => {
    if (!isDisabled) {
      handleAnswerChange(question.id, event.target.value);
    }
  };

  return (
    <FormControl
      fullWidth
      component="fieldset"
      margin="normal"
      key={question.id}
      required={question.required}>
      <FormLabel>
        {isreadOnly ? "Elija una opción" : "Cree sus opciones"}
      </FormLabel>
      {isDisabled ? (
        //<ul>
        <List>
          {question.options.length > 0 &&
            question.options.map((option, index) => (
              //<li key={index}>
              <Grid
                container
                key={index}
                alignItems="center"
                justifyContent="space-between"
                sx={{ marginBottom: 1 }}>
                <Grid item>
                  <ListItem disablePadding disabled={isDisabled} key={index}>
                    <ListItemText primary={option} />
                  </ListItem>
                </Grid>
                {!isreadOnly && (
                  <Grid item>
                    <DeleteOptionComponent
                      question={question}
                      setQuestions={setQuestions}
                      option={index}
                      renderFlag={renderFlag}
                      setRenderFlag={setRenderFlag}
                    />
                    <Divider />
                  </Grid>
                )}
              </Grid>
              //</li>
            ))}
        </List>
      ) : (
        //</ul>
        <Select
          value={selectedOption}
          label="Seleccione una opción"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onChange={handleChange}
          disabled={isDisabled}>
          {question.options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};
