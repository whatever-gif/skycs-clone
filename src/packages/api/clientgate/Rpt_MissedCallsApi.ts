import {
  ApiResponse,
  Rpt_MissCallSearchParam,
  Rpt_MissedCallsData,
  Rpt_SLASearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRptMissedCallsApi = (apiBase: AxiosInstance) => {
  return {
    Rpt_MissedCalls_Search: async (
      params: Rpt_MissCallSearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Rpt_MissedCallsData>,
        ApiResponse<Rpt_MissedCallsData>
      >("/RptMissedCalls/Search", { ...params });
    },
    Rpt_MissedCalls_ExportExcel: async (
      dataExport: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Rpt_MissedCallsData>,
        ApiResponse<string>
      >("/RptMissedCalls/Export", { ...dataExport });
    },
  };
};
