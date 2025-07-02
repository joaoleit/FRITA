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
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils";
import { Header, MainButton } from "../../components";
import React from "react";

const Register = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleRegister = () => {
    // Simulate a successful registration
    setOpen(true);
    // Redirect to home page after registration
    setTimeout(() => {
      navigate(ROUTES.HOME);
    }, 3000); // Redirect after 2 seconds
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
              Cadastro
            </Typography>

            <Box mb="16px" width="320px">
              <TextField
                fullWidth
                label="Nome de usuário"
                variant="outlined"
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
            <Box mb="16px" width="320px">
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                variant="outlined"
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
            <Box mb="32px" width="320px">
              <TextField
                fullWidth
                label="Senha"
                type="password"
                variant="outlined"
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

            <MainButton
              variant="contained"
              color="primary"
              sx={{
                // width: "82px",
                height: "48px",
              }}
              onClick={handleRegister}
            >
              Cadastrar
            </MainButton>
          </Box>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message="Cadastro realizado com sucesso!"
      />
    </Box>
  );
};

export default Register;
