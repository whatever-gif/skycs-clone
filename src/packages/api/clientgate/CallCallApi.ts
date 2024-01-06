import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useCallCallApi = (apiBase: AxiosInstance) => {
  return {
    CallCall_GetByCustomerCodeSys: async (
      CustomerCodeSys: Partial<any>
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/CallCall/GetByCustomerCodeSys",
        {
          CustomerCodeSys: CustomerCodeSys,
        }
      );
    },
    CallCall_Search: async (param: any) => {
      return await apiBase.post<any, ApiResponse<any[]>>("/CallCall/Search", {
        ...param,
      });
    },
  };
};
