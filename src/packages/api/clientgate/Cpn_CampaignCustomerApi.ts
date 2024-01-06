import {
  ApiResponse,
  Cpn_CampaignCustomerCallHistData,
  Cpn_CampaignCustomerData,
} from "@/packages/types";

import { AxiosInstance } from "axios";

interface Cpn_CampaignCustomerParam {
  CampaignCode: string;
  CampaignCustomerStatus?: string;
  CustomerCodeSys?: string;
}

interface Cpn_CampaignCustomerCallHistParam {
  CampaignCode: string;
  CustomerPhoneNo?: string;
  AgentCode?: string;
}
export const useCpn_CampaignCustomerApi = (apiBase: AxiosInstance) => {
  return {
    Cpn_CampaignCustomer_Get: async (
      params: Partial<Cpn_CampaignCustomerParam>
    ): Promise<ApiResponse<Cpn_CampaignCustomerData | any>> => {
      return await apiBase.post<
        Cpn_CampaignCustomerParam,
        ApiResponse<Cpn_CampaignCustomerData>
      >("/CpnCampaignCustomer/GetCampaignCustomer", {
        ...params,
      });
    },

    Cpn_CampaignCustomer_GetCallHist: async (
      params: Partial<Cpn_CampaignCustomerCallHistParam>
    ): Promise<ApiResponse<Cpn_CampaignCustomerCallHistData | any>> => {
      return await apiBase.post<
        Cpn_CampaignCustomerCallHistParam,
        ApiResponse<Cpn_CampaignCustomerCallHistData>
      >("/CpnCampaignCustomer/GetCampaignCustomerCallHist", {
        ...params,
      });
    },

    Cpn_CampaignCustomer_Save: async (
      params: Partial<any>
    ): Promise<ApiResponse<Cpn_CampaignCustomerCallHistData | any>> => {
      return await apiBase.post<
        Cpn_CampaignCustomerCallHistParam,
        ApiResponse<Cpn_CampaignCustomerCallHistData>
      >("/CpnCampaignCustomer/Save", {
        strJson: JSON.stringify({
          Cpn_CampaignCustomer: {
            ...params,
          },
        }),
      });
    },
  };
};
