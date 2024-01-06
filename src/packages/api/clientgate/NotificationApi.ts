import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useNotificationApi = (apiBase: AxiosInstance) => {
  return {
    Notification_Search: async (
      params: Partial<any>
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
      any,
      ApiResponse<any>
    >("/Notification/SearchNotification", {
        ...params,
      });
    },

    Notification_MarkAsRead: async (
      params: Partial<any>
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post("/Notification/MarkAsRead", {
        ...params,
      });
    },
  };
};
