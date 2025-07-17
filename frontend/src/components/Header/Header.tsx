import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { checkAuth, ROUTES, useAuth } from "../../utils";
import { MainButton } from "../MainButton/MainButton";
import React, { useEffect, useMemo, useState } from "react";

interface HeaderProps {
  whiteVersion?: boolean;
}

const Header = ({ whiteVersion = false }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken } = useAuth();

  const buttons = React.useMemo(() => {
    if (whiteVersion) {
      return (
        <MainButton
          color="inherit"
          onClick={() =>
            navigate(
              location.pathname === ROUTES.LOGIN
                ? ROUTES.REGISTER
                : ROUTES.LOGIN
            )
          }
          sx={{
            width: "156px",
            height: "48px",
          }}
        >
          {location.pathname === ROUTES.LOGIN ? "Fazer Cadastro" : "Login"}
        </MainButton>
      );
    }

    if (location.pathname === ROUTES.RETROSPECTIVE) {
      return (
        <>
          <MainButton
            color="inherit"
            onClick={() => navigate(ROUTES.RETROSPECTIVE)}
            sx={{
              height: "48px",
            }}
          >
            Retrospectivas
          </MainButton>
          <MainButton
            color="inherit"
            onClick={() => {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("retro-user");
              setToken(null);
              navigate(ROUTES.LOGIN);
            }}
            sx={{
              height: "48px",
            }}
          >
            Sair
          </MainButton>
        </>
      );
    }

    return (
      <>
        <MainButton
          variant="text"
          onClick={() => {
            return;
          }}
          sx={{
            height: "48px",
          }}
        >
          Sobre
        </MainButton>
        <MainButton
          color="inherit"
          onClick={() => {
            navigate(ROUTES.RETROSPECTIVE);
          }}
          sx={{
            height: "48px",
          }}
        >
          Retrospectivas
        </MainButton>
        {token ? (
          <MainButton
            color="inherit"
            onClick={() => {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("retro-user");
              setToken(null);
              navigate(ROUTES.LOGIN);
            }}
            sx={{
              height: "48px",
            }}
          >
            Sair
          </MainButton>
        ) : (
          <MainButton
            color="inherit"
            onClick={() => navigate(ROUTES.LOGIN)}
            sx={{
              width: "123px",
              height: "48px",
              bgcolor: "#FCF8F7",
              color: "#1B1B1B",
            }}
          >
            Fazer Login
          </MainButton>
        )}
      </>
    );
  }, [whiteVersion]);

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        height: "74px",
        bgcolor: whiteVersion ? "#FCF8F7" : "#1B1B1B",
        boxShadow: "none",
      }}
    >
      <Toolbar
        disableGutters
        sx={{ height: "100%", mr: whiteVersion ? "35px" : "39px", ml: "40px" }}
      >
        {whiteVersion ? (
          <img src="/frita-bk 1.png" alt="Logo" />
        ) : (
          <img src="/frita-wh2 1.png" alt="Logo" />
        )}
        <Typography
          component="div"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontFamily: "'Josefin Slab', serif",
            fontWeight: 600,
            fontSize: "24px",
            lineHeight: "35px",
            letterSpacing: "0%",
            verticalAlign: "middle",
            color: whiteVersion ? "#1B1B1B" : "#FCF8F7 ",
            display: "flex",
            alignItems: "center",
            marginLeft: "16px",
            mt: "4px",
          }}
          onClick={() => navigate(ROUTES.HOME)}
        >
          FRITAS
        </Typography>

        {/* Botões de navegação */}
        <Box display="flex" gap="32px">
          {buttons}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
