import {
  Autocomplete,
  Box,
  createFilterOptions,
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { lazy, useCallback, useMemo, useState } from "react";
import { MainButton } from "../MainButton/MainButton";
import { useNavigate } from "react-router-dom";
import { RETROSPECTIVE_TYPES, ROUTES, toRem } from "../../utils";
import { v4 as uuidv4 } from "uuid";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCreateProject,
  useCreateRetrospective,
  useGetProjects,
} from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";

interface CreateRetroDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProjectOptionType {
  inputValue?: string;
  id?: number;
  name: string;
}

const filter = createFilterOptions<ProjectOptionType>();

const CreateRetroDialog = ({ open, setOpen }: CreateRetroDialogProps) => {
  const navigate = useNavigate();
  const [selectedRetro, setSelectedRetro] = useState("");
  const [retroName, setRetroName] = useState("");
  const [project, setProject] = React.useState<ProjectOptionType | null>(null);

  const { data, isLoading } = useGetProjects(open);
  const queryClient = useQueryClient();

  const createProject = useCreateProject((data) => {
    setProject(data);
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  });

  const createRetro = useCreateRetrospective(() => {
    const boardId = uuidv4();
    navigate(`${ROUTES.RETROBOARD}?type=${selectedRetro}&boardId=${boardId}`);
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["retrospectives"] });
  });

  const projects: ProjectOptionType[] = useMemo(() => {
    if (data) {
      return data.map((project) => ({
        name: project.name,
        id: project.id,
      }));
    }
    return [];
  }, [data]);

  const retros = [
    {
      value: RETROSPECTIVE_TYPES.WELL_NOT_SO_WELL,
      label: "Well, Not So Well, New Ideas",
      description:
        "Uma retrospectiva simples para discutir o que funcionou, o que precisa melhorar e propor novas ideias.",
      img: "wellnotsowell.svg",
    },
    {
      value: RETROSPECTIVE_TYPES.OPEN_THE_BOX,
      label: "Open the Box",
      description:
        "Uma retrospectiva aberta para explorar pontos escondidos, revelar preocupações e levantar sugestões de forma colaborativa.",
      img: "caixa.svg",
    },
    {
      value: RETROSPECTIVE_TYPES.EASY_AS_PIE,
      label: "Easy As Pie",
      description:
        "Uma retrospectiva divertida que avalia o que foi fácil, difícil ou poderia ser mais leve de realizar.",
      img: "pie.svg",
    },
  ];

  const createEnable = useMemo(() => {
    return (
      selectedRetro !== "" &&
      retroName.trim() !== "" &&
      project !== null &&
      project.name.trim() !== ""
    );
  }, [selectedRetro, retroName, project]);

  const handleCreateRetro = useCallback(() => {
    console.log("Creating retrospective with:", {
      selectedRetro,
      retroName,
      project,
    });
    if (createEnable && project?.id) {
      createRetro.mutate({
        name: retroName,
        project_id: project.id,
        retro_type: selectedRetro
      });
    }
  }, [selectedRetro, retroName, project, createEnable, navigate, setOpen]);

  return (
    <Dialog
      onClose={() => {
        setOpen(false);
      }}
      open={open}
      maxWidth="lg"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          bgcolor: "#FCF8F7",
        },
      }}
    >
      <Box
        sx={{
          width: toRem(880),
          padding: toRem(32),
          display: "flex",
          flexDirection: "column",
          gap: toRem(32),
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "20px",
              letterSpacing: "0.2px",
              color: "#5C5C5C",
            }}
          >
            Criar nova retrospectiva
          </Typography>
          <IconButton>
            <CloseIcon
              onClick={() => setOpen(false)}
              sx={{ color: "#1B1B1B", fontSize: "24px" }}
            />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", gap: toRem(32) }}>
          <TextField
            label="Nome da retrospectiva"
            variant="outlined"
            value={retroName}
            onChange={(e) => setRetroName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1B1B1B",
              },
              "& .MuiInputBase-input::placeholder": {
                fontFamily: "'Poppins', sans-serif",
                fontSize: "16px",
                color: "888888",
                lineSpacing: "0%",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "'Poppins', sans-serif",
                fontSize: "16px",
                color: "#888888",
                lineSpacing: "0%",
              },
              width: "65%",
            }}
          />
          <Autocomplete
            sx={{
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1B1B1B",
              },
              "& .MuiInputBase-input::placeholder": {
                fontFamily: "'Poppins', sans-serif",
                fontSize: "16px",
                color: "888888",
                lineSpacing: "0%",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "'Poppins', sans-serif",
                fontSize: "16px",
                color: "#888888",
                lineSpacing: "0%",
              },
              width: "35%",
            }}
            loading={isLoading}
            value={project}
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                setProject({
                  name: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                createProject.mutate(newValue.inputValue);
              } else {
                setProject(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              const isExisting = options.some(
                (option) => inputValue === option.name
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  inputValue,
                  name: `Adicionar "${inputValue}"`,
                });
              }

              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={projects}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name;
            }}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  {option.name}
                </li>
              );
            }}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Projeto" />}
          />
        </Box>
        <Box sx={{ display: "flex", gap: toRem(32) }}>
          {retros.map((retro) => (
            <Box
              sx={{
                display: "flex",
                gap: toRem(16),
                flexDirection: "column",
                width: toRem(250),
                height: toRem(350),
                alignItems: "center",
                border: "1px solid #1B1B1B",
                borderRadius: "6px",
                padding: toRem(30),
                bgcolor: selectedRetro === retro.value ? "#CECECE" : "#FFFFFF",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                },
              }}
              key={retro.value}
              onClick={() => setSelectedRetro(retro.value)}
            >
              <Box
                marginBottom={toRem(16)}
                display="flex"
                justifyContent="center"
              >
                <img src={`/${retro.img}`} alt={retro.label} />
              </Box>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  lineHeight: "24px",
                  marginBottom: toRem(20),
                  textAlign: "center",
                  color: "#1B1B1B",
                }}
              >
                {retro.label}
              </Typography>
              <Box sx={{ flexGrow: 1, textAlign: "center" }}>
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    textAlign: "center",
                    color: "#5C5C5C",
                  }}
                >
                  {retro.description}
                </Typography>
              </Box>

              <MainButton>Saiba mais</MainButton>
            </Box>
          ))}
        </Box>
        <Box width="100%" display="flex" justifyContent="center">
          <MainButton disabled={!createEnable} onClick={handleCreateRetro}>
            Criar retrospectiva
          </MainButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default CreateRetroDialog;
