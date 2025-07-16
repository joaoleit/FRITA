import { Routes, Route } from "react-router-dom";
import { Home, Login, Register, Retrospectives } from "./pages";
import { ROUTES } from "./utils";
import RetroBoard from "./components/RetroBoard";
import { RequireAuth } from "./components";

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route
        path={ROUTES.RETROSPECTIVE}
        element={
          <RequireAuth>
            <Retrospectives />
          </RequireAuth>
        }
      />
      <Route path={ROUTES.NOT_FOUND} element={<Home />} />
      <Route path={ROUTES.RETROBOARD} element={<RetroBoard />} />
    </Routes>
  );
}
