import { atom } from "jotai";

export const visiblePopupAtom = atom<boolean>(false);
export const formValueAtom = atom<any>({});
export const flagAtom = atom<string>("add");
