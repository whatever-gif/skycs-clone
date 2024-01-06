import { atom } from "jotai";
import { FlagActiveEnum, Mst_Dealer, SearchDealerParam } from "@packages/types";
export const selectedItemsAtom = atom<string[]>([]);

export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<Mst_Dealer | undefined>(undefined);

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
