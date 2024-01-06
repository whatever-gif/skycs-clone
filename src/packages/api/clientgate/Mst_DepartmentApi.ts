import {
  ApiResponse,
  Mst_DepartmentControl,
  SearchParam,
} from "@packages/types";
import { AxiosInstance } from "axios";

export const useMst_DepartmentControlApi = (apiBase: AxiosInstance) => {
  return {
    Mst_DepartmentControl_Search: async (
      param: SearchParam
    ): Promise<ApiResponse<Mst_DepartmentControl>> => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Mst_DepartmentControl>
      >("/MstDepartment/Search", {
        ...param,
      });
    },
    Mst_DepartmentControl_GetByDepartmentCode: async (
      code: any,
      orgId?: any
    ): Promise<ApiResponse<Mst_DepartmentControl>> => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Mst_DepartmentControl>
      >("/MstDepartment/GetByDepartmentCode", {
        DepartmentCode: code,
        OrgID: orgId,
      });
    },

    Mst_DepartmentControl_GetAgentByDepartmentCode: async ({
      DepartmentCode,
      OrgID,
    }: any): Promise<ApiResponse<Mst_DepartmentControl>> => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Mst_DepartmentControl>
      >("/MstDepartment/GetAgentByDepartmentCode", {
        DepartmentCode: DepartmentCode,
        OrgID: OrgID,
      });
    },

    Mst_DepartmentControl_GetByOrgID: async (
      code: any
    ): Promise<ApiResponse<Mst_DepartmentControl>> => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Mst_DepartmentControl>
      >("/MstDepartment/GetByOrgID", {
        OrgID: code,
      });
    },
    Mst_DepartmentControl_GetByUserCode: async (): Promise<
      ApiResponse<Mst_DepartmentControl>
    > => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Mst_DepartmentControl>
      >("/MstDepartment/GetByUserCode", {});
    },
    Mst_DepartmentControl_GetAllActive: async (): Promise<
      ApiResponse<Mst_DepartmentControl[]>
    > => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Mst_DepartmentControl[]>
      >("/MstDepartment/GetAllActive", {});
    },

    Mst_DepartmentControl_Delete: async (
      data: any
    ): Promise<ApiResponse<Mst_DepartmentControl>> => {
      return await apiBase.post<string, ApiResponse<Mst_DepartmentControl>>(
        "/MstDepartment/Delete",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
    Mst_DepartmentControl_Create: async (
      data: Partial<any>
    ): Promise<ApiResponse<Partial<Mst_DepartmentControl>>> => {
      return apiBase.post<
        Partial<Mst_DepartmentControl>,
        ApiResponse<Mst_DepartmentControl>
      >("/MstDepartment/Create", {
        strJson: JSON.stringify(data),
      });
    },

    Mst_DepartmentControl_By_OrgID: async (
      OrgID: string
    ): Promise<ApiResponse<Partial<Mst_DepartmentControl>>> => {
      return apiBase.post<
        Partial<Mst_DepartmentControl>,
        ApiResponse<Mst_DepartmentControl>
      >("/MstDepartment/GetByOrgID", { OrgID: OrgID });
    },

    Mst_DepartmentControl_Update: async (
      data: any
    ): Promise<ApiResponse<Mst_DepartmentControl>> => {
      return await apiBase.post("/MstDepartment/Update", {
        strJson: JSON.stringify(data),
        ColsUpd: [
          "DepartmentName",
          "DepartmentCodeParent",
          "FlagActive",
          "DepartmentDesc",
          "FlagAutoDiv",
        ].join(","),
      });
    },

    Mst_DepartmentControl_Upload: async (
      file: File
    ): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload

      return await apiBase.post<File, ApiResponse<any>>(
        "/MstDealerType/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
  };
};
