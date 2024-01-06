import {atom} from "jotai";
export const selectedItemsAtom = atom<string[]>([]);
export const keywordAtom = atom<string>("");