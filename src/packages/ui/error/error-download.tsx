export const stringError = (errors: any) => {
  const separate = "-----------------------------------------\n";

  const detailError = (error: any) => {
    const objDebugInfo = error.debugInfo;
    const objErrorInfo = error.errorInfo;

    const objc_K_DT_Sys = objErrorInfo?.InnerException?.c_K_DT_Sys;
    const Lst_c_K_DT_SysInfo = objc_K_DT_Sys?.Lst_c_K_DT_SysInfo;
    const Lst_c_K_DT_SysError = objc_K_DT_Sys?.Lst_c_K_DT_SysError;
    const Lst_c_K_DT_SysWarning = objc_K_DT_Sys?.Lst_c_K_DT_SysWarning;
    const objException = objErrorInfo?.InnerException?.Exception;
    const objEx_c_K_DT_Sys = objException?.c_K_DT_Sys;
    const objEx_Exception = objException?.Exception;
    const objEx_TargetSite = objException?.TargetSite;

    const Lst_c_K_DT_SysInfo_Exception = objEx_c_K_DT_Sys?.Lst_c_K_DT_SysInfo;
    const Lst_c_K_DT_SysError_Exception = objEx_c_K_DT_Sys?.Lst_c_K_DT_SysError;
    const Lst_c_K_DT_SysWarning_Exception =
      objEx_c_K_DT_Sys?.Lst_c_K_DT_SysWarning;

    const errorCode =
      Lst_c_K_DT_SysInfo != null && Lst_c_K_DT_SysInfo.length > 0
        ? Lst_c_K_DT_SysInfo[0].ErrorCode
        : "";

    const title = "Exception result\n";
    const errorCodeTitle = `ErrorCode: ${errorCode}\n`;
    const errorCodeMessage = `ErrorMessage: ${errorCode}\n`;

    // -------------------------------------------------------

    const sysInfoRender =
      Lst_c_K_DT_SysInfo != null && Lst_c_K_DT_SysInfo.length > 0
        ? Lst_c_K_DT_SysInfo.map((item: any, index: any) => {
            return Object.entries(item).map(([key, value]) => {
              return `${key}: ${value}\n`;
            });
          })
        : "";

    const sysInfo = `Lst_c_K_DT_SysError: ${sysInfoRender}\n`;

    // -------------------------------------------------------

    const sysErrorRender =
      Lst_c_K_DT_SysError != null && Lst_c_K_DT_SysError.length > 0
        ? Lst_c_K_DT_SysError.map((item: any, index: any) => {
            return Object.entries(item).map(([key, value]) => {
              return `${key}: ${value}\n`;
            });
          })
        : "";

    const sysError = `Lst_c_K_DT_SysError: ${sysErrorRender}\n`;

    // -------------------------------------------------------

    const sysWarningRender =
      Lst_c_K_DT_SysWarning != null && Lst_c_K_DT_SysWarning.length > 0
        ? Lst_c_K_DT_SysWarning.map((item: any, index: any) => {
            return Object.entries(item).map(([key, value]) => {
              return `${key}: ${value}\n`;
            });
          })
        : "";

    const sysWarning = `Lst_c_K_DT_SysWarning: ${sysWarningRender}\n`;

    // -------------------------------------------------------

    // Exception

    const exceptionTitle = "Exception:\n";

    // -------------------------------------------------------

    const sysInfoExceptionRender =
      Lst_c_K_DT_SysInfo_Exception != null &&
      Lst_c_K_DT_SysInfo_Exception.length > 0
        ? Lst_c_K_DT_SysInfo_Exception.map((item: any, index: any) => {
            return Object.entries(item).map(([key, value]) => {
              return `${key}: ${value}\n`;
            });
          })
        : "";

    const sysInfoException = `Exception Lst_c_K_DT_SysInfo: ${sysInfoExceptionRender}\n`;

    // -------------------------------------------------------

    const sysErrorExceptionRender =
      Lst_c_K_DT_SysError_Exception != null &&
      Lst_c_K_DT_SysError_Exception.length > 0
        ? Lst_c_K_DT_SysError_Exception.map((item: any, index: any) => {
            return Object.entries(item).map(([key, value]) => {
              return `${key}: ${value}\n`;
            });
          })
        : "";

    const sysErrorException = `Exception Lst_c_K_DT_SysError: ${sysErrorExceptionRender}\n`;

    // -------------------------------------------------------

    const sysWarningExceptionRender =
      Lst_c_K_DT_SysWarning_Exception != null &&
      Lst_c_K_DT_SysWarning_Exception.length > 0
        ? Lst_c_K_DT_SysWarning_Exception.map((item: any, index: any) => {
            return Object.entries(item).map(([key, value]) => {
              return `${key}: ${value}\n`;
            });
          })
        : "";

    const sysWarningException = `Exception Lst_c_K_DT_SysWarning: ${sysWarningExceptionRender}\n`;

    // -------------------------------------------------------

    const targetSite = "Exception TargetSite:\n";

    const targetSiteRender =
      objEx_TargetSite != null
        ? Object.entries(objEx_TargetSite).map(([key, value]) => {
            return `${key} : ${JSON.stringify(value, null, 2)}\n`;
          })
        : "";

    // -------------------------------------------------------

    const exception = "Exception Exception:\n";

    const exceptionRender =
      objEx_Exception != null
        ? Object.entries(objEx_Exception).map(([key, value]) => {
            return `${key} : ${JSON.stringify(value, null, 2)}\n`;
          })
        : "";

    // -------------------------------------------------------

    const debugInfo = "Debug information\n";

    const debugInfoRender =
      objDebugInfo != null
        ? Object.entries(objDebugInfo).map(([key, value]) => {
            return `${key} : ${JSON.stringify(value, null, 2)}\n`;
          })
        : "";

    // -------------------------------------------------------

    const errorStringify = JSON.stringify(error, null, 2);

    return (
      title +
      errorCodeTitle +
      errorCodeMessage +
      separate +
      sysInfo +
      sysError +
      sysWarning +
      separate +
      exceptionTitle +
      sysInfoException +
      sysErrorException +
      sysWarningException +
      separate +
      targetSite +
      separate +
      targetSiteRender +
      exception +
      exceptionRender +
      debugInfo +
      debugInfoRender +
      separate +
      errorStringify
    );
  };

  const renderError = () => {
    const result = errors.map((item: any) => {
      const header = item.errorInfo?.Message ?? item.message;

      const title = header + "\n" + separate;

      const detail = detailError(item);

      return title + detail;
    });

    return result.join("\n");
  };

  return renderError();
};
