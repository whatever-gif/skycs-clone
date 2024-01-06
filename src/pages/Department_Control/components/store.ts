import { atom } from "jotai";
import {
  FlagActiveEnum,
  Mst_DepartmentControl,
  SearchParam,
} from "@packages/types";
export const selectedItemsAtom = atom<string[]>([]);

export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<Mst_DepartmentControl | undefined>(
  undefined
);
export const showPopup = atom<boolean>(false);
export const showDetail = atom<boolean>(false);
export const dataTableAtom = atom<any>([]);
export const UserAutoAssignTicketAtom = atom<any>([]);
export const dataUserAtom = atom<any>([]);
export const dataTableUserAtom = atom<any>([]);
export const dataFormAtom = atom<any>([]);
export const flagEdit = atom<boolean>(false);
export const flagDetail = atom<any>("");
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

export const searchConditionAtom = atom<SearchParam>({
  FlagActive: FlagActiveEnum.All,
  Ft_PageIndex: 0,
  Ft_PageSize: 9999,
  KeyWord: "",
});
