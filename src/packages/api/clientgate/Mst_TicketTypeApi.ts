import { AxiosInstance } from "axios";

export const useMst_TicketTypeApi = (apiBase: AxiosInstance) => {
  return {
    Mst_TicketType_GetAllActive: async () => {
      return await apiBase.post<any, any>("/MstTicketType/GetAllActive", {});
    },
  };
};
