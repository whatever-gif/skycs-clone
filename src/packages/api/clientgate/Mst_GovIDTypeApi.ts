import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useGovIDTypeApi = (apiBase: AxiosInstance) => {
  return {
    MstGovIDType_GetAllActive: async (): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstGovIDType/GetAllActive",
        {}
      );
    },
  };
};
