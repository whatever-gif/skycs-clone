import { atom } from "jotai";
import {
  FlagActiveEnum,
  SearchParam,
  Sys_GroupController,
} from "@packages/types";
export const selectedItemsAtom = atom<string[]>([]);

export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<Sys_GroupController | undefined>(undefined);
export const showPopup = atom<boolean>(false);
export const showDetail = atom<boolean>(false);
export const showInfoObjAtom = atom<boolean>(false);
export const dataTableAtom = atom<any>([]);
export const dataFormAtom = atom<any>([]);
export const dataFuntionAtom = atom<any>([]);
export const checkDataPopPup = atom<boolean>(true);
export const flagEdit = atom<any>(false);
export const dataUserAtom = atom<any>([]);
export const dataTableUserAtom = atom<any>([]);
export const dataEticketAtom = atom<any>([]);
export const isLoadingAtom = atom<any>(false);
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
