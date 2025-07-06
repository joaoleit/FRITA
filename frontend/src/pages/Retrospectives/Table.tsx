import * as React from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { toRem } from "../../utils";
import { Box, IconButton } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { MainButton, Popover } from "../../components";

const styles = {
  table: {
    minWidth: 650,
  },
  header: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    color: "#FCF8F7",
    borderBottom: "1px solid #1B1B1B",
  },
};

const CustomTable = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [popoverType, setPopoverType] = React.useState<
    "view" | "delete" | null
  >(null);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: "view" | "delete"
  ) => {
    setAnchorEl(event.currentTarget);
    setPopoverType(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPopoverType(null);
  };

  const id = Boolean(anchorEl) ? "simple-popover" : undefined;

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        backgroundColor: "#FCF8F7",
        marginBottom: toRem(30),
      }}
    >
      <Table
        sx={{ minWidth: 650, height: toRem(533), border: "1px solid #1B1B1B" }}
        aria-label="simple table"
      >
        <TableHead sx={{ backgroundColor: "#1B1B1B" }}>
          <TableRow sx={{ backgroundColor: "#1B1B1B" }}>
            <TableCell align="left" sx={styles.header}>
              Nome
            </TableCell>
            <TableCell align="left" sx={styles.header}>
              Projeto
            </TableCell>
            <TableCell align="left" sx={styles.header}>
              Tipo de retrospectiva
            </TableCell>
            <TableCell align="left" sx={styles.header}>
              Realizada em
            </TableCell>
            <TableCell align="left" sx={styles.header}>
              Resumo
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ maxHeight: toRem(533) }}>
          {Array.from({ length: 9 }).map((_, idx) => (
            <TableRow key={idx} sx={{ height: toRem(53) }}>
              <TableCell
                align="left"
                sx={{ borderBottom: "1px solid #1B1B1B" }}
              >
                Retrospectiva Sprint 02
              </TableCell>
              <TableCell
                align="left"
                sx={{ borderBottom: "1px solid #1B1B1B" }}
              >
                FRITAS
              </TableCell>
              <TableCell
                align="left"
                sx={{ borderBottom: "1px solid #1B1B1B" }}
              >
                Well, Not so well, New Ideas
              </TableCell>
              <TableCell
                align="left"
                sx={{ borderBottom: "1px solid #1B1B1B" }}
              >
                03/07/2025
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  borderBottom: "1px solid #1B1B1B",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <Box>
                  <IconButton>
                    <VisibilityOutlinedIcon sx={{ color: "#1B1B1B" }} />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton>
                    <EditIcon sx={{ color: "#1B1B1B" }} />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton
                    onClick={(e) => handleClick(e, "delete")}
                    aria-describedby={id}
                  >
                    <DeleteOutlineIcon
                      sx={{ color: "#1B1B1B" }}
                      aria-describedby={id}
                    />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Popover
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        id={id}
        title="Tem certeza que quer excluir essa retrospectiva?"
        children={
          <Box
            sx={{
              display: "flex",
              padding: "16px",
              gap: "30px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MainButton
              color="inherit"
              onClick={() => {
                return;
              }}
              sx={{
                bgcolor: "#FCF8F7",
                color: "#1B1B1B",
                border: "1px solid #1B1B1B",
              }}
            >
              Sim
            </MainButton>
            <MainButton
              color="inherit"
              onClick={handleClose}
            >
              Não
            </MainButton>
          </Box>
        }
      />
    </TableContainer>
  );
};

export default CustomTable;
