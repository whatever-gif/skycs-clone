import { InternalAxiosRequestConfig } from "axios";

export const FlagActiveConvertor = {
  beforeRequest: (config: InternalAxiosRequestConfig) => {
    // only do it when Create or Update data
    if (
      config.method === "post" &&
      (config.url?.includes("Update") || config.url?.includes("Create"))
    ) {
      try {
        // if `data` has `strJson` property
        if (Object.keys(config.data).includes("strJson")) {
          const data = JSON.parse(config.data.strJson);
          // if `data` has `FlagActive` property
          if (Object.keys(data).includes("FlagActive")) {
            // convert FlagActive to string
            if (typeof data.FlagActive === "boolean") {
              data.FlagActive = data.FlagActive ? "1" : "0";
              // override data
              config.data = {
                ...config.data,
                strJson: JSON.stringify(data),
              };
            }
          }
        }
      } catch (e) {}
    }
    return config;
  },
};
