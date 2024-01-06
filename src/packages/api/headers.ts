import {useAuth} from "@packages/contexts/auth";
import {IUser} from "@packages/types";
import {Tid} from "@/utils/hash";

export const useApiHeaders = () => {
  const {auth: {
    currentUser,
    networkId,
    orgData,
    clientGateUrl
  }} = useAuth()
  return {
    baseURL: clientGateUrl,
    headers: buildHeaders(currentUser!, networkId, orgData?.Id!)
  }
}
export const buildHeaders = (currentUser: IUser, networkId: string, orgId: string) => {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/x-www-form-urlencoded",
    AppAgent: import.meta.env.VITE_AGENT,
    GwUserCode: import.meta.env.VITE_GW_USER,
    GwPassword: import.meta.env.VITE_GW_USER_PW,
    AppVerCode: "V1",
    Tid: Tid(),
    AppTid: Tid(),
    AppLanguageCode: currentUser.Language,
    UtcOffset: currentUser.TimeZone,
    NetworkId: networkId,
    OrgId: orgId,
  }
}
