import React from "react";
import { Box, Icon, IconButton, Popover, Typography } from "@mui/material";
import { toRem } from "../../utils";
import CloseIcon from "@mui/icons-material/Close";

interface PopoverProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  id: "simple-popover" | undefined;
  title?: string;
  children?: React.ReactNode;
  hasCloseButton?: boolean;
}

const CustomPopover = ({
  anchorEl,
  setAnchorEl,
  id,
  children,
  title,
  hasCloseButton = false,
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={toRem(27)}
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
          {hasCloseButton && (
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "#1B1B1B" }} />
            </IconButton>
          )}
        </Box>
        <Box>{children}</Box>
      </Box>
    </Popover>
  );
};

export default CustomPopover;
