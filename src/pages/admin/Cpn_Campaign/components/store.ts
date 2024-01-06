import { atom } from "jotai";
export const selectedItemsAtom = atom<string[]>([]);
export const keywordAtom = atom<string>("");
import { Mst_PaymentTermData } from "@packages/types";

export enum ViewMode {
  Readonly = "readonly",
  Edit = "edit",
}

export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<Mst_PaymentTermData | undefined>(undefined);

export const viewingDataAtom = atom(
  (get) => {
    return {
      rowIndex: get(viewingRowAtom),
      item: get(viewingItemAtom),
    };
  },
  (get, set, data) => {
    if (!data) {
      set(viewingRowAtom, undefined);
      set(viewingItemAtom, undefined);
    } else {
      const { rowIndex, item } = data as any;
      set(viewingRowAtom, rowIndex);
      set(viewingItemAtom, item);
    }
  }
);

export const defaultValue = atom<any>({
  CampaignTypeCode: "",
  CampaignTypeName: "",
  CampaignTypeDesc: "",
  Lst_Mst_CustomerFeedBack: [],
  Lst_Mst_CustomColumnCampaignType: [],
});
export const ListInfoDetailCampaignValue = atom<any[]>([]);
export const dataComponent = atom<any>({
  CampaignTypeCode: "",
  CampaignTypeName: "",
  CampaignTypeDesc: "",
  Lst_Mst_CustomerFeedBack: [],
  Lst_Mst_CustomColumnCampaignType: [],
});
export const flagSelection = atom<any>("");
export const popupVisibleAtom = atom<boolean>(false);
export const InfoDetailCampaignValue = atom<any>({
  listOption: [],
});

export const typeSelectAtom = atom<string[]>([
  "SELECTMULTIPLEDROPDOWN",
  "SELECTMULTIPLESELECTBOX",
  "SELECTONEDROPDOWN",
  "SELECTONERADIO",
]);

// CpnCampaignInfo
export const flagStatus = atom<string>("");
export const flagSelectorAtom = atom<string>("");
export const currentInfo = atom<any>({
  CampaignAgent: [],
  uploadFiles: [],
});
export const visiblePopupAtom = atom<boolean>(false);
export const visiblePopupImportAtom = atom<boolean>(false);
export const listCampaignAtom = atom<any[]>([]);
export const CampaignTypeAtom = atom<string>("");
export const listCampaignAgentAtom = atom<any[]>([]);
export const setListCampaignAgentAtom = atom(
  (get) => get(listCampaignAgentAtom),
  (get, set, data: any) => {
    if (data?.addedItems.length) {
      set(listCampaignAgentAtom, [
        ...get(listCampaignAgentAtom),
        ...data?.addedItems,
      ]);
    }
    if (data?.removedItems.length) {
      const newValue = get(listCampaignAgentAtom).filter((item: any) => {
        return item.UserCode !== data.removedItems[0].UserCode;
      });
      // console.log("newValue ", newValue);
      set(listCampaignAgentAtom, [...newValue]);
    }
  }
);
export const isShowCustomerRateAtom = atom<boolean>(false);
export const dynamicFields = atom<any[]>([]);
export const dateFieldAtom = atom<string[]>(["CreateDTimeUTC"]);
export const tagFieldAtom = atom<string[]>([
  "MASTERDATASELECTMULTIPLE",
  "SELECTMULTIPLE",
  "SELECTMULTIPLEDROPDOWN",
  "SELECTMULTIPLESELECTBOX",
]);
export const selectFieldAtom = atom<string[]>([
  "MASTERDATA",
  "SELECTONE",
  "SELECTONEDROPDOWN",
  "SELECTONERADIO",
]);

export const countryFieldAtom = atom<string[]>([
  "CountryCodeDelivery",
  "CountryCodeContact",
  "CountryCodeInvoice",
]);

export const provinceFieldAtom = atom<string[]>([
  "ProvinceCodeDelivery",
  "ProvinceCodeContact",
  "ProvinceCodeInvoice",
]);

export const districtFieldAtom = atom<string[]>([
  "DistrictCodeDelivery",
  "DistrictCodeContact",
  "DistrictCodeInvoice",
]);

export const wardFieldAtom = atom<string[]>([
  "WardCodeDelivery",
  "WardCodeContact",
  "WardCodeInvoice",
]);

export const listAgentAtom = atom<string[]>([]);