import { Navigate } from "react-router-dom";

export const HomePage = () => {
  return <Navigate to={`${import.meta.env.VITE_NETWORK_FIX}`} />;
};
