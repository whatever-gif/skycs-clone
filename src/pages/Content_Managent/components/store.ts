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
export const valueIDAtom = atom<boolean>(false);
export const valueIDZNSAtom = atom<any>(undefined);
export const zaloTemplatetom = atom<any>(undefined);
export const dataFormAtom = atom<any>(undefined);
export const refetchAtom = atom<any>(false);
export const checkUIZNSAtom = atom<any>(false);
export const idZNSAtom = atom<any>("");

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
