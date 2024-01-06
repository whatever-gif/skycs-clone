import { atom } from "jotai";

export const editTypeAtom = atom<string>("detail");

export const loadingPanelAtom = atom<boolean>(false);
