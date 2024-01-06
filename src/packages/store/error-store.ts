import { atom, useAtomValue, useSetAtom } from "jotai";

export interface ErrorMessage {
  title?: string;
  message: string;
  _strTId?: string;
  _strAppTId?: string;
  _objTTime?: string;
  _strType?: string;
  _strErrCode?: string;
  _dicExcs?: _dicExcs;
  _dicDebug?: object;
}


export interface _dicExcs {
  Lst_c_K_DT_SysInfo: c_K_DT_SysInfo[];
  Lst_c_K_DT_SysError: c_K_DT_SysError[];
  Lst_c_K_DT_SysWarning: c_K_DT_SysWarning[];
}

export interface error_c_K_DT_Sys {
  Lst_c_K_DT_SysInfo: c_K_DT_SysInfo[];
  Lst_c_K_DT_SysError: c_K_DT_SysError[];
  Lst_c_K_DT_SysWarning: c_K_DT_SysWarning[];
}
export interface c_K_DT_SysInfo {
  Tid: string;
  DigitalSignature: string;
  ErrorCode: string;
  FlagCompress: string;
  FlagEncrypt: string;
  FlagWarning: string;
  Remark: string;
}

export interface c_K_DT_SysError {
  PCode: string;
  PVal: string;
}
export interface c_K_DT_SysWarning {
  PCode: string;
  PVal: string;
}

interface IErrorStore {
  errors: ErrorMessage[];
}
export const errorAtom = atom<IErrorStore>({
  errors: [],
});

export const showErrorAtom = atom(null, (get, set, error: ErrorMessage) => {
  const errors = [...get(errorAtom).errors, error];
  set(errorAtom, {
    errors,
  });
});
export const showPopupAtom = atom<any>(false);

export const clearErrorAtom = atom(null, (get, set) => {
  set(errorAtom, {
    errors: [],
  });
});

export const useErrorStore = () => {
  const errorStore = useAtomValue(errorAtom);
  const setErrorStore = useSetAtom(errorAtom);
  const clear = () => {
    setErrorStore({
      errors: [],
    });
  };

  const showError = (error: ErrorMessage) => {
    const errors = [...errorStore.errors, error];
    setErrorStore({
      errors,
    });
  };
  return {
    errors: errorStore.errors,
    clear,
    showError,
  };
};
