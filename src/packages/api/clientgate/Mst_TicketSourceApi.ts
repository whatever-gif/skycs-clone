import { AxiosInstance } from "axios";

export const useMst_TicketSourceApi = (apiBase: AxiosInstance) => {
  return {
    Mst_TicketSource_GetAllActive: async () => {
      return await apiBase.post<any, any>("/MstTicketSource/GetAllActive", {});
    },
  };
};
