import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useMst_CustomerEticket = (apiBase: AxiosInstance) => {
  return {
    Mst_Customer_GetTicketByCustomerCodeSys: async (
      CustomerCodeSys: Partial<any>
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/ETTicket/GetTicketByCustomerCodeSys",
        {
          CustomerCodeSys: CustomerCodeSys,
        }
      );
    },
  };
};
