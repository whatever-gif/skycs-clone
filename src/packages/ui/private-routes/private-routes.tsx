import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@packages/contexts/auth";

export const PrivateRoutes = () => {
  const { loggedIn } = useAuth();
  const location = useLocation();
  // console.log("private routes")
  return loggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
