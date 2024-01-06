import { OrgInfo } from "./../../types/auth";
import {
  ApiResponse,
  Cpn_Campaign,
  Cpn_CampaignSearch,
  Cpn_Campaign_GetByCode,
} from "@packages/types";
import { AxiosInstance } from "axios";
import { match } from "ts-pattern";

interface Cpn_CampaignApi {
  CampaignCode: string;
  OrgID: string;
}

interface Props {
  Url: string;
}

export const useCpn_Campaign = (apiBase: AxiosInstance) => {
  return {
    Cpn_Campaign_Search: async (
      param: Partial<Cpn_CampaignSearch>
    ): Promise<ApiResponse<Partial<Cpn_Campaign[]>>> => {
      return await apiBase.post<
        Cpn_CampaignSearch,
        ApiResponse<Partial<Cpn_Campaign[]>>
      >("/CpnCampaign/Search", param);
    },

    Cpn_Campaign_GetAllActive: async (): Promise<
      ApiResponse<Partial<Cpn_Campaign[]>>
    > => {
      return await apiBase.post<any, ApiResponse<Partial<Cpn_Campaign[]>>>(
        "/CpnCampaign/GetAllActive"
      );
    },

    Cpn_Campaign_GetCampaignColCfgCodeSys: async (): Promise<
      ApiResponse<Partial<Cpn_Campaign>>
    > => {
      return await apiBase.post<any, ApiResponse<Partial<Cpn_Campaign>>>(
        "/Seq/GetByCampaignCode",
        {}
      );
    },

    Cpn_Campaign_Update: async (
      param: any,
      key?: string
    ): Promise<ApiResponse<Partial<Cpn_Campaign>>> => {
      if (key) {
        return apiBase.post<Partial<any>, ApiResponse<Partial<Cpn_Campaign>>>(
          "/CpnCampaign/Update",
          {
            strJson: JSON.stringify(param),
          }
        );
      } else {
        return apiBase.post<Partial<any>, ApiResponse<Partial<Cpn_Campaign>>>(
          "/CpnCampaign/Create",
          {
            strJson: JSON.stringify(param),
          }
        );
      }
    },

    Cpn_Campaign_Delete: async (param: any) => {
      return await apiBase.post<any, ApiResponse<any>>("/CpnCampaign/Delete", {
        strJson: JSON.stringify(param),
      });
    },

    Cpn_Campaign_DeleteMultiple: async (param: any[]) => {
      return await apiBase.post<any, ApiResponse<any>>(
        "/CpnCampaign/DeleteMulti",
        {
          strJson: JSON.stringify(param),
        }
      );
    },

    Cpn_Campaign_ExportTemplate: async (
      CampaignTypeCode: string
    ): Promise<ApiResponse<Partial<Props>>> => {
      return await apiBase.post<string, ApiResponse<Props>>(
        "/CpnCampaign/ExportTemplate",
        {
          CampaignTypeCode: CampaignTypeCode,
        }
      );
    },

    Cpn_Campaign_Import: async (
      file: File[],
      CampaignTypeCode: string
    ): Promise<ApiResponse<any>> => {
      // console.log("file ", file[0]);
      const form = new FormData();
      form.append("file", file[0]); // file is the file you want to upload
      form.append("CampaignTypeCode", CampaignTypeCode); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>(
        "/CpnCampaign/Import",
        form
        // {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      );
    },

    Cpn_Campaign_GetByCode: async (
      CampaignCode: string,
      OrgID: string
    ): Promise<ApiResponse<Partial<Cpn_Campaign_GetByCode>>> => {
      return await apiBase.post<
        Partial<{
          CampaignCode: string;
          OrgID: string;
        }>,
        ApiResponse<Partial<Cpn_Campaign_GetByCode>>
      >("CpnCampaign/GetByCampaignCode", {
        CampaignCode,
        OrgID,
      });
    },

    Cpn_Campaign_ExecuteState: async (
      param: Cpn_CampaignApi,
      type: string
    ): Promise<ApiResponse<Partial<Cpn_Campaign>>> => {
      return await apiBase.post<any, ApiResponse<Partial<Cpn_Campaign>>>(
        `/CpnCampaign/${type}`,
        { ...param }
      );
    },

    Cpn_Campaign_MappingColumn: async (): Promise<
      ApiResponse<Partial<Cpn_Campaign>>
    > => {
      return await apiBase.post<any, ApiResponse<Partial<any>>>(
        "/CpnCampaign/MappingColumn"
      );
    },
  };
};
