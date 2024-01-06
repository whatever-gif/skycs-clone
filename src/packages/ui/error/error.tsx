import { useI18n } from "@/i18n/useI18n";
import { ErrorMessage, clearErrorAtom, useErrorStore } from "@/packages/store";
import { ScrollView } from "devextreme-react";
import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import { useSetAtom } from "jotai";

import { useAuth } from "@/packages/contexts/auth";
import Button from "devextreme-react/button";
import { nanoid } from "nanoid";
import { useState } from "react";
import { stringError } from "./error-download";
import ErrorLogin from "./error-login";

const ErrorDetail = ({ error }: { error: ErrorMessage }) => {
  const { t } = useI18n("Error");
  const objDebugInfo = error._dicDebug;
  const _dicExcs = error._dicExcs;
  const Lst_c_K_DT_SysInfo = _dicExcs?.Lst_c_K_DT_SysInfo;
  let Lst_c_K_DT_SysError =
    [
      ...(_dicExcs?.Lst_c_K_DT_SysError ?? []).filter(
        (item) => item.PCode !== "AccessToken"
      ),
    ] ?? [];
  const Lst_c_K_DT_SysWarning = _dicExcs?.Lst_c_K_DT_SysWarning;
  console.log("Lst_c_K_DT_SysError ", Lst_c_K_DT_SysError);
  const errorCode =
    Lst_c_K_DT_SysInfo != null && Lst_c_K_DT_SysInfo.length > 0
      ? Lst_c_K_DT_SysInfo[0].ErrorCode
      : "";
  const errorMessage = t(errorCode);

  return (
    <div>
      {!!_dicExcs && (
        <div className="error__excresult">
          <div className="error__excresult-title">{t("Exception result")}</div>
          <div className="error__excresult__key flex">
            <span>ErrorCode:</span> <span>{errorCode}</span>
          </div>
          <div className="error__excresult__key flex">
            <span>ErrorMessage:</span> <span>{errorMessage}</span>
          </div>
          -----------------------------------------
          <div className="error__excresult__key">Lst_c_K_DT_SysInfo:</div>
          {Lst_c_K_DT_SysInfo != null && Lst_c_K_DT_SysInfo.length > 0 ? (
            Lst_c_K_DT_SysInfo.map((item, index) => {
              return (
                <div key={item.Tid}>
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div key={`${key}_${index}`}>
                        <div className="error__debuginfo__key">
                          {key}: {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <></>
          )}
          <div className="error__excresult__key">Lst_c_K_DT_SysError:</div>
          {Lst_c_K_DT_SysError != null && Lst_c_K_DT_SysError.length > 0 ? (
            Lst_c_K_DT_SysError.map((item, index) => {
              return (
                <div key={item.PCode}>
                  {Object.entries(item)
                    // .filter(([key, value]) => value !== "AccessToken")
                    .map(([key, value]) => {
                      return (
                        <div key={`${key}_${index}`}>
                          <div className="error__debuginfo__key flex">
                            <span>{key}:</span> <span>{value}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })
          ) : (
            <></>
          )}
          <div className="error__excresult__key">Lst_c_K_DT_SysWarning:</div>
          {Lst_c_K_DT_SysWarning != null && Lst_c_K_DT_SysWarning.length > 0 ? (
            Lst_c_K_DT_SysWarning.map((item, index) => {
              return (
                <div key={item.PCode}>
                  {Object.entries(item).map(([key, value]) => {
                    return (
                      <div key={`${key}_${index}`}>
                        <div className="error__debuginfo__key flex">
                          <span>{key}: </span> <span>{value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      )}
      {!!objDebugInfo && (
        <div className="error__debuginfo">
          <div className="error__debuginfo-title">{t("Debug information")}</div>
          {Object.entries(objDebugInfo).map(([key, value]) => {
            return (
              <div key={key}>
                <div className="error__debuginfo__key flex">
                  <span>{key}: </span>
                  <span>{JSON.stringify(value, null, 2)}</span>
                </div>
              </div>
            );
          })}
          -----------------------------------------
        </div>
      )}
      {JSON.stringify(error)}
    </div>
  );
};

export default function Error() {
  // const navigate = useNavigate();
  const { logout, login, setClientGateInfo } = useAuth();
  const [size, setSize] = useState<"short" | "full">("short");
  const viewModeSizes = {
    short: {
      width: 400,
      height: 200,
    },
    full: {
      width: 550,
      height: 600,
    },
  };

  const { t } = useI18n("Error");
  const { errors } = useErrorStore();

  let tokenFail = true;

  const clear = useSetAtom(clearErrorAtom);
  const hasErrors = !!errors && errors.length > 0;
  if (hasErrors) {
    const objErr = [...(errors[0]?._dicExcs?.Lst_c_K_DT_SysError ?? [])].find(
      (i) => i.PCode === "excSE.ErrorCode"
    );
    if (objErr) {
      if (objErr.PVal == "Unauthorize") {
        tokenFail = false;
      }
    }
  }

  const handleClose = () => {
    clear();
  };

  const handleDownload = () => {
    const jsonContent = stringError(errors);

    const blob = new Blob([jsonContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Error.txt";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleZoom = () => {
    setSize(size === "short" ? "full" : "short");
  };

  const title = t("ErrorTitle");

  if (!tokenFail) {
    return <ErrorLogin login={!tokenFail} naoid={nanoid()} />;
  }

  return (
    <Popup
      titleRender={(item: any) => (
        <div className="error-title">
          <Button
            icon={"/images/icons/warning.svg"}
            hoverStateEnabled={false}
            activeStateEnabled={false}
            focusStateEnabled={false}
            stylingMode={"text"}
          />
          {title}
        </div>
      )}
      // container=".dx-viewport"
      visible={hasErrors}
      position={"center"}
      width={viewModeSizes[size].width}
      height={viewModeSizes[size].height}
      onHiding={() => setSize("short")}
    >
      <Position at="bottom" my="center" />
      <ToolbarItem toolbar="bottom" location="after">
        <Button text={t("Download")} onClick={handleDownload} />
      </ToolbarItem>
      <ToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="after"
        options={{
          text: t(size === "short" ? "ViewDetail" : "Collapse"),
          onClick: handleZoom,
          stylingMode: "contained",
        }}
      />
      <ToolbarItem toolbar="bottom" location="after">
        <Button
          text={t("Close")}
          className="cancel-button"
          onClick={handleClose}
        />
      </ToolbarItem>
      <ScrollView showScrollbar={"always"}>
        <div className="error-body overflow-scroll">
          {errors.map((item, index) => {
            if (item) {
              return (
                <div className="error-item" key={index}>
                  {/* <div
                    className="error__main"
                    onClick={() => {
                      document.getElementById("editable").focus();
                    }}
                  > */}
                  <div className="error__main">
                    <p style={{ wordBreak: "break-word" }}>
                      {t(item?.message) ?? "Error"}
                    </p>
                  </div>
                  {size === "full" && (
                    <div className="error__detail">
                      <ErrorDetail error={item} />
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      </ScrollView>
    </Popup>
  );
}
