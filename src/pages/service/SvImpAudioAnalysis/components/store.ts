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