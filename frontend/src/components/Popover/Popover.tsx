import React from "react";
import { Box, Popover, Typography } from "@mui/material";
import { toRem } from "../../utils";

interface PopoverProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  id: "simple-popover" | undefined;
  title?: string;
  children?: React.ReactNode;
}

const CustomPopover = ({
  anchorEl,
  setAnchorEl,
  id,
  children,
  title,
}: PopoverProps) => {
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Popover
      id={id}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      sx={{
        "& .MuiPopover-paper": {
          boxShadow: "0px 8px 32px rgba(0,0,0,0.16)",
          backgroundColor: "#FCF8F7",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: "#FCF8F7",
          display: "flex",
          flexDirection: "column",
          paddingX: toRem(40),
          paddingY: toRem(32),
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "32px",
            letterSpacing: "0%",
            verticalAlign: "middle",
            color: "#5C5C5C",
            maxWidth: "300px",
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
        <Box>{children}</Box>
      </Box>
    </Popover>
  );
};

export default CustomPopover;
