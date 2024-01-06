import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useMst_CustomerTypeApi = (apiBase: AxiosInstance) => {
  return {
    Mst_CustomerType_GetAllCustomerType: async (): Promise<
      ApiResponse<any[]>
    > => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstCustomerType/GetAllCustomerType",
        {}
      );
    },
  };
};
