import { Button, styled, type ButtonProps } from "@mui/material";
import React from "react";

type Props = {};

export const MainButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: "#FCF8F7",
  backgroundColor: "#1B1B1B",
  "&:hover": {
    // backgroundColor: purple[700],
    
  },
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  padding: "12px 16px",

  "&.Mui-disabled": {
    backgroundColor: "#A0A0A0",
    color: "#E0E0E0",
    opacity: 0.6,
    cursor: "not-allowed",
  },
}));
