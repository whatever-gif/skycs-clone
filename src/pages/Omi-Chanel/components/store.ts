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
export const currentInfo = atom<any>(undefined);
export const flagZaloAtom = atom<any>(undefined);
export const flagEmailAtom = atom<any>(undefined);
