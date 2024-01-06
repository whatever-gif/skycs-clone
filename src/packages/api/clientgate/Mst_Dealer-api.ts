import {ApiResponse, DeleteDealerParam, FlagActiveEnum, Mst_Dealer, SearchDealerParam,} from "@/packages/types";
import {AxiosInstance} from "axios";

export const useDealerApi = (apiBase: AxiosInstance) => {
  return {
    Mst_Dealer_ExportTemplate: async (): Promise<ApiResponse<string>> => {
      return await apiBase.post<any,
        ApiResponse<string>
      >("/MstDealer/ExportTemplate", {
      });
    },
    Mst_Dealer_Search: async (
      params: Partial<SearchDealerParam>
    ): Promise<ApiResponse<Mst_Dealer>> => {
      return await apiBase.post<
        Partial<SearchDealerParam>,
        ApiResponse<Mst_Dealer>
      >("/MstDealer/Search", {
        ...params,
      });
    },
    Mst_Dealer_GetAllActive: async (): Promise<ApiResponse<Mst_Dealer>> => {
      return await apiBase.post<
        Partial<SearchDealerParam>,
        ApiResponse<Mst_Dealer>
      >("/MstDealer/GetAllActive");
    },
    Mst_Dealer_Create: async (values: Partial<Mst_Dealer>) => {
      return await apiBase.post<DeleteDealerParam, ApiResponse<Mst_Dealer>>(
        "/MstDealer/Create",
        {
          strJson: JSON.stringify({
            ...values,
            BUCode: `HTV.${values.DealerCode}`,
            BUParentCode: `HTV.${values.DealerCode}%`,
            FlagActive: !!values.FlagActive
              ? values.FlagActive
                ? FlagActiveEnum.Active
                : FlagActiveEnum.Inactive
              : FlagActiveEnum.Inactive,
            FlagAutoLXX: values.FlagAutoLXX ?? FlagActiveEnum.Inactive,
            DealerName: values.DealerName ?? "",
            FlagDirect: values.FlagDirect ?? FlagActiveEnum.Inactive,
            DealerScale: values.DealerScale ?? "",
            DealerPhoneNo: values.DealerPhoneNo ?? "",
            DealerFaxNo: values.DealerFaxNo ?? "",
            CompanyName: values.CompanyName ?? "",
            CompanyAddress: values.CompanyAddress ?? "",
            ShowroomAddress: values.ShowroomAddress ?? "",
            GarageAddress: values.GarageAddress ?? "",
            GaragePhoneNo: values.GaragePhoneNo ?? "",
            GarageFaxNo: values.GaragePhoneNo ?? "",
            DirectorName: values.DirectorName ?? "",
            DirectorPhoneNo: values.DirectorPhoneNo ?? "",
            DirectorEmail: values.DirectorEmail ?? "",
            SalesManagerName: values.SalesManagerName ?? "",
            SalesManagerPhoneNo: values.SalesManagerPhoneNo ?? "",
            SalesManagerEmail: values.SalesManagerEmail ?? "",
            GarageManagerName: values.GarageManagerName ?? "",
            GarageManagerPhoneNo: values.GarageManagerPhoneNo ?? "",
            GarageManagerEmail: values.GarageManagerEmail ?? "",
            TaxCode: values.TaxCode ?? "",
            ContactName: values.ContactName ?? "",
            Signer: values.Signer ?? "",
            SignerPosition: values.SignerPosition ?? "",
            CtrNoSigner: values.CtrNoSigner ?? "",
            CtrNoSignerPosition: values.CtrNoSignerPosition ?? "",
            HTCStaffInCharge: values.HTCStaffInCharge ?? "",
            Remark: values.Remark ?? "",
            DealerAddress01: values.DealerAddress01 ?? "",
            DealerAddress02: values.DealerAddress02 ?? "",
            DealerAddress03: values.DealerAddress03 ?? "",
            DealerAddress04: values.DealerAddress04 ?? "",
            DealerAddress05: values.DealerAddress05 ?? "",
            FlagTCG: values.FlagTCG ?? FlagActiveEnum.Inactive,
            FlagAutoMapVIN: values.FlagAutoMapVIN ?? FlagActiveEnum.Inactive,
            FlagAutoSOAppr: values.FlagAutoSOAppr ?? FlagActiveEnum.Inactive,
          } as Mst_Dealer),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    },
    Mst_Dealer_Update: async (code: string, values: Partial<Mst_Dealer>) => {
      return await apiBase.post<DeleteDealerParam, ApiResponse<Mst_Dealer>>(
        "/MstDealer/Update",
        {
          strJson: JSON.stringify({
            DealerCode: code,
            ...values,
            FlagActive: !!values.FlagActive
              ? values.FlagActive
                ? FlagActiveEnum.Active
                : FlagActiveEnum.Inactive
              : FlagActiveEnum.Inactive,
          }),
          ColsUpd: Object.keys(values),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    },
    Mst_Dealer_Delete: async (
      code: string
    ): Promise<ApiResponse<Mst_Dealer>> => {
      return await apiBase.post<DeleteDealerParam, ApiResponse<Mst_Dealer>>(
        "/MstDealer/Delete",
        {
          DealerCode: code,
        }
      );
    },
    Mst_Dealer_DeleteMultiple: async (codes: string[]) => {
      return await apiBase.post<any, ApiResponse<Mst_Dealer>>(
        "/MstDealer/DeleteMultiple",
        {
          strJson: JSON.stringify(
            codes.map(c => {
              return {
                DealerCode: c
              }
            })
          )
        }
      )

    },
    getDealerAllActive: async (): Promise<ApiResponse<Mst_Dealer>> => {
      return await apiBase.post<any, ApiResponse<Mst_Dealer>>(
        "/MstDealer/GetAllActive"
      );
    },
    Mst_Dealer_Export: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<Mst_Dealer>>(
        "/MstDealer/Export",
        {
          FlagActive: "1",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        }
      );
    },
    Mst_Dealer_ExportByListDealerCode: async (
      selectedCodes: string[]
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<Mst_Dealer>>(
        "/MstDealer/ExportByListDealerCode",
        {
          ListDealerCode: selectedCodes.join(","),
        }
      );
    },
    Mst_Dealer_Import: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>(
        "/MstDealer/Import",
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
