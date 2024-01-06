import { atom } from "jotai";
import {
  FlagActiveEnum,
  Mst_Dealer,
  SearchDealerParam,
  SearchUserControlParam,
  SysUserData,
} from "@packages/types";
export const selectedItemsAtom = atom<string[]>([]);

export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<SysUserData | undefined>(undefined);
export const showPopup = atom<boolean>(false);
export const showDetail = atom<boolean>(false);
export const bottomAtom = atom<boolean>(false);
export const keywordAtom = atom<string>("");
export const flagEditAtom = atom<boolean>(false);
export const dataFormAtom = atom<any>([]);

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

export const searchConditionAtom = atom<SearchUserControlParam>({
  FlagActive: FlagActiveEnum.All,
  Ft_PageIndex: 0,
  Ft_PageSize: 9999,
  UserName: "",
  EMail: "",
  UserCode: "",
  PhoneNo: "",
  KeyWord: "",
});
