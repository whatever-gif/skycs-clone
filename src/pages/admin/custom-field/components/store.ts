import { atom } from "jotai";
import { MdMetaColGroupSpec, MdMetaColGroupSpecDto } from "@packages/types";

export const showPopupAtom = atom<boolean>(false);
export const currentItemAtom = atom<Partial<MdMetaColGroupSpecDto>>({
  Enabled: true,
  FlagActive: "1",
  IsRequired: true,
  FlagIsNotNull: "1",
  IsSearchable: true,
  FlagIsQuery: "1",
  IsUnique: true,
  FlagIsCheckDuplicate: "1",
  ListOption: [{}],
} as MdMetaColGroupSpecDto);

export const flagAtom = atom<string>("");
