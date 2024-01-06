import { authAtom } from "@packages/store";
import { Tid } from "@/utils/hash";
import axios from "axios";
import {
  CcAgent,
  CcCall,
  CcCallingInfo,
  CcOrgInfo,
  IOrg,
  ISession,
  LocaleData,
  Response,
} from "@packages/types";
import { logger } from "@packages/logger";
import { useAuth } from "../contexts/auth";

const apiDomain: string = `https://devwebapi228.ecore.vn/idocNet.Test.SkyCS.ClientGate.7206207001.WA`;
const AppAgent: string = `${import.meta.env.VITE_AGENT}`;
const GwUserCode: string = `${import.meta.env.VITE_GW_USER}`;
const GwUserPassword: string = `${import.meta.env.VITE_GW_USER_PW}`;
const defaultHeaders = {
  "Content-Type": "application/json",
  AppAgent: AppAgent,
  GwUserCode: GwUserCode,
  GwPassword: GwUserPassword,
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  Tid: Tid(),
};
const MAX_REQUESTS_COUNT = 10;
const INTERVAL_MS = 10;
let PENDING_REQUESTS = 0;

const apiBase = axios.create({
  baseURL: apiDomain,
  headers: defaultHeaders,
});

export const notifyApi: any = () => {
  const getUrl = JSON.parse(localStorage.getItem("auth") ?? "{}");
  const callApiBase = axios.create({
    baseURL: getUrl?.clientGateUrl ?? "",
    headers: defaultHeaders,
  });
  return {
    searchNotification: async (networkId: string, params: any) => {
      const token = localStorage.getItem("token");
      const response = await callApiBase.post<Response<any>>(
        "/Notification/SearchNotification",
        params,
        {
          headers: { networkId: networkId },
        }
      );

      logger.debug("response", response);
      return response.data;
    },

    markAsRead: async (networkId: string, params: any) => {
      let model = JSON.stringify(params);
      const token = localStorage.getItem("token");
      const response = await callApiBase.post<Response<any>>(
        "/Notification/MarkAsRead",
        { model: model },
        {
          headers: { networkId: networkId },
        }
      );

      return response.data;
    },

    getNewNotify: async (networkId: string, params: any) => {
      const token = localStorage.getItem("token");
      const response = await callApiBase.post<Response<any>>(
        "/Notification/SearchNotification",
        params,
        {
          headers: { networkId: networkId },
        }
      );

      logger.debug("response", response);
      return response.data;
    },
  };
};

export const notifApi = {
  searchNotification: async (networkId: string, params: any) => {
    const token = localStorage.getItem("token");
    const response = await apiBase.post<Response<any>>(
      "/Notification/SearchNotification",
      params,
      {
        headers: { networkId: networkId },
      }
    );

    logger.debug("response", response);
    return response.data;
  },

  markAsRead: async (networkId: string, params: any) => {
    let model = JSON.stringify(params);
    const token = localStorage.getItem("token");
    const response = await callApiBase.post<Response<any>>(
      "/Notification/MarkAsRead",
      { model: model },
      {
        headers: { networkId: networkId },
      }
    );

    return response.data;
  },
};
