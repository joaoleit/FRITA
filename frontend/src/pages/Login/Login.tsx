import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES, useAuth } from "../../utils";
import { Header, MainButton } from "../../components";
import { useLogin } from "../../hooks";
import React from "react";

const Login = () => {
  const [openError, setOpenError] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { setToken } = useAuth();

  const navigate = useNavigate();

  const mutateLogin = useLogin(
    (data) => {
      setToken(data.access);
      console.log(data)
      navigate(ROUTES.HOME, { replace: true });
    },
    (error) => {
      setOpenError(true);
    }
  );

  const handleLogin = () => {
    mutateLogin.mutate({
      email: email,
      password: password,
    });
  };

  return (
    <Box bgcolor="#FCF8F7" minHeight="100vh">
      <Header whiteVersion />
      <Box
        bgcolor="#1B1B1B"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="95vh"
      >
        <Box
          sx={{
            bgcolor: "#FCF8F7",
            // width: "400px",
            // height: "383px",
            borderRadius: "16px",
            padding: "40px",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              sx={{
                fontFamily: "'Josefin Slab', serif",
                fontWeight: 600,
                fontSize: "32px",
                lineHeight: "35px",
                letterSpacing: "0%",
                verticalAlign: "middle",
                mb: "32px",
              }}
            >
              LOGIN
            </Typography>

            <Box mb="16px" width="320px">
              <TextField
                fullWidth
                label="Nome de usuário"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                }}
              />
            </Box>
            <Box mb="10px" width="320px">
              <TextField
                fullWidth
                label="Senha"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
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
                }}
              />
            </Box>
            <Box width="100%" mb="34px">
              <Link
                href="#"
                underline="none"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "16px",
                  letterSpacing: "0%",

                  color: "#888888",
                }}
              >
                Esqueceu a senha?
              </Link>
            </Box>

            <MainButton
              variant="contained"
              color="primary"
              sx={{
                width: "82px",
                height: "48px",
              }}
              onClick={handleLogin}
              disabled={password === "" || email === ""}
            >
              Entrar
            </MainButton>
          </Box>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        color="error"
        open={openError}
        autoHideDuration={6000}
        onClose={() => setOpenError(false)}
      >
        <Alert
          onClose={() => setOpenError(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {"Credenciais inválidas"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
