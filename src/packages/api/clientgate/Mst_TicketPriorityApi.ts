import { AxiosInstance } from "axios";

export const useMst_TicketPriorityApi = (apiBase: AxiosInstance) => {
  return {
    Mst_TicketPriority_GetAllActive: async () => {
      return await apiBase.post<any, any>(
        "/MstTicketPriority/GetAllActive",
        {}
      );
    },
  };
};
