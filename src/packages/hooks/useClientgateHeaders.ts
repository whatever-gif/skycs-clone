import { Tid } from "@/utils/hash";
import { useAuth } from "../contexts/auth";

export const useClientgateHeaders = () => {
  const { auth: { currentUser, networkId, orgData } } = useAuth();
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/x-www-form-urlencoded",
    AppAgent: import.meta.env.VITE_AGENT,
    GwUserCode: import.meta.env.VITE_GW_USER,
    GwPassword: import.meta.env.VITE_GW_USER_PW,
    AppVerCode: "V1",
    Tid: Tid(),
    AppTid: Tid(),
    AppLanguageCode: currentUser?.Language,
    UtcOffset: currentUser?.TimeZone,
    NetworkId: networkId,
    OrgId: orgData?.Id
  };
};