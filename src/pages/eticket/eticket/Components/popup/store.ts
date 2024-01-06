import { atom } from "jotai";

// in charge of
export const popupVisibleAtom = atom<boolean>(false);
// split
export const popupSplitVisibleAtom = atom<boolean>(false);
// customer
export const popupCustomerVisibleAtom = atom<boolean>(false);
// merge
export const popupMergeVisibleAtom = atom<boolean>(false);
// data row
export const dataRowAtom = atom<any[]>([]);
