import {
  ApiResponse,
  Rpt_ETTicketDetailControllerData,
  Rpt_ETTicketDetailControllerSearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRpt_ETTicketDetailControllerApi = (apiBase: AxiosInstance) => {
  return {
    Rpt_ETTicketDetailController_Search: async (
      params: Rpt_ETTicketDetailControllerSearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Rpt_ETTicketDetailControllerSearchParam,
        ApiResponse<Rpt_ETTicketDetailControllerData>
      >("/RptETTicketDetail/Search", {
        ...params,
      });
    },
    Rpt_ETTicketDetailController_ExportExcel: async (
      dataExport: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Rpt_ETTicketDetailControllerData>,
        ApiResponse<string>
      >("/RptETTicketDetail/Export", {
        ...dataExport,
      });
    },
  };
};
