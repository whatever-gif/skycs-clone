import { ApiResponse, Mst_NNTController, SearchParam } from "@packages/types";
import { AxiosInstance } from "axios";

export const useMst_NNTControllerApi = (apiBase: AxiosInstance) => {
  return {
    Mst_NNTController_Search: async (
      param: SearchParam
    ): Promise<ApiResponse<Mst_NNTController>> => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_NNTController>>(
        "/MstNNT/Search",
        {
          ...param,
        }
      );
    },
    Mst_NNTController_GetAllActive: async (): Promise<
      ApiResponse<Mst_NNTController>
    > => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_NNTController>>(
        "/MstNNT/GetAllActive",
        {}
      );
    },
    MstOrg_GetOrgsNotInSolution: async (): Promise<
      ApiResponse<Mst_NNTController>
    > => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_NNTController>>(
        "/MstOrg/GetOrgsNotInSolution",
        {}
      );
    },
    Mst_NNTController_GetNNTCode: async (
      code: any
    ): Promise<ApiResponse<Mst_NNTController>> => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_NNTController>>(
        "/MstNNT/GetByMST",
        {
          MST: code,
        }
      );
    },
    Mst_NNTController_GetOrgCode: async (
      OrgID: any
    ): Promise<ApiResponse<Mst_NNTController>> => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_NNTController>>(
        "/MstNNT/GetByOrgID",
        {
          OrgID: OrgID,
        }
      );
    },

    Mst_NNTController_Delete: async (
      key: string
    ): Promise<ApiResponse<Mst_NNTController>> => {
      return await apiBase.post<string, ApiResponse<Mst_NNTController>>(
        "/MstNNT/Delete",
        {
          MST: key,
        }
      );
    },
    Mst_NNTController_Create: async (
      data: Partial<Mst_NNTController>
    ): Promise<ApiResponse<Partial<Mst_NNTController>>> => {
      return apiBase.post<
        Partial<Mst_NNTController>,
        ApiResponse<Mst_NNTController>
      >("/MstNNT/Create", {
        strJson: JSON.stringify(data),
      });
    },

    Mst_NNTController_Update: async (
      data: Partial<Mst_NNTController>
    ): Promise<ApiResponse<Mst_NNTController>> => {
      
      return await apiBase.post("/MstNNT/Update", {
        strJson: JSON.stringify(data),
        ColsUpd: Object.keys(data).join(","),
      });
    },

    Mst_NNTController_GetMSTForETicket: async (): Promise<
      ApiResponse<Mst_NNTController>
    > => {
      return await apiBase.post("/MstNNT/GetMSTForETicket", {});
    },

    Mst_NNTController_Upload: async (file: File): Promise<ApiResponse<any>> => {
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
    Mst_NNTController_UploadFile: async (
      file: File
    ): Promise<ApiResponse<any>> => {
      // file is the file you want to upload
      const form = new FormData();
      form.append("file", file);
      return await apiBase.post<File, ApiResponse<any>>(
        "/File/UploadFile",
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
