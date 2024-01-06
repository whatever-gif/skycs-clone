import { Popup, ToolbarItem } from "devextreme-react/popup";
import { Button } from "devextreme-react";
import React from "react";
import { useI18n } from "@/i18n/useI18n";

interface PopupBoxProps {
  title: string;
  message: string;
  onNoClick?: () => void;
  onYesClick: () => void;
  visible: boolean;
}
export const PopupBox = ({
  title,
  visible,
  message,
  onNoClick,
  onYesClick,
}: PopupBoxProps) => {
  const { t } = useI18n("Common");
  const handleYesClick = () => {
    onYesClick?.();
  };

  const handleNoClick = () => {
    onNoClick?.();
  };

  return (
    <Popup
      visible={visible}
      dragEnabled={false}
      showTitle={true}
      title={title}
      onHiding={onNoClick}
      height={200}
      width={400}
      showCloseButton={true}
      className={"confirmation-box"}
      wrapperAttr={{
        class: "confirmation-box",
      }}
    >
      <div className={"confirm-content"}>{message}</div>
      <ToolbarItem location="after" toolbar={"bottom"}>
        <Button
          className="w-[120px]"
          type="default"
          stylingMode="contained"
          text={t("Yes")}
          onClick={handleYesClick}
        />
      </ToolbarItem>
      <ToolbarItem location="after" toolbar={"bottom"}>
        <Button
          className="w-[100px]"
          text={t("No")}
          onClick={handleNoClick}
          stylingMode="contained"
        />
      </ToolbarItem>
    </Popup>
  );
};
