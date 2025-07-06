import { Box, Typography } from "@mui/material";
import { Header, MainButton } from "../../components";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box bgcolor="#1B1B1B" minHeight="100vh">
      <Header />
      <Box
        width="100%"
        height="95vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#FCF8F7"
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box
            sx={{
              width: "462px",
              height: "390px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Josefin Slab', serif",
                fontWeight: 600,
                fontSize: "40px",
                lineHeight: "60px",
                letterSpacing: "0%",
                verticalAlign: "middle",
                mb: "24px",
              }}
            >
              Ferramenta de Retrospectiva Interativa para Times Ágeis
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                letterSpacing: "0%",
                verticalAlign: "middle",
                mb: "42px",
              }}
            >
              Transforme suas retrospectivas em momentos leves, produtivos e
              colaborativos. Escolha seu modelo favorito, compartilhe o link com
              o time e comece agora mesmo.
            </Typography>
            <Box>
              <MainButton
                color="inherit"
                onClick={() => {
                  navigate(ROUTES.RETROSPECTIVE);
                }}
                sx={{
                  height: "48px",
                }}
              >
                Criar retrospectiva
              </MainButton>
            </Box>
          </Box>
          <Box>
            <img src="/pic 1.png" alt="Pic 1" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
