import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useNotificationApi = (apiBase: AxiosInstance) => {
  return {
    searchNotification: async (networkId: string, params: any) => {
      const token = localStorage.getItem("token");
      const response = await apiBase.post<Response<any>>(
        "/Notification/SearchNotification",
        params,
        {
          headers: { networkId: networkId },
        }
      );

      return response.data;
    },

    markAsRead: async (networkId: string, params: any) => {
      let model = JSON.stringify(params);
      const token = localStorage.getItem("token");
      const response = await apiBase.post<Response<any>>(
        "/Notification/MarkAsRead",
        { model: model },
        {
          headers: { networkId: networkId },
        }
      );

      return response.data;
    },
  };
};
