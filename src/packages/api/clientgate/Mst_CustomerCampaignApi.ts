import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useMst_CustomerCampaign = (apiBase: AxiosInstance) => {
  return {
    Mst_Customer_GetCampaignByCustomerCodeSys: async (
      CustomerCodeSys: Partial<any>
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/CpnCampaign/GetCampaignByCustomerCodeSys",
        {
          CustomerCodeSys: CustomerCodeSys,
        }
      );
    },
  };
};
