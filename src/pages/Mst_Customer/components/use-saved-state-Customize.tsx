import { useAuth } from "@packages/contexts/auth";

interface UseSavedStateProps {
  storeKey?: string;
}
export const useSavedStateCustomize = <T,>({
  storeKey,
}: UseSavedStateProps) => {
  const {
    auth: { currentUser },
  } = useAuth();

  function stringify(obj: any) {
    let cache: any = [];
    let str = JSON.stringify(obj, function (key, value) {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    cache = null; // reset the cache
    return str;
  }

  const STORE_KEY = `${currentUser?.Email}_${storeKey}`;
  const saveState = (state: T) => {
    if (storeKey) {
      const listField = [
        "ProvinceCodeContact",
        "ProvinceCodeDelivery",
        "ProvinceCodeInvoice",
        "DistrictCodeContact",
        "DistrictCodeInvoice",
        "DistrictCodeDelivery",
        "WardCodeDelivery",
        "WardCodeInvoice",
        "WardCodeContact",
      ];
      const customize = state?.map((item: any) => {
        if (listField.includes(item.dataField)) {
          return {
            ...item,
            editorOptions: {
              ...item.editorOptions,
              dataSource: [],
            },
          };
        }

        return item;
      });

      localStorage.setItem(STORE_KEY, stringify(customize));
    }
  };
  const loadState = () => {
    if (!storeKey) {
      return undefined;
    }
    const localStorageColumns = window.localStorage.getItem(STORE_KEY);
    if (localStorageColumns) {
      return JSON.parse(localStorageColumns) as T;
    }
  };
  return {
    saveState,
    loadState,
  };
};
