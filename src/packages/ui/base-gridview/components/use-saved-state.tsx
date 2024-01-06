import { useAuth } from "@packages/contexts/auth";

interface UseSavedStateProps {
  storeKey?: string;
}
export const useSavedState = <T,>({ storeKey }: UseSavedStateProps) => {
  const {
    auth: { currentUser },
  } = useAuth();
  const STORE_KEY = `${currentUser?.Email}_${storeKey}`;
  const saveState = (state: T) => {
    if (storeKey) {
      console.log("STORE_KEY ", STORE_KEY, "state ", state);

      localStorage.setItem(STORE_KEY, JSON.stringify(state));
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
