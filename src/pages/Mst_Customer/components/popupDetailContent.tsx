import { useI18n } from "@/i18n/useI18n";
import { Button, Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useMemo } from "react";
import {
  dataImportAtom,
  visiblePropsUpErorValueAtom,
  visiblePropsUpValueAtom,
} from "./store";
import PopupError from "./popupError";

interface Props {
  handleCancel: () => void;
}

const PopupDetailContent = ({ handleCancel }: Props) => {
  const visiblePropsUpValue = useAtomValue(visiblePropsUpValueAtom);
  const { t } = useI18n("PopupDetailContent");
  const data = useAtomValue(dataImportAtom);
  const setVisiblePropsUpErorValue = useSetAtom(visiblePropsUpErorValueAtom);
  const handleExport = () => {
    window.location.href = data.url;
  };
  const ShowData = useMemo(() => {
    if (data) {
      return (
        <div className="popup-customer-container">
          <h3>
            {t("Total Customer Upload")}: <span>{data.Total}</span>
          </h3>
          <div className="popup-customer-container-content">
            <div className="calculate">
              <p className="state state--success">
                {t("uploadSuccess")}: <span>{data.TotalSuccess}</span>
              </p>
              <p className="state state--unsuccess">
                {t("upLoadFailure")}: <span>{data.TotalError}</span>
              </p>
            </div>
            <Button text={t("Export Excel")} onClick={handleExport}></Button>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }, [data]);
  const onShowError = () => {
    setVisiblePropsUpErorValue(true);
  };

  const onClose = () => {
    setVisiblePropsUpErorValue(false);
  };

  return (
    <Popup
      className="popup-customer"
      position={"center"}
      showCloseButton={true}
      onHiding={handleCancel}
      title={t(`Content Import Customers`)}
      visible={visiblePropsUpValue}
      height={300}
      width={600}
    >
      {ShowData}
      <PopupError onClose={onClose} />
      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("ShowError")}
          stylingMode={"contained"}
          onClick={onShowError}
        />
        <Button
          text={t("Cancel")}
          stylingMode={"contained"}
          onClick={handleCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default PopupDetailContent;
