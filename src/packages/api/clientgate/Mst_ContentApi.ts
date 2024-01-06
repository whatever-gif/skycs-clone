import {
  ApiResponse,
  MstBizColumnData,
  MstSubmissionFormData,
  SearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";
export const useMst_ContentApi = (apiBase: AxiosInstance) => {
  return {
    Mst_BizColumn_GetAllActive: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<MstBizColumnData>>(
        "/MstBizColumn/GetAllActive",
        {}
      );
    },
    MstSubmissionForm_Save: async (
      data: any
    ): Promise<ApiResponse<MstSubmissionFormData>> => {
      return await apiBase.post<any, ApiResponse<MstSubmissionFormData>>(
        "/MstSubmissionForm/Save",
        { ...data }
      );
    },
    Mst_SubmissionForm_GetBySubFormCode: async (
      id: any
    ): Promise<ApiResponse<MstSubmissionFormData>> => {
      return await apiBase.post<any, ApiResponse<MstSubmissionFormData>>(
        "MstSubmissionForm/GetBySubFormCode",
        { SubFormCode: id }
      );
    },
    Mst_SubmissionForm_delete: async (id: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<any>>(
        "/MstSubmissionForm/Delete",
        { SubFormCode: id }
      );
    },
    Mst_SourceData_GetAllActive: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<MstBizColumnData>>(
        "/MstSourceData/GetAllActive",
        {}
      );
    },
    Mst_SubmissionForm_Search: async (
      param: Partial<SearchParam>
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<MstBizColumnData>>(
        "/MstSubmissionForm/Search",
        { ...param }
      );
    },
    Mst_SubmissionForm_GetAllActive: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<MstBizColumnData>>(
        "/MstParamSubmissForm/GetAllActive",
        {}
      );
    },
    MstChannelType_GetAllActive: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<MstBizColumnData>>(
        "/MstChannelType/GetAllActive",
        {}
      );
    },
    MstBulletinType_GetAllActive: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<MstBizColumnData>>(
        "/MstBulletinType/GetAllActive",
        {}
      );
    },
    ZaloTemplate_GetByTemplate: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<MstBizColumnData>>(
        "/ZaloTemplate/GetByTemplate",
        {}
      );
    },
    ZaloTemplate_GetByTemplateId: async (
      key: string
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<MstBizColumnData>>(
        "/ZaloTemplate/GetByTemplateId",
        { TemplateId: key }
      );
    },
  };
};
