import { ApiResponse, Mst_TicketPriority } from "@packages/types";
import { AxiosInstance } from "axios";

interface response {
  Lst_Mst_TicketPriority: Mst_TicketPriority[];
}

export const useMst_TicketPriority = (apiBase: AxiosInstance) => {
  return {
    Mst_TicketPriority_GetAllActive: async (): Promise<
      ApiResponse<response>
    > => {
      return await apiBase.post<any, ApiResponse<response>>(
        "/MstTicketPriority/GetAllActive",
        {}
      );
    },
  };
};
