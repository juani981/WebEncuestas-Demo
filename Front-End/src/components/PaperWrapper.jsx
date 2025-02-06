import { Paper } from "@mui/material";

import React from "react";

export const PaperWrapper = ({ children }) => {
  return (
    <>
      <Paper
        elevation={6}
        style={{
          padding: 20,
          marginTop: 20,
          marginBottom: 20,
          position: "relative",
          //width: "50vw",
          margin: "auto",
        }}
        square={true}>
        {children}
      </Paper>
    </>
  );
};
