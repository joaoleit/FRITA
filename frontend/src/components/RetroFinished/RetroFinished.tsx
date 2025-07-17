import { Box, Typography } from "@mui/material";
import React from "react";
import { MainButton } from "../MainButton/MainButton";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RETROSPECTIVE_TYPES, ROUTES, toRem } from "../../utils";
import { useGetRetrospective } from "../../hooks";
import { getColumns } from "../RetroBoard/RetroType/retroTypeColumns";
import { v3 } from "uuid";
import { useGetRetroCards } from "../../hooks/useGetRetroCards";


const RetroFinished = () => {
  const [searchParams] = useSearchParams();
  const retroId = searchParams.get("retroId");

  const { data } = useGetRetrospective(retroId ? parseInt(retroId) : 0);
  const { data: dataCards } = useGetRetroCards(retroId ? parseInt(retroId) : 0);

  const columns = getColumns(data?.retro_type ?? "easy_as_pie");

  const retroTypeText = (s: string) => {
    if (s === "well/not_so_well/new_ideas")
      return "Well, Not So Well, New Ideas";
    else if (s === "easy_as_pie") return "Easy As Pie";
    else return "Open the Box";
  };

  if (!data) return null;

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
            {data.name}
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
            <b>Realizado em:</b>{" "}
            {new Date(data.created_at).toLocaleDateString("pt-BR")}
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
            <b>Tipo:</b> {retroTypeText(data.retro_type ?? "")}
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
          mb: toRem(34),
          display: "flex",
        }}
      >
        <Box width="60%">
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
              {data.resume}
            </Typography>
          </Box>
        </Box>
        <Box width="40%" borderLeft="1px solid #1B1B1B">
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
              display: "flex",
              flexDirection: "column",
              gap: toRem(16),
            }}
          >
            {dataCards &&
              dataCards.length > 0 &&
              Object.keys(columns).map((v) => {
                return (
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "24px",
                        letterSpacing: "0%",
                        color: "#5C5C5C",
                        marginBottom: toRem(16),
                      }}
                    >
                      {columns[v]["name"]}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: toRem(16),
                        width: "fit-content",
                      }}
                    >
                      {dataCards
                        .filter((c) => c.type === v)
                        .sort(
                          (a, b) =>
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime()
                        )
                        .map((v) => {
                          return (
                            <Box
                              sx={{
                                bgcolor: v.color,
                                width: 150,
                                minHeight: 150,
                                padding: "2px",
                                userSelect: "none",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Box
                                sx={{ flexGrow: 1, padding: "0 8px 8px 8px" }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 400,
                                    fontSize: "12px",
                                    lineHeight: "16px",
                                    lineBreak: "normal",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {v.content}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RetroFinished;
