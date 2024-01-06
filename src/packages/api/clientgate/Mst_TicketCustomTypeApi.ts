import { AxiosInstance } from "axios";

export const useMst_TicketCustomTypeApi = (apiBase: AxiosInstance) => {
  return {
    Mst_TicketCustomType_GetAllActive: async () => {
      return await apiBase.post<any, any>(
        "/MstTicketCustomType/GetAllActive",
        {}
      );
    },
  };
};
