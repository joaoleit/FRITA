import { Box, Typography } from "@mui/material";
import React from "react";
import { MainButton } from "../MainButton/MainButton";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useNavigate } from "react-router-dom";
import { RETROSPECTIVE_TYPES, ROUTES, toRem } from "../../utils";

type Props = {};

const RetroFinished = () => {
  return (
    <Box sx={{ height: "100%", padding: "30px 40px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: toRem(12),
          }}
        >
          <Box
            sx={{
              bgcolor: "#1B1B1B",
              paddingX: toRem(16),
              width: "fit-content",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0%",
                color: "#FCF8F7",
              }}
            >
              Projeto FRITAS
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: "28px",
              lineHeight: "35px",
              letterSpacing: "0%",
              color: "#1B1B1B",
            }}
          >
            Retrospectiva - Sprint 04
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "35px",
              letterSpacing: "0%",
              color: "#1B1B1B",
            }}
          >
            <b>Realizado em:</b> 11/07/2025
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "35px",
              letterSpacing: "0%",
              color: "#1B1B1B",
            }}
          >
            <b>Tipo:</b> Easy as Pie
          </Typography>
        </Box>
        <Box>
          <MainButton
            onClick={() => {
              return;
            }}
            sx={{
              bgcolor: "#FCF8F7",
              color: "#1B1B1B",
              border: "1px solid #1B1B1B",
              borderRadius: "3px",
              gap: "8px",
            }}
          >
            <SaveOutlinedIcon />
            Salvar
          </MainButton>
        </Box>
      </Box>
      <Box
        sx={{
          border: "1px solid #1B1B1B",
          mt: toRem(34),
          display: 'flex'
        }}
      >
        <Box width='60%'>
          <Box
            sx={{
              bgcolor: "#1B1B1B",
              padding: toRem(16),
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                color: "#FCF8F7",
              }}
            >
              Resumo da retrospectiva
            </Typography>
          </Box>
          <Box
            sx={{
              padding: toRem(16),
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                color: "#5C5C5C",
              }}
            >
              Resumo da retrospectiva
            </Typography>
          </Box>
        </Box>
        <Box width='40%' borderLeft="1px solid #1B1B1B"> 
          <Box
            sx={{
              bgcolor: "#1B1B1B",
              padding: toRem(16),
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                color: "#FCF8F7",
              }}
            >
              Cards
            </Typography>
          </Box>
          <Box
            sx={{
              padding: toRem(16),
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                color: "#5C5C5C",
              }}
            >
              AAA
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RetroFinished;
