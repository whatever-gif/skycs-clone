import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

// field group
export const useMdMetaColumnApi = (apiBase: AxiosInstance) => {
  return {
    MDMetaColumn_Search: async (params: any) => {
      return await apiBase.post<string, ApiResponse<any>>(
        "MDMetaColumn/Search",
        {
          ...params,
        }
      );
    },
    MDMetaColumn_GetAllActive: async () => {
      return await apiBase.post<string, ApiResponse<any>>(
        "MDMetaColumn/GetAllActive",
        {}
      );
    },
    MDMetaScreenTemplate_GetAllActive: async () => {
      return await apiBase.post<string, ApiResponse<any>>(
        "MDMetaScreenTemplate/GetAllActive",
        {}
      );
    },
    MDMetaColumn_Create: async (data: any) => {
      return await apiBase.post<string, ApiResponse<any>>(
        "MDMetaColumn/Create",
        { strJson: JSON.stringify(data) }
      );
    },
    MDMetaColumn_Update: async (data: any) => {
      return await apiBase.post<string, ApiResponse<any>>(
        "MDMetaColumn/Update",
        {
          strJson: JSON.stringify(data),
          ColsUpd: "ColCode,ColDataType,ColCaption,FlagActive,JsonListOption",
        }
      );
    },
    MDMetaColumn_Delete: async (code: any) => {
      return await apiBase.post<string, ApiResponse<any>>(
        "MDMetaColumn/Delete",
        {
          ColCodeSys: code,
        }
      );
    },
  };
};
