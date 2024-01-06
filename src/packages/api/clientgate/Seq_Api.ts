import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useSeq_Api = (apiBase: AxiosInstance) => {
  return {
    Seq_GetCustomerCodeSys: async (): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/Seq/GetCustomerCodeSys",
        {}
      );
    },
  };
};
