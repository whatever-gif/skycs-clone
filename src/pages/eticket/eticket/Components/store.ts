import { atom } from "jotai";
export const selecteItemsAtom = atom<any[]>([]);

export enum ViewMode {
  ReadOnly = "readonly",
  Edit = "edit",
}

export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<any | undefined>(undefined);

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

export const statusToolbarAtom = atom<{
  NEW: number;
  OPEN: number;
  PROCESSING: number;
  ONHOLD: number;
  WATINGONCUSTOMER: number;
  WAITINGONTHIRDPARTY: number;
  SOLVED: number;
  CLOSED: number;
  OutOfDate: number;
  Responsibility: number;
}>({
  NEW: 0,
  OPEN: 0,
  PROCESSING: 0,
  ONHOLD: 0,
  WATINGONCUSTOMER: 0,
  WAITINGONTHIRDPARTY: 0,
  SOLVED: 0,
  CLOSED: 0,
  OutOfDate: 0,
  Responsibility: 0,
});
