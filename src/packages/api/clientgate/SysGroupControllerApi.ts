import { ApiResponse, Sys_GroupController, SearchParam } from "@packages/types";
import { AxiosInstance } from "axios";

export const useSys_GroupControllerApi = (apiBase: AxiosInstance) => {
  return {
    Sys_GroupController_Search: async (
      param: SearchParam
    ): Promise<ApiResponse<Sys_GroupController>> => {
      return await apiBase.post<SearchParam, ApiResponse<Sys_GroupController>>(
        "/SysGroup/Search",
        {
          ...param,
        }
      );
    },
    Sys_GroupController_GetAllActive: async (): Promise<
      ApiResponse<Sys_GroupController>
    > => {
      return await apiBase.post<SearchParam, ApiResponse<Sys_GroupController>>(
        "/SysGroup/GetAllActive",
        {}
      );
    },
    Sys_GroupController_GetByGroupCode: async (
      code: any
    ): Promise<ApiResponse<Sys_GroupController>> => {
      return await apiBase.post<SearchParam, ApiResponse<Sys_GroupController>>(
        "/SysGroup/GetByGroupCode",
        { GroupCode: code }
      );
    },
  };
};
