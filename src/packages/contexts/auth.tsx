import { AuthContextData } from "@/types";
import { logger } from "@packages/logger";
import { authAtom } from "@packages/store";
import { ClientGateInfo, IOrg, IUser } from "@packages/types";
import { useAtomValue, useSetAtom } from "jotai";
import React, { createContext, useContext } from "react";

const AuthContext = createContext({} as AuthContextData);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider(props: React.PropsWithChildren<unknown>) {
  const authStore = useAtomValue(authAtom);
  const setAuthStore = useSetAtom(authAtom);
  const login = (
    accessToken: string,
    user?: IUser,
    orgData?: IOrg,
    clientGate?: ClientGateInfo
  ) => {
    //console.log("do login:", accessToken, user);
    localStorage.setItem("token", accessToken);
    setAuthStore({
      ...authStore,
      token: accessToken,
      currentUser: user ?? authStore.currentUser,
      orgId: orgData?.Id ?? authStore.orgId,
      orgData: orgData ?? authStore.orgData,
      clientGateUrl: clientGate?.WSUrlAddr ?? authStore.clientGateUrl,
      clientGate: clientGate ?? authStore.clientGate,
      createDTime: new Date(),
    });
    // authSignal.value.token = accessToken;
    // if(user) {
    //   authSignal.value.currentUser = user;
    // }
  };
  const selectNetwork = (networkId: string) => {
    setAuthStore({
      ...authStore,
      networkId,
    });
    // authSignal.value.networkId = networkId;
  };
  const logout = () => {
    logger.debug("do logout");
    // Somehow signal is ok, but set store will not logout the user
    // setAuthStore({} as AuthState)
    // setAuthStore({});
    // loggedInSignal.value = false;
    // authSignal.value = emptyState;
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
  };
  const setClientGateInfo = (clientGate: ClientGateInfo) => {
    setAuthStore({
      ...authStore,
      clientGateUrl: clientGate.WSUrlAddr,
      clientGate: clientGate,
    });
    // authSignal.value.clientGate = clientGate;
    // authSignal.value.clientGateUrl = clientGate.WSUrlAddr;
  };
  return (
    <AuthContext.Provider
      value={{
        auth: authStore,
        loggedIn: !!localStorage.getItem("token"),
        login,
        logout,
        selectNetwork,
        setClientGateInfo,
      }}
      {...props}
    />
  );
}
