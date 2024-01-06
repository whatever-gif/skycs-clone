import {
  ApiResponse,
  Rpt_CpnCampaignResultCallData,
  Rpt_CpnCampaignResultCallSearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

interface Rpt_CpnCampaignResultCall_Save {
  OrgID: string;
  EstablishID: string;
  FlagNotifySystem: string;
  FlagNotifyEmail: string;
  FlagNotifySMS: string;
  FlagNotifyZalo: string;
  SubFormCodeEmail: string;
  SubFormCodeSMS: string;
  SubFormCodeZalo: string;
  FlagActive: string;
  Remark: string;
}

export const useMst_EstablishRemindETicket = (apiBase: AxiosInstance) => {
  return {
    Mst_EstablishRemindETicket_GetByOrgID: async (
      OrgID: string
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Rpt_CpnCampaignResultCallSearchParam,
        ApiResponse<Rpt_CpnCampaignResultCallData>
      >("/MstEstablishRemindETicket/GetByOrgID", {
        OrgID,
      });
    },
    Rpt_CpnCampaignResultCall_Save: async (
      data: Rpt_CpnCampaignResultCall_Save
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Rpt_CpnCampaignResultCall_Save>,
        ApiResponse<any>
      >("/MstEstablishRemindETicket/Save", {
        strJson: JSON.stringify(data),
      });
    },
  };
};
