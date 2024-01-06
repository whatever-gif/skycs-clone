import Button from "devextreme-react/button";
import { useI18n } from "@/i18n/useI18n";
import { useVisibilityControl } from "@packages/hooks";
import { useCallback } from "react";
import { ExportConfirmBox } from "@packages/ui/modal";

interface ExportExcelProps {
  buttonClassName?: string;
  dialogClassName?: string;
  selectedItems: string[];
  onExportExcel?: (selectedOnly: boolean) => void;
}
export const useExportExcel = ({
  buttonClassName,
  dialogClassName,
  selectedItems = [],
  onExportExcel,
}: ExportExcelProps) => {
  const { t } = useI18n("Common");
  const controlVisibility = useVisibilityControl({ defaultVisible: false });
  const toggleDialog = () => {
    controlVisibility.toggle();
  };
  const exportButton = () => {
    return (
      <Button
        stylingMode="text"
        hoverStateEnabled={false}
        className={buttonClassName}
        onClick={toggleDialog}
        text={t("ExportExcel")}
      />
    );
  };
  const exportDialog = () => {
    return (
      <ExportConfirmBox
        selectedItems={selectedItems ?? []}
        control={controlVisibility}
        title={t("ExportExcel")}
        onYesClick={(value: number) => onExportExcel?.(value === 0)}
      />
    );
  };
  return {
    exportButton: exportButton(),
    exportDialog: exportDialog(),
  };
};
