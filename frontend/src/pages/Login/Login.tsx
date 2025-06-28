import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils";
import { Header } from "../../components";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <Box>
      <Header />
      <Box
        bgcolor="#242424"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Box
          sx={{
            bgcolor: "#f5f5f5",
            width: "30%",
            height: "30%",
            borderRadius: 2,
            padding: 4,
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>

            <TextField fullWidth label="Nome de usuário" variant="outlined" />

            <TextField
              fullWidth
              label="Senha"
              type="password"
              variant="outlined"
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
            >
              Entrar
            </Button>

            <Button
              variant="text"
              color="secondary"
              fullWidth
              onClick={handleLogin}
            >
              Cadastrar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
