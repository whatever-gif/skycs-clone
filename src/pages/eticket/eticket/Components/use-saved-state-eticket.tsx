import { useAuth } from "@packages/contexts/auth";

interface UseSavedStateProps {
  storeKey?: string;
}
export const useSavedStateEticket = <T,>({ storeKey }: UseSavedStateProps) => {
  const {
    auth: { currentUser },
  } = useAuth();
  const STORE_KEY = `${currentUser?.Email}_${storeKey}`;
  const saveState = (state: T) => {
    if (storeKey) {
      const result = state.map((item: any) => {
        if (item.dataField === "CustomerCodeSys") {
          return {
            ...item,
            editorOptions: {
              ...item.editorOptions,
              dataSource: [],
            },
          };
        } else {
          return item;
        }
      });
      localStorage.setItem(STORE_KEY, JSON.stringify(result));
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
