import { Box } from "@mui/material";
import { Header } from "../../components";
import ConstructionIcon from '@mui/icons-material/Construction';

type Props = {};

const Home = () => {
  return (
    <Box bgcolor="#242424" minHeight="100vh">
      <Header />
      <Box
        width="100%"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <ConstructionIcon sx={{height: '200px', width: '200px'}} />
      </Box>
    </Box>
  );
};

export default Home;
