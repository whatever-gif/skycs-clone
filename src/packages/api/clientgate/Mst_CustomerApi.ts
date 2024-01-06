import {
  ApiResponse,
  Mst_Customer,
  SearchCustomerParam,
} from "@packages/types";
import { AxiosInstance } from "axios";

interface Mst_Customer_GetByCustomerCode {
  Lst_Mst_Customer?: Mst_Customer[];
  Mst_Customer?: Mst_Customer[];
  Lst_Mst_CustomerZaloUserFollower: any[];
  Lst_Mst_CustomerEmail: any[];
  Lst_Mst_CustomerPhone: any[];
}

export const useMst_Customer = (apiBase: AxiosInstance) => {
  return {
    Mst_Customer_GetAllActive: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<Mst_Customer>>(
        "/MstCustomer/GetAllActive",
        {}
      );
    },

    Mst_Customer_Search: async (
      param: Partial<any>
    ): Promise<ApiResponse<Mst_Customer[]>> => {
      return await apiBase.post<any, ApiResponse<Mst_Customer[]>>(
        "/MstCustomer/Search",
        {
          ...param,
        }
      );
    },

    Mst_Customer_GetByCustomerCode: async (
      CustomerCodeSys: string[]
    ): Promise<ApiResponse<Mst_Customer_GetByCustomerCode>> => {
      return await apiBase.post<
        SearchCustomerParam,
        ApiResponse<Mst_Customer_GetByCustomerCode>
      >("/MstCustomer/GetByCustomerCodeSys", {
        CustomerCodeSys: CustomerCodeSys.join(","),
        ScrTplCodeSys: "SCRTPLCODESYS.2023",
      });
    },

    Mst_Customer_GetAllByCustomerCodeSys: async (
      CustomerCodeSys: string
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post("/MstCustomer/GetAllByCustomerCodeSys", {
        CustomerCodeSys: CustomerCodeSys,
      });
    },

    Mst_Customer_GetByCtmPhoneNo: async (
      params: any
    ): Promise<ApiResponse<any>> => {
      var json = JSON.stringify(params);

      return await apiBase.post("/MstCustomer/GetByCtmPhoneNo", {
        strJsonPhone: json,
      });
    },
    GetByCtmPhoneNoLike: async (params: any): Promise<ApiResponse<any>> => {
      var json = JSON.stringify(params);

      return await apiBase.post("/MstCustomer/GetByCtmPhoneNoLike", {
        strJsonPhone: json,
      });
    },

    Mst_Customer_Delete: async (
      key: Partial<Mst_Customer>
    ): Promise<ApiResponse<Mst_Customer>> => {
      return await apiBase.post<string, ApiResponse<Mst_Customer>>(
        "/MstCustomer/Delete",
        {
          strJson: JSON.stringify(key),
        }
      );
    },

    Mst_Customer_Create: async (
      params: any
    ): Promise<ApiResponse<Partial<Mst_Customer>>> => {
      return apiBase.post<Partial<any>, ApiResponse<Mst_Customer>>(
        "/MstCustomer/Create",
        {
          ...params,
        }
      );
    },

    // Mst_Customer_Update: async ({
    //   key,
    //   data,
    //   ZaloUserFollower,
    //   Email,
    //   Phone,
    //   CtmGroup,
    //   ScrTplCodeSys,
    //   PartnerType,
    //   UserManager,
    // }: {
    //   key: any;
    //   data: any;
    //   ZaloUserFollower: any;
    //   Email: any;
    //   Phone: any;
    //   CtmGroup: any;
    //   PartnerType: any;
    //   ScrTplCodeSys: any;
    //   UserManager: any;
    // }): Promise<ApiResponse<Mst_Customer>> => {
    //   return await apiBase.post("/MstCustomer/Update", {
    //     strJson: JSON.stringify({
    //       ...key,
    //     }),
    //     ColsUpd: data.join(","),
    //     ScrTplCodeSys,
    //     strJsonZaloUserFollower: JSON.stringify(ZaloUserFollower),
    //     strJsonEmail: JSON.stringify(Email),
    //     strJsonPhone: JSON.stringify(Phone),
    //     strJsonCtmGroup: JSON.stringify(CtmGroup),
    //     strJsonCtmPartnerType: JSON.stringify(PartnerType),
    //     strJsonUserManager: JSON.stringify(UserManager),
    //   });
    // },

    Mst_Customer_Update: async (
      params: any
    ): Promise<ApiResponse<Mst_Customer>> => {
      return await apiBase.post("/MstCustomer/Update", {
        ...params,
      });
    },

    Mst_Customer_DeleteMultiple: async (data: string[]) => {
      return await apiBase.post<SearchCustomerParam, ApiResponse<Mst_Customer>>(
        "/MstCustomer/DeleteMultiple",
        {
          strJson: JSON.stringify(data),
        }
      );
    },

    Mst_Customer_Excel_Import: async (
      ScrTplCodeSys: string,
      files: any,
      onSave?: any
    ) => {
      var formData = new FormData();
      formData.append("ScrTplCodeSys", ScrTplCodeSys);
      formData.append("file", files);

      // const param = {
      //   ScrTplCodeSys: ScrTplCodeSys,
      //   files,
      // };

      return await apiBase.post<SearchCustomerParam, ApiResponse<Mst_Customer>>(
        "MstCustomerExcel/Import",
        formData,
        {
          headers: {},
          onUploadProgress(progressEvent) {
            onSave(progressEvent);
          },
        }
      );
    },

    Mst_Customer_Excel_Export: async (param: any) => {
      return await apiBase.post<SearchCustomerParam, ApiResponse<Mst_Customer>>(
        "MstCustomerExcel/Export",
        param
      );
    },

    Mst_Customer_Excel_ExportTemplate: async (ScrTplCodeSys: string) => {
      const param = {
        ScrTplCodeSys: ScrTplCodeSys,
      };

      return await apiBase.post<SearchCustomerParam, ApiResponse<Mst_Customer>>(
        "MstCustomerExcel/ExportTemplate",
        param
      );
    },

    Mst_Customer_Excel_ExportByListCustomerCodeSys: async (
      ScrTplCodeSys: string,
      CustomerCodeSys: string[]
    ) => {
      const param = {
        ScrTplCodeSys: ScrTplCodeSys,
        strJson: JSON.stringify(CustomerCodeSys),
      };

      return await apiBase.post<SearchCustomerParam, ApiResponse<Mst_Customer>>(
        "MstCustomerExcel/ExportByListCustomerCodeSys",
        param
      );
    },
  };
};
