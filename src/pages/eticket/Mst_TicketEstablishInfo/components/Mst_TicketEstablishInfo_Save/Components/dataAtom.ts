import { atom } from "jotai";

export const dataAtom = atom<any>({});

export const formDataAtom = atom(
  (get) => get(dataAtom),
  (get, set, args: any) => {
    console.log(args);
    const { group, dataSource } = args;
    const currentData = get(dataAtom);
    set(dataAtom, {
      ...currentData,
      [`${group}`]: dataSource,
    });
    // you can set as many atoms as you want at the same time
  }
);
