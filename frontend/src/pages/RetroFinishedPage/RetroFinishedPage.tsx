import { Box } from "@mui/material";
import React from "react";
import { Header, RetroFinished } from "../../components";
import { toRem } from "../../utils";

type Props = {};

const RetroFinishedPage = (props: Props) => {
  return (
    <Box bgcolor="#1B1B1B" minHeight="100vh">
      <Header />
      <Box
        width="100%"
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        mt={toRem(74)}
        bgcolor="#FCF8F7"
      >
        <RetroFinished />
      </Box>
    </Box>
  );
};

export default RetroFinishedPage;
