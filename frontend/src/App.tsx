import { Routes, Route } from 'react-router-dom'
import { Home, Login, Register } from './pages'
import { ROUTES } from './utils'

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}