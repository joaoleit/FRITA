// components/RequireAuth.tsx
import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../../utils";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = await checkAuth();

      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setAuthChecked(true);
    };

    verifyAuth();
  }, []);

  if (!authChecked) {
    return null; // ou <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
