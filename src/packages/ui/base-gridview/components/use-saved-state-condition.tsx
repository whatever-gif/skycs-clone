import { useAuth } from "@packages/contexts/auth";

interface UseSavedStateProps {
  storeKey?: string;
}
export const useSavedStateCondition = <T,>({
  storeKey,
}: UseSavedStateProps) => {
  const {
    auth: { currentUser },
  } = useAuth();
  const STORE_KEY = `${currentUser?.Email}_${storeKey}`;
  const saveState = (state: T, list: string[]) => {
    if (storeKey) {
      console.log("STORE_KEY ", STORE_KEY, "state ", state);
      const result = state?.map((item: any) => {
        if (list.includes(item.dataField)) {
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
