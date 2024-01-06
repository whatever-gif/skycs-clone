import { atom } from "jotai";

interface MdMetaColumn {
  ColCode: string;
  FlagActive: string;
  ColCaption: string;
  ColDataType: string;
  OrgID: string;
  NetworkID: string;
  JsonListOption: any;
}

export const showPopupAtom = atom<boolean>(false);

export const currentItemAtom = atom<Partial<MdMetaColumn>>({
  ColCode: "",
  FlagActive: "",
  ColCaption: "",
  ColDataType: "",
  OrgID: "",
  NetworkID: "",
  JsonListOption: "",
} as MdMetaColumn);

export const flagAtom = atom<string>("");

export const loadingAtom = atom<boolean>(false);
