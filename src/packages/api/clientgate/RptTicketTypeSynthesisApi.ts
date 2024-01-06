import {
  ApiResponse,
  Lst_Rpt_TicketType_Synthesis,
  RptETTicketVolatilitySearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRptTicketTypeSynthesisApi = (apiBase: AxiosInstance) => {
  return {
    RptTicketTypeSynthesis_Search: async (
      params: RptETTicketVolatilitySearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        RptETTicketVolatilitySearchParam,
        ApiResponse<Lst_Rpt_TicketType_Synthesis>
      >("/RptTicketTypeSynthesis/Search", {
        ...params,
      });
    },
  };
};
