import { atom, Getter, ExtractAtomValue, WritableAtom } from "jotai";
import { atomsWithQuery } from "jotai-tanstack-query";
import type { QueryKey, QueryObserverOptions } from "@tanstack/query-core";


export const atomWithLocalStorage = <T>(key: string, initialValue: T) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
    return initialValue;
  };
  const baseAtom = atom(getInitialValue());
  return atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
};

type ExtractAtomArgs<AtomType> = AtomType extends WritableAtom<
    any,
    infer Args,
    any
  >
  ? Args
  : never;

export function atomsWithQueryAsync<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  getOptions: (
    get: Getter
  ) => Promise<
    QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
  >
) {
  const atomsAtom = atom(async (get) => {
    const options = await getOptions(get);
    return atomsWithQuery(() => options);
  });
  const dataAtom = atom(
    async (get) => get((await get(atomsAtom))[0]),
    async (
      get,
      set,
      ...args: ExtractAtomArgs<Awaited<ExtractAtomValue<typeof atomsAtom>>[0]>
    ) => {
      const a = (await get(atomsAtom))[0];
      return set(a, ...args);
    }
  );
  const statusAtom = atom(
    async (get) => get((await get(atomsAtom))[1]),
    async (
      get,
      set,
      ...args: ExtractAtomArgs<Awaited<ExtractAtomValue<typeof atomsAtom>>[1]>
    ) => {
      const a = (await get(atomsAtom))[1];
      return set(a, ...args);
    }
  );
  return [dataAtom, statusAtom] as const;
}
