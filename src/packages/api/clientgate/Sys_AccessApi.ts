import { ApiResponse, Sys_AccessData, SearchParam } from "@packages/types";
import { AxiosInstance } from "axios";

export const useSys_AccessApi = (apiBase: AxiosInstance) => {
  return {
    Sys_Access_Search: async (
      param: SearchParam
    ): Promise<ApiResponse<Sys_AccessData>> => {
      return await apiBase.post<SearchParam, ApiResponse<Sys_AccessData>>(
        "/SysAccess/Search",
        {
          ...param,
        }
      );
    },
    Sys_Access_GetAllActive: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParam, ApiResponse<any>>(
        "/SysObject/GetAllActive",
        {}
      );
    },
    Sys_Access_GetByGroupCode: async (
      code: any
    ): Promise<ApiResponse<Sys_AccessData>> => {
      return await apiBase.post<SearchParam, ApiResponse<Sys_AccessData>>(
        "/SysAccess/GetByGroupCode",
        { GroupCode: code }
      );
    },
    Sys_Access_Create: async (
      data: any
    ): Promise<ApiResponse<Sys_AccessData>> => {
      return await apiBase.post<SearchParam, ApiResponse<Sys_AccessData>>(
        "/SysAccess/Create",
        { strJson: JSON.stringify(data) }
      );
    },
    Sys_Access_Update: async (
      data: any
    ): Promise<ApiResponse<Sys_AccessData>> => {
      return await apiBase.post<SearchParam, ApiResponse<Sys_AccessData>>(
        "/SysAccess/Update",
        {
          strJson: JSON.stringify(data),
          ColsUpd: ["GroupName", "GroupDesc", "FlagActive"].join(","),
        }
      );
    },
    Sys_Access_Delete: async (
      key: string
    ): Promise<ApiResponse<Sys_AccessData>> => {
      return await apiBase.post("/SysAccess/Delete", {
        strJson: JSON.stringify({
          GroupCode: key,
        }),
      });
    },
  };
};
