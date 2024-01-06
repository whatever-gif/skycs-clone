import { useI18n } from "@/i18n/useI18n";
import { FormOptions } from "@/types";
import { PopupView } from "@packages/ui/popup-view";
import { useAtom } from "jotai";
import { viewingDataAtom } from "@/pages/dealer/components/dealer-store";

export interface DealerPopupViewProps {
  onEdit: (rowIndex: number) => void;
  formSettings: FormOptions;
}

export const DealerPopupView = ({
  onEdit,
  formSettings,
}: DealerPopupViewProps) => {
  const { t } = useI18n("Common");
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
      title={t("ViewDealer")}
      handleEdit={handleEdit}
      handleCancel={handleCancel}
      formSettings={formSettings}
      data={viewingItem.item}
    />
  );
};
