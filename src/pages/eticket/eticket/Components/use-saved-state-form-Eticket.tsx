import { useAuth } from "@packages/contexts/auth";

interface UseSavedStateProps {
  storeKey?: string;
}
export const useSavedStateFormEticket = <T,>({
  storeKey,
}: UseSavedStateProps) => {
  const {
    auth: { currentUser },
  } = useAuth();
  const STORE_KEY = `${currentUser?.Email}_${storeKey}_Form`;
  const saveStateForm = (state: T) => {
    if (storeKey) {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    }
  };
  const loadStateForm = () => {
    if (!storeKey) {
      return undefined;
    }
    const localStorageForm = window.localStorage.getItem(STORE_KEY);
    if (localStorageForm) {
      return JSON.parse(localStorageForm) as T;
    }
  };
  return {
    saveStateForm,
    loadStateForm,
  };
};
