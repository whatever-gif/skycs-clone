import { AxiosInstance } from "axios";

export const useMst_TicketStatusApi = (apiBase: AxiosInstance) => {
  return {
    Mst_TicketStatus_GetAllActive: async () => {
      return await apiBase.post<any, any>("/MstTicketStatus/GetAllActive", {});
    },
  };
};
