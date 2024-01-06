import { atom } from "jotai";
import { MstTicketColumnConfigDto } from "@packages/types";

export const showPopupAtom = atom<boolean>(false);
export const currentItemAtom = atom<Partial<MstTicketColumnConfigDto>>({
  Enabled: true,
  FlagActive: true,
  FlagCheckRequire: true,
  FlagCheckDuplicate: true,
  ListOption: [{}],
} as Partial<MstTicketColumnConfigDto>);

export const flagAtom = atom<string>("");
