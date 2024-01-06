import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useMst_CustomerContact = (apiBase: AxiosInstance) => {
  return {
    Mst_CustomerContact_Search: async (
      param: Partial<any>
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstCustomerContact/Search",
        {
          ...param,
        }
      );
    },
    Mst_CustomerContact_Create: async (
      data: Partial<any>
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstCustomerContact/Create",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
    Mst_CustomerContact_Delete: async (
      data: Partial<any>
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstCustomerContact/Delete",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
  };
};
