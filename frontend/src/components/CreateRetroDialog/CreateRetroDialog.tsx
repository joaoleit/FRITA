import { Dialog, DialogTitle } from "@mui/material";
import React from "react";
import { MainButton } from "../MainButton/MainButton";
import { useNavigate } from "react-router-dom";
import { RETROSPECTIVE_TYPES, ROUTES } from "../../utils";

interface CreateRetroDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateRetroDialog = ({ open, setOpen }: CreateRetroDialogProps) => {
  const navigate = useNavigate();

  return (
    <Dialog
      onClose={() => {
        setOpen(false);
      }}
      open={open}
    >
      <DialogTitle>Selecione uma retrospectiva</DialogTitle>
      <MainButton
        color="inherit"
        onClick={() =>
          navigate(
            `${ROUTES.RETROBOARD}?type=${RETROSPECTIVE_TYPES.EASY_AS_PIE}`
          )
        }
        sx={{
          // width: "123px",
          // height: "48px",
          bgcolor: "#FCF8F7",
          color: "#1B1B1B",
          border: "1px solid #1B1B1B",
          borderRadius: "3px",
          gap: "8px",
        }}
      >
        Easy As Pie
      </MainButton>
      <MainButton
        color="inherit"
        onClick={() =>
          navigate(
            `${ROUTES.RETROBOARD}?type=${RETROSPECTIVE_TYPES.OPEN_THE_BOX}`
          )
        }
        sx={{
          // width: "123px",
          // height: "48px",
          bgcolor: "#FCF8F7",
          color: "#1B1B1B",
          border: "1px solid #1B1B1B",
          borderRadius: "3px",
          gap: "8px",
        }}
      >
        Open the Box
      </MainButton>
      <MainButton
        color="inherit"
        onClick={() =>
          navigate(
            `${ROUTES.RETROBOARD}?type=${RETROSPECTIVE_TYPES.WELL_NOT_SO_WELL}`
          )
        }
        sx={{
          // width: "123px",
          // height: "48px",
          bgcolor: "#FCF8F7",
          color: "#1B1B1B",
          border: "1px solid #1B1B1B",
          borderRadius: "3px",
          gap: "8px",
        }}
      >
        Well Not So Well And New Ideas
      </MainButton>
    </Dialog>
  );
};

export default CreateRetroDialog;
