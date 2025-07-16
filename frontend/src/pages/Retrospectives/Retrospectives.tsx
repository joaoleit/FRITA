import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  OutlinedInput,
  InputLabel,
  MenuItem,
  IconButton,
} from "@mui/material";
import { CreateRetroDialog, Header, MainButton } from "../../components";
import { RETROSPECTIVE_TYPES, ROUTES, toRem } from "../../utils";
import { Dayjs } from "dayjs";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useMemo } from "react";
import CustomTable from "./Table";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";
import { useGetProjects } from "../../hooks";
import { useGetRetrospectives } from "../../hooks/useGetRetrospectives";

const styles = {
  input: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1B1B1B",
    },
    "& .MuiInputBase-input::placeholder": {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "16px",
      color: "#888888",
      lineSpacing: "0%",
    },
    "& .MuiInputLabel-root": {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "16px",
      color: "#888888",
      lineSpacing: "0%",
    },
    borderColor: "#1B1B1B",
  },
};

const Retrospectives = () => {
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);
  const [selectedRetrospectiveType, setSelectedRetrospectiveType] =
    React.useState<string | null>(null);
  const [date, setDate] = React.useState<Date | null>(null);
  const [search, setSearch] = React.useState<string | null>(null);

  const [openRetroDialog, setOpenRetroDialog] = React.useState(false);

  const { data: dataProjects, isLoading: isLoadingProjects } = useGetProjects();
  const { data: dataRetro, isLoading: isLoadingRetro } = useGetRetrospectives(
    search ?? undefined,
    selectedProject ? parseInt(selectedProject) : undefined,
    selectedRetrospectiveType ?? undefined,
    date ? new Date(date).toLocaleDateString() : undefined
  );

  const projects = useMemo(
    () =>
      (dataProjects ?? []).map((p) => {
        return { value: p.id, label: p.name };
      }),
    [dataProjects]
  );

  const retrospectiveTypes = [
    {
      value: RETROSPECTIVE_TYPES.WELL_NOT_SO_WELL,
      label: "Well, Not So Well, New Ideas",
    },
    {
      value: RETROSPECTIVE_TYPES.OPEN_THE_BOX,
      label: "Open the Box",
    },
    {
      value: RETROSPECTIVE_TYPES.EASY_AS_PIE,
      label: "Easy As Pie",
    },
  ];

  return (
    <Box bgcolor="#1B1B1B" minHeight="100vh">
      <Header />
      <Box
        width="100%"
        height="100vh"
        display="flex"
        flexDirection="column"
        mt={toRem(74)}
        bgcolor="#FCF8F7"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginTop={toRem(30)}
          paddingX={toRem(40)}
        >
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "28px",
              lineHeight: "32px",
              letterSpacing: "0%",
              verticalAlign: "middle",
              color: "1B1B1B",
            }}
          >
            Retrospectivas realizadas
          </Typography>
          <MainButton
            color="inherit"
            onClick={() => setOpenRetroDialog(true)}
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
            <AddIcon />
            Nova retrospectiva
          </MainButton>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gap={toRem(27)}
          marginTop={toRem(40)}
          paddingX={toRem(40)}
        >
          <TextField
            id="outlined-select-currency"
            select
            label="Projeto"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            InputProps={{
              endAdornment: selectedProject && (
                <IconButton
                  size="small"
                  onClick={() => setSelectedProject("")}
                  sx={{ mr: 2 }}
                  aria-label="Limpar seleção"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
            sx={styles.input}
          >
            {projects.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-select-currency"
            select
            label="Tipo de retrospectiva"
            value={selectedRetrospectiveType}
            onChange={(e) => setSelectedRetrospectiveType(e.target.value)}
            InputProps={{
              endAdornment: selectedRetrospectiveType && (
                <IconButton
                  size="small"
                  onClick={() => setSelectedRetrospectiveType("")}
                  sx={{ mr: 2 }}
                  aria-label="Limpar seleção"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
            sx={styles.input}
          >
            {retrospectiveTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Data da retrospectiva"
              slotProps={{
                textField: {
                  sx: {
                    "& .MuiPickersOutlinedInput-notchedOutline": {
                      borderColor: "red",
                      border: "1px solid #1B1B1B",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "16px",
                      color: "#888888",
                      lineSpacing: "0%",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "16px",
                      color: "#888888",
                      lineSpacing: "0%",
                    },
                  },
                  InputProps: {
                    placeholder: "Data da retrospectiva",
                  },
                },
                actionBar: {
                  actions: ["clear"],
                },
              }}
              value={date}
              onChange={(newValue) => setDate(newValue)}
              format="dd/MM/yyyy"
              sx={styles.input}
            />
          </LocalizationProvider>
          <FormControl variant="outlined" sx={styles.input}>
            <InputLabel htmlFor="outlined-adornment-search">
              Pesquisar
            </InputLabel>
            <OutlinedInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="outlined-adornment-search"
              type={"text"}
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              }
              label="Pesquisar"
            />
          </FormControl>
        </Box>
        <Box display="flex" marginTop={toRem(30)} paddingX={toRem(40)}>
          <CustomTable dataRetro={dataRetro} isLoadingRetro={isLoadingRetro} />
        </Box>
      </Box>
      <CreateRetroDialog open={openRetroDialog} setOpen={setOpenRetroDialog} />
    </Box>
  );
};

export default Retrospectives;
