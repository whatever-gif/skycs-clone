import { atom } from "jotai";
export const selecteItemsAtom = atom<any[]>([]);

export enum ViewMode {
  ReadOnly = "readonly",
  Edit = "edit",
}

export const viewingRowAtom = atom<number | undefined>(undefined);
export const viewingItemAtom = atom<any | undefined>(undefined);
export const isLoadingUploadAtom = atom<boolean>(false);

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
export const flagCustomer = atom<string>("add");
export const visiblePropsUpValueAtom = atom(false);
export const visiblePropsUpErorValueAtom = atom(false);
export const dataImportAtom = atom({
  TotalSuccess: 0,
  TotalError: 0,
  Total: 0,
  url: "",
  DataTable: [],
});

export const dateFieldAtom = atom<string[]>(["CreateDTimeUTC"]);
export const tagFieldAtom = atom<string[]>([
  "MASTERDATASELECTMULTIPLE",
  "SELECTMULTIPLE",
  "SELECTMULTIPLEDROPDOWN",
  "SELECTMULTIPLESELECTBOX",
]);
export const selectFieldAtom = atom<string[]>([
  "MASTERDATA",
  "SELECTONE",
  "SELECTONEDROPDOWN",
  "SELECTONERADIO",
]);

export const countryFieldAtom = atom<string[]>([
  "CountryCodeDelivery",
  "CountryCodeContact",
  "CountryCodeInvoice",
]);

export const provinceFieldAtom = atom<string[]>([
  "ProvinceCodeDelivery",
  "ProvinceCodeContact",
  "ProvinceCodeInvoice",
]);

export const districtFieldAtom = atom<string[]>([
  "DistrictCodeDelivery",
  "DistrictCodeContact",
  "DistrictCodeInvoice",
]);

export const wardFieldAtom = atom<string[]>([
  "WardCodeDelivery",
  "WardCodeContact",
  "WardCodeInvoice",
]);

export const conditionSearch = atom<any>({
  CountryCodeDelivery: "",
  ProvinceCodeDelivery: "",
  DistrictCodeDelivery: "",
  WardCodeDelivery: "",
  CountryCodeContact: "",
  ProvinceCodeContact: "",
  DistrictCodeContact: "",
  WardCodeContact: "",
  CountryCodeInvoice: "",
  ProvinceCodeInvoice: "",
  DistrictCodeInvoice: "",
  WardCodeInvoice: "",
});

