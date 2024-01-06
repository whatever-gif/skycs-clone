/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_ENTRY_CENTER_GATE_URL: string;
  readonly VITE_DOMAIN: string;
  readonly VITE_NETWORK_FIX: string;
  readonly VITE_CCS_BASE_URL: string;
  readonly VITE_ACC_BASE_URL: string;
  readonly VITE_SOLUTION_CODE: string;
  readonly VITE_SOLUTION_SECRET: string;
  readonly VITE_AGENT: string;
  readonly VITE_GW_USER: string;
  readonly VITE_GW_USER_PW: string;
  readonly VITE_GATEWAY_BASE_URL: string;

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
