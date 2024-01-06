import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useMst_PartnerTypeApi = (apiBase: AxiosInstance) => {
  return {
    Mst_PartnerType_GetAllActive: async (): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstPartnerType/GetAllActive",
        {}
      );
    },
  };
};
