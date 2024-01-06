import { AxiosInstance } from "axios";

export const useMst_ReceptionChannelApi = (apiBase: AxiosInstance) => {
  return {
    Mst_ReceptionChannel_GetAllActive: async () => {
      return await apiBase.post<any, any>(
        "/MstReceptionChannel/GetAllActive",
        {}
      );
    },
  };
};
