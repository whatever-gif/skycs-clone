import { atom } from "jotai";
export const selectedItemsAtom = atom<string[]>([]);
export const keywordAtom = atom<string>("");
import { Rpt_CpnCampaignResultCallData } from "@packages/types";

export enum ViewMode {
  Readonly = "readonly",
  Edit = "edit",
}
export const showPopup = atom<boolean>(false);
export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<Rpt_CpnCampaignResultCallData | undefined>(
  undefined
);
export const dataSearchAtom = atom<any>(null);
export const checkIconAtom = atom<any>("");
export const loadpaineAtom = atom<any>(false);
export const keySearchAtom = atom<any>("");
export const showInputhAtom = atom<any>(undefined);
export const currentInfo = atom<any>({
  uploadFiles: [],
});

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
