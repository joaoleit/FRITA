import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        {/* Logo ou nome da aplicação */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate(ROUTES.HOME)}>
          FRITA
        </Typography>

        {/* Botões de navegação */}
        <Box display="flex" gap={2}>
          <Button color="inherit" onClick={() => navigate(ROUTES.HOME)}>Home</Button>
          <Button color="inherit" onClick={() => {return}}>Retrospectivas</Button>
          <Button color="inherit" onClick={() => navigate(ROUTES.LOGIN)}>Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
