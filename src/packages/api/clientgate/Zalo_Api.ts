import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useZalo_Api = (apiBase: AxiosInstance) => {
  return {
    Zalo_SearchZaloUser: async (
      params: Partial<any>
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post("/Zalo/SearchZaloUser", {
        ...params,
      });
    },
  };
};
