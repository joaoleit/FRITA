import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils";
import { MainButton } from "../MainButton/MainButton";

interface HeaderProps {
  whiteVersion?: boolean;
}

const Header = ({ whiteVersion = false }: HeaderProps) => {
  const navigate = useNavigate();

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
          {whiteVersion ? (
            <MainButton
              color="inherit"
              onClick={() => navigate(ROUTES.REGISTER)}
              sx={{
                width: "156px",
                height: "48px",
              }}
            >
              Fazer Cadastro
            </MainButton>
          ) : (
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
                  return;
                }}
                sx={{
                  height: "48px",
                }}
              >
                Retrospectivas
              </MainButton>
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
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
