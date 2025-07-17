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
import { useCreateScrumMaster } from "../../hooks";

const Register = () => {
  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const mutateCreateScrumMaster = useCreateScrumMaster(
    () => {
      setOpen(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    },
    (error) => {
      console.error("Error creating Scrum Master:", error);
      setOpenError(true);
    }
  );

  const handleRegister = () => {
    mutateCreateScrumMaster.mutate({
      name: userName,
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
              Cadastro
            </Typography>

            <Box mb="16px" width="320px">
              <TextField
                fullWidth
                label="Nome de usuário"
                variant="outlined"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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
            <Box mb="32px" width="320px">
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

            <MainButton
              variant="contained"
              color="primary"
              sx={{
                // width: "82px",
                height: "48px",
              }}
              onClick={handleRegister}
              disabled={!userName || !email || !password}
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
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<CheckIcon />}
        >
          Cadastro realizado com sucesso!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        color="error"
        // sx={{ backgroundColor: "#FF0000" }}
        open={openError}
        autoHideDuration={6000}
        onClose={() => setOpenError(false)}
      >
        <Alert
          onClose={() => setOpenError(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {mutateCreateScrumMaster.error?.response.data || "Erro ao cadastrar!"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
