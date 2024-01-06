import {
  ApiResponse,
  Rpt_ETTicketSynthesisController,
  Rpt_ETTicketDetailControllerSearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRptETTicketSynthesisControllerApi = (
  apiBase: AxiosInstance
) => {
  return {
    Rpt_ETTicketSynthesisController_Search: async (
      params: Rpt_ETTicketDetailControllerSearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Rpt_ETTicketDetailControllerSearchParam,
        ApiResponse<Rpt_ETTicketSynthesisController>
      >("/RptETTicketSynthesis/Search", {
        ...params,
      });
    },
    Rpt_ETTicketSynthesisController_ExportExcel: async (
      dataExport: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Rpt_ETTicketSynthesisController>,
        ApiResponse<string>
      >("/RptETTicketSynthesis/Export", {
        ...dataExport,
      });
    },
  };
};
