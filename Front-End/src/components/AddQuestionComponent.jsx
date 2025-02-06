import React, { useState } from "react";
import { Fab, Menu, MenuItem, TextField, Button, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddOptionsComponent from "./AddOptionsComponent";

const AddQuestionComponent = ({ questions, setQuestions }) => {
  //hooks
  const [anchorEl, setAnchorEl] = useState(null);
  //const [showFirstQuestion, setShowFirstQuestion] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [esTexto, setesTexto] = useState(true);
  const [openTooltip, setopenTooltip] = useState(true);

  const handleMenuOpen = (event) => {
    //const [anchorEl, setAnchorEl] = useState(null);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleTypeMenuItemClick = (type) => {
    setAnchorEl(null);
    const newQuestion = {
      //id: undefined,
      order_index: questions.length + 1,
      title: "",
      type: type,
      required: false,
    };
    if (type === "text") {
      setesTexto(true);
    } else if (
      type === "multiple choice" ||
      type === "unique choice" ||
      type === "list"
    ) {
      newQuestion.options = [];
      setesTexto(false);
    } else if (type === "rating") {
      newQuestion.range = [];
      setesTexto(false);
    }
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  return (
    <>
      <Tooltip
        title="Añadir Pregunta"
        arrow
        placement="top-start"
        open={openTooltip}
        onOpen={() => setopenTooltip(!openTooltip)}
        onClose={() => setopenTooltip(!openTooltip)}>
        <Fab
          color="primary"
          aria-label="add"
          style={{
            position: "relative",
            //bottom: 40,
            //right: 16,
          }}
          onClick={(event) => handleMenuOpen(event)}>
          <AddIcon />
        </Fab>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose()}>
        {/* Opciones del menú */}
        <MenuItem onClick={() => handleTypeMenuItemClick("text")}>
          Texto
        </MenuItem>
        <MenuItem onClick={() => handleTypeMenuItemClick("numeric")}>
          Numérica
        </MenuItem>
        <MenuItem onClick={() => handleTypeMenuItemClick("multiple choice")}>
          Selección Múltiple
        </MenuItem>
        <MenuItem onClick={() => handleTypeMenuItemClick("unique choice")}>
          Selección Única
        </MenuItem>
        <MenuItem onClick={() => handleTypeMenuItemClick("list")}>
          Lista
        </MenuItem>
        <MenuItem onClick={() => handleTypeMenuItemClick("rating")}>
          Rating
        </MenuItem>
      </Menu>
    </>
  );
};

export default AddQuestionComponent;
