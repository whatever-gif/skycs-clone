import { useI18n } from "@/i18n/useI18n";
import { ModalBox, ModalBoxProps } from "@packages/ui/modal/confirmation-box";
import RadioGroup from "devextreme-react/radio-group";
import { useEffect, useState } from "react";

export interface ExportConfirmBoxProps extends ModalBoxProps {
  selectedItems: string[];
}
export const ExportConfirmBoxNew = ({
  control,
  onYesClick,
  onNoClick,
  selectedItems,
}: ExportConfirmBoxProps) => {
  const { t } = useI18n("Common");
  const [value, setValue] = useState(0);

  const handleYesClick = () => {
    onYesClick?.(value);
  };
  useEffect(() => {
    if (selectedItems.length === 0) {
      setValue(1);
    }
  }, [selectedItems]);

  const items = [
    {
      text: t("AllSearchResults"),
      id: 1,
    },
  ];

  return (
    <ModalBox
      control={control}
      title={t("ExportExcel")}
      onYesClick={handleYesClick}
      onNoClick={onNoClick}
    >
      <ModalBox.Slot name={"Content"}>
        <div>{t("AllSearchResults")}</div>
      </ModalBox.Slot>
    </ModalBox>
  );
};
