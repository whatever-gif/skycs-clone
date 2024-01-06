import { atom } from "jotai";

interface GridState {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
}
export const gridStateAtom = atom<GridState>({
  pageIndex: 0,
  pageSize: 100,
  pageCount: 0,
  totalCount: 0,
});
export const normalGridSelectionKeysAtom = atom<string[]>([]);
export const customizeGridSelectionKeysAtom = atom<string[]>([]);
export const normalGridDeleteMultipleConfirmationBoxAtom = atom<boolean>(false);
export const normalGridDeleteSingleConfirmationBoxAtom = atom<boolean>(false);
export const normalGridSingleDeleteItemAtom = atom<string>("");
export const dataGridAtom = atom<any>(undefined);
export const SelectionKeyAtom = atom<any>(undefined);
export const hidenMoreAtom = atom<any>("");
export const pageSizeAtom = atom<number[]>([100, 200, 500, 1000, 3000, 5000]);
export const loadingColumnAtom = atom<any[]>([]);
