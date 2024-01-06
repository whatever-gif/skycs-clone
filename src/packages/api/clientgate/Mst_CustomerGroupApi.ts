import {
  ApiResponse,
  Mst_CustomerGroupData,
  SearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useMst_CustomerGroupApi = (apiBase: AxiosInstance) => {
  return {
    Mst_CustomerGroup_GetAllActive: async (): Promise<
      ApiResponse<Mst_CustomerGroupData>
    > => {
      return await apiBase.post<any, ApiResponse<Mst_CustomerGroupData>>(
        "/MstCustomerGroup/GetAllActive",
        {}
      );
    },
    Mst_CustomerGroup_Search: async (
      params: SearchParam
    ): Promise<ApiResponse<Mst_CustomerGroupData>> => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Mst_CustomerGroupData>
      >("/MstCustomerGroup/Search", {
        ...params,
      });
    },
    Mst_CustomerGroup_GetByCustomerGrpCode: async (
      codeCustomer: string,
      codeOrgID: string
    ): Promise<ApiResponse<Mst_CustomerGroupData>> => {
      return await apiBase.post<string, ApiResponse<Mst_CustomerGroupData>>(
        "/MstCustomerGroup/GetByCustomerGrpCode",
        {
          CustomerGrpCode: codeCustomer,
          OrgID: codeOrgID,
        }
      );
    },

    Mst_CustomerGroup_Update: async (
      data: any
    ): Promise<ApiResponse<Mst_CustomerGroupData>> => {
      return await apiBase.post<
        Partial<Mst_CustomerGroupData>,
        ApiResponse<Mst_CustomerGroupData>
      >("/MstCustomerGroup/Update", {
        strJson: JSON.stringify(data),
        ColsUpd: Object.keys(data).join(","),
      });
    },

    Mst_CustomerGroup_Create: async (
      data: Partial<Mst_CustomerGroupData>
    ): Promise<ApiResponse<Mst_CustomerGroupData>> => {
      return await apiBase.post<
        Partial<Mst_CustomerGroupData>,
        ApiResponse<Mst_CustomerGroupData>
      >("/MstCustomerGroup/Create", {
        strJson: JSON.stringify(data),
      });
    },

    Mst_CustomerGroup_Delete: async (key: any) => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Mst_CustomerGroupData>
      >("/MstCustomerGroup/Delete", { strJson: JSON.stringify(key[0]) });
    },

    Mst_CustomerGroupData_DeleteMultiple: async (data: any) => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Mst_CustomerGroupData>
      >("/MstCustomerGroup/DeleteMultiple", {
        strJson: JSON.stringify(data),
      });
    },

    Mst_CustomerGroupData_ImportExcel: async (
      file: File
    ): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload

      return await apiBase.post<File, ApiResponse<any>>(
        "/MstArea/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },

    Mst_CustomerGroupData_ExportTemplate: async (): Promise<
      ApiResponse<any>
    > => {
      return await apiBase.post<
        Partial<Mst_CustomerGroupData>,
        ApiResponse<string>
      >("/MstArea/ExportTemplate", {});
    },

    Mst_CustomerGroupData_ExportByListAreaCode: async (
      keys: string[]
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Mst_CustomerGroupData>,
        ApiResponse<string>
      >("/MstArea/ExportByListAreaCode", {
        ListAreaCode: keys.join(","),
      });
    },

    Mst_CustomerGroupData_ExportExcel: async (
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Mst_CustomerGroupData>,
        ApiResponse<string>
      >("/MstArea/Export", {
        KeyWord: keyword,
      });
    },
  };
};
