import { useNavigate } from "react-router-dom";
import {useAuth} from "@packages/contexts/auth";
export const useNetworkNavigate = () => {
  const {auth: {networkId} } = useAuth();
  const rawNavigate = useNavigate();
  return (str: any) => {
    rawNavigate(`/${networkId}${str}`);
  };
};
