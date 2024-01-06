import { atom } from "jotai";
import { FlagActiveEnum, Mst_CustomerGroupData } from "@packages/types";
export const selectedItemsAtom = atom<string[]>([]);

export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<Mst_CustomerGroupData | undefined>(
  undefined
);
export const showPopup = atom<boolean>(false);
export const showPopupUser = atom<boolean>(false);
export const AvatarData = atom<any>("");
export const showDetail = atom<boolean>(false);
export const dataTableAtom = atom<any>([]);
export const dataFormAtom = atom<any>([]);
export const keywordAtom = atom<string>("");
export const flagEdit = atom<boolean>(false);
export const checkDataPopPup = atom<boolean>(true);
export const avatar = atom<any>("");
export const fileAtom = atom<any>(undefined);
export const isLoadingAtom = atom<any>(false);

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
