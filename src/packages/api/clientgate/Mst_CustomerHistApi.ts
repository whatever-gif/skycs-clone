import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useMst_CustomerHist = (apiBase: AxiosInstance) => {
  return {
    Mst_CustomerHist_Search: async (
      param: Partial<any>
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstCustomerHist/Search",
        {
          ...param,
        }
      );
    },
  };
};
