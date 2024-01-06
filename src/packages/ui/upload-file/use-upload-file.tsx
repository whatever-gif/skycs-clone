import Button from "devextreme-react/button";
import { useI18n } from "@/i18n/useI18n";
import { UploadDialog } from "@packages/ui/upload-dialog/upload-dialog";
import { useVisibilityControl } from "@packages/hooks";

interface UploadFileProps {
  handleUploadFiles: (files: File[]) => void;
  onDownloadTemplate: () => void;
  buttonClassName?: string;
  dialogClassName?: string;
}
export const useUploadFile = ({
  handleUploadFiles,
  onDownloadTemplate,
  buttonClassName,
  dialogClassName,
}: UploadFileProps) => {
  const { t } = useI18n("Common");
  const controlVisible = useVisibilityControl({ defaultVisible: false });
  const toggleDialog = () => {
    controlVisible.toggle();
  };

  const uploadButton = () => {
    return (
      <Button
        stylingMode="text"
        className={buttonClassName}
        hoverStateEnabled={false}
        onClick={toggleDialog}
        text={t("ImportExcel")}
      />
    );
  };
  const uploadDialog = () => {
    return (
      <UploadDialog
        visible={controlVisible.visible}
        onDownloadTemplate={onDownloadTemplate}
        onCancel={() => controlVisible.close()}
        onUpload={handleUploadFiles}
        className={dialogClassName}
      />
    );
  };
  return {
    uploadButton: uploadButton(),
    uploadDialog: uploadDialog(),
  };
};
