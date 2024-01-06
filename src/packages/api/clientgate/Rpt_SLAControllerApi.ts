import {
  ApiResponse,
  Rpt_ETTicketSynthesisController,
  Rpt_SLASearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRptSLAControllerApi = (apiBase: AxiosInstance) => {
  return {
    Rpt_SLAController_Search: async (
      params: Rpt_SLASearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Rpt_SLASearchParam,
        ApiResponse<Rpt_ETTicketSynthesisController>
      >("/RptSLA/Search", {
        ...params,
      });
    },
    Rpt_SLAController_ExportExcel: async (
      dataExport: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Rpt_ETTicketSynthesisController>,
        ApiResponse<string>
      >("/RptSLA/Export", {
        ...dataExport,
      });
    },
  };
};
