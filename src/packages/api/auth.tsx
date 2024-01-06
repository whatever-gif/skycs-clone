import { ccsApi } from "@packages/api/index";
import { logger } from "@packages/logger";
import defaultUser from "src/utils/default-user";

export async function signIn(email: string, password: string) {
  try {
    // Send request
    // let resp = await clientGateApi.post(`/api/login`, {
    //   email: email,
    //   password: password,
    // });
    // if (resp.Success) {
    //   //let token = resp.data.accessToken;
    //   //localStorage.setItem('token', token);
    //   console.log("___________", resp.Data)
    //   return resp.Data;
    // }

    return {
      isOk: true,
      data: defaultUser,
    };
  } catch {
    return {
      isOk: false,
      message: "Authentication failed",
    };
  }
}

export async function getUser() {
  const networkId = import.meta.env.VITE_NETWORK_FIX;
  try {
    // Send request
    logger.debug("networkId:", networkId);
    const resp = await ccsApi.getSessionInfo(networkId);
    logger.debug("response", resp);
    return {
      isOk: true,
      data: resp.Data.CurrentUser,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}

export async function createAccount(email: string, password: string) {
  try {
    // Send request
    // console.log(email, password);
    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to create account",
    };
  }
}

export async function changePassword(email: string, recoveryCode?: string) {
  try {
    // Send request
    // console.log(email, recoveryCode);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to change password",
    };
  }
}

export async function resetPassword(email: string) {
  try {
    // Send request
    // console.log(email);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to reset password",
    };
  }
}
