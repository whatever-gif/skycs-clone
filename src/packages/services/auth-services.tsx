import React, { useCallback } from "react";
import { signIn as sendSignInRequest } from "@packages/api/auth";
import { ccsApi, entryGateApi } from "src/packages/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@packages/contexts/auth";
import { logger } from "@packages/logger";

const ssoDomain = import.meta.env.VITE_ACC_BASE_URL;
const myDomain = import.meta.env.VITE_DOMAIN;
const client_id = import.meta.env.VITE_SOLUTION_CODE;

export const useAuthService = () => {
  const navigate = useNavigate();
  const { logout, login, setClientGateInfo } = useAuth();

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await sendSignInRequest(email, password);
    if (result.isOk) {
      // setUser(result.data);
    }
    return result;
  }, []);

  const signOut = useCallback(() => {
    //console.log("do signout");
    logout();
    //console.log("signout igoss");
    window.open(
      //`${ssoDomain}/account/signout/${client_id}`,
      `${ssoDomain}/account/signout/?returnUrl=${myDomain}`,
      "_self",
      "noreferrer"
    );
    window.close();
  }, [logout]);

  const loginIgoss = useCallback(async (networkId: string) => {
    //console.log("get user information:", networkId);
    const resp = await ccsApi.getSessionInfo(networkId);
    //console.log("resp:", resp);
    if (resp.Success) {
      // get client gate
      const clientGate = await entryGateApi.getNetworkInfo(
        networkId,
        resp.Data.OrgId,
        resp.Data.CurrentUser
      );
      // logger.debug("client gate:", clientGate);
      console.log("client gate: __", clientGate);
      if (clientGate) {
        // setClientGateInfo(clientGate.Data._objResult[0])
        login(
          localStorage.getItem("token") as string,
          resp.Data.CurrentUser,
          resp.Data.OrgData,
          clientGate.Data?._objResult?.[0]
        );
      } else {
        login(
          localStorage.getItem("token") as string,
          resp.Data.CurrentUser,
          resp.Data.OrgData
        );
      }
    } else {
      console.log("error:", resp);
      logout();
      navigate("/login");
    }
  }, []);

  return {
    signIn,
    signOut,
    loginIgoss,
  };
};
