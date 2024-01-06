import { useI18n } from "@/i18n/useI18n";
import { FormOptions } from "@/types";
import { PopupView } from "@packages/ui/popup-view";
import { useAtom } from "jotai";
import { viewingDataAtom } from "./store";

export interface PopupViewProps {
  onEdit: (rowIndex: number) => void;
  formSettings: FormOptions;
}

export const PopupViewComponent = ({
  onEdit,
  formSettings,
}: PopupViewProps) => {
  const { t } = useI18n("Mst_PaymentTermController-popup");
  const [viewingItem, setViewingItem] = useAtom(viewingDataAtom);

  const handleEdit = () => {
    let rowIndex = viewingItem?.rowIndex;
    if (viewingItem) {
      setViewingItem(undefined);
    }
    if (typeof rowIndex === "number") {
      onEdit(rowIndex);
    }
  };

  const handleCancel = () => {
    setViewingItem(undefined);
  };

  return (
    <PopupView
      visible={!!viewingItem.item}
      title={t("View Mst_PaymentTermController")}
      handleEdit={handleEdit}
      handleCancel={handleCancel}
      formSettings={formSettings}
      data={viewingItem.item}
    />
  );
};
