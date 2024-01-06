import { Tid } from "@/utils/hash";
import axios from "axios";
import { IOrg, ISession, LocaleData, Response } from "@packages/types";
import { logger } from "@packages/logger";

const ccsDomain: string = `${import.meta.env.VITE_CCS_BASE_URL}`;
const AppAgent: string = `${import.meta.env.VITE_AGENT}`;
const GwUserCode: string = `${import.meta.env.VITE_GW_USER}`;
const GwUserPassword: string = `${import.meta.env.VITE_GW_USER_PW}`;
const defaultHeaders = {
  "Content-Type": "application/json",
  AppAgent: AppAgent,
  GwUserCode: GwUserCode,
  GwPassword: GwUserPassword,
  Tid: Tid(),
};
const MAX_REQUESTS_COUNT = 10;
const INTERVAL_MS = 10;
let PENDING_REQUESTS = 0;

const ccsApiBase = axios.create({
  baseURL: ccsDomain,
  headers: defaultHeaders,
});
const localeApiBase = axios.create({
  baseURL: ccsDomain,
  headers: defaultHeaders,
});
/**
 * Axios Request Interceptor
 */
localeApiBase.interceptors.request.use(function (config) {
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
        PENDING_REQUESTS++;
        clearInterval(interval);
        resolve(config);
      }
    }, INTERVAL_MS);
  });
});
/**
 * Axios Response Interceptor
 */
localeApiBase.interceptors.response.use(
  function (response) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.resolve(response);
  },
  function (error) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.reject(error);
  }
);
export const localeApi = {
  loadLocaleData: async () => {
    return await ccsApiBase.post<Response<LocaleData>>(
      `${ccsDomain}/api/localization/GetData`,
      {
        solutionCode: import.meta.env.VITE_SOLUTION_CODE,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  },
  addLocaleData: async (values: { cate: string; value: string }[]) => {
    return await ccsApiBase.post<Response<LocaleData>>(
      `${ccsDomain}/api/localization/AddData`,
      {
        solutionCode: import.meta.env.VITE_SOLUTION_CODE,
        values: values,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  },
};
export const ccsApi = {
  getSessionInfo: async (networkId: string) => {
    const token = localStorage.getItem("token");
    const response = await ccsApiBase.get<Response<ISession>>(
      "/api/Account/GetSessionInfo",
      {
        params: {
          networkId,
          token,
        },
      }
    );

    logger.debug("response", response);
    return response.data;
  },
  getNetworks: async () => {
    const token = localStorage.getItem("token");
    const response = await ccsApiBase.get<Response<IOrg[]>>(
      "/api/Account/GetMyNetworks",
      {
        params: {
          token,
        },
      }
    );
    return response.data;
  },
  loadLocaleData: async () => {
    return await ccsApiBase.post<Response<LocaleData>>(
      `${ccsDomain}/api/localization/GetData`,
      {
        solutionCode: import.meta.env.VITE_SOLUTION_CODE,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  },
  addLocaleData: async (values: { cate: string; value: string }) => {
    return await ccsApiBase.post<Response<LocaleData>>(
      `${ccsDomain}/api/localization/AddData`,
      {
        solutionCode: import.meta.env.VITE_SOLUTION_CODE,
        values: [values],
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  },
};
