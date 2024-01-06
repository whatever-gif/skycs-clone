import { ApiResponse, Mst_TicketEstablishInfo } from "@/packages/types";
import { AxiosInstance } from "axios";

interface Mst_TicketEstablishInfoApi {
  Lst_Mst_TicketStatus: Mst_TicketEstablishInfo[];
  Lst_Mst_TicketPriority: Mst_TicketEstablishInfo[];
  Lst_Mst_TicketType: Mst_TicketEstablishInfo[];
  Lst_Mst_TicketSource: Mst_TicketEstablishInfo[];
  Lst_Mst_ReceptionChannel: Mst_TicketEstablishInfo[];
  Lst_Mst_ContactChannel: Mst_TicketEstablishInfo[];
  Lst_Mst_TicketCustomType: Mst_TicketEstablishInfo[];
}

export const useMst_TicketEstablishInfoApi = (apiBase: AxiosInstance) => {
  return {
    Mst_TicketEstablishInfoApi_GetAllInfo: async (): Promise<
      ApiResponse<any>
    > => {
      return await apiBase.post<any, ApiResponse<Mst_TicketEstablishInfoApi>>(
        "/MstTicketEstablishInfo/GetAllInfo",
        {}
      );
    },
    Mst_TicketEstablishInfoApi_GetTicketType: async (): Promise<
      ApiResponse<any>
    > => {
      return await apiBase.post<any, ApiResponse<Mst_TicketEstablishInfoApi>>(
        "/MstTicketEstablishInfo/GetTicketType",
        {}
      );
    },
    Mst_TicketEstablishInfoApi_GetTicketCustomType: async (): Promise<
      ApiResponse<any>
    > => {
      return await apiBase.post<any, ApiResponse<Mst_TicketEstablishInfoApi>>(
        "/MstTicketEstablishInfo/GetTicketCustomType",
        {}
      );
    },
    Mst_TicketEstablishInfoApi_Save: async (
      param: Mst_TicketEstablishInfoApi
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<Mst_TicketEstablishInfoApi>>(
        "/MstTicketEstablishInfo/Save",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
  };
};
