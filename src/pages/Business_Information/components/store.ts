import { atom } from "jotai";
import {
  FlagActiveEnum,
  Mst_Dealer,
  Mst_NNTController,
  SearchDealerParam,
} from "@packages/types";
export const selectedItemsAtom = atom<string[]>([]);

export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<Mst_NNTController | undefined>(undefined);
export const showPopup = atom<boolean>(false);
export const keywordAtom = atom<string>("");
export const dataBotton = atom<string>("");
export const showDetail = atom<boolean>(false);
export const dataTableAtom = atom<any>([]);
export const dataFormAtom = atom<any>({});
export const flagEdit = atom<boolean>(false);
export const readOnly = atom<boolean>(false);
export const activeInputAtom = atom<boolean>(false);

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

export const searchConditionAtom = atom<SearchDealerParam>({
  FlagActive: FlagActiveEnum.All,
  Ft_PageIndex: 0,
  Ft_PageSize: 9999,
  KeyWord: "",
  DealerCode: "",
  DealerName: "",
  FlagAutoLXX: FlagActiveEnum.All,
  FlagAutoMapVIN: FlagActiveEnum.All,
  FlagAutoSOAppr: FlagActiveEnum.All,
});
