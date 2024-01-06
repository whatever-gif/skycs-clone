import { useCallback, useRef, useState } from "react";
import { Button } from "devextreme-react/button";
import { FileUploader } from "devextreme-react/file-uploader";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { useI18n } from "@/i18n/useI18n";
import { logger } from "@/packages/logger";
import { useConfiguration, useVisibilityControl } from "@packages/hooks";
// import "./upload-dialog.scss";
import "@packages/ui/upload-dialog/upload-dialog.scss";
import { ProgressBar } from "devextreme-react";
import { useDropzone } from "react-dropzone";
import { visiblePopupImportAtom } from "../../store";
import { useAtomValue } from "jotai";

type UploadDialogProps = {
  onUpload: (files: File[]) => void;
  onCancel: () => void;
  onDownloadTemplate?: () => void;
  className?: string;
};

export const UploadDialog = ({
  onUpload,
  onCancel,
  onDownloadTemplate,
  className = "",
}: UploadDialogProps) => {
  const { t } = useI18n("Common");
  const config = useConfiguration();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileSelection = (event: any) => {
    logger.debug("files:", event);
    setFiles(event.value);
  };

  const handleUploadClick = () => {
    logger.debug("upload files:", files);
    onUpload(files);
    // setFiles([]);
  };

  const handleCancelClick = () => {
    onCancel();
    setFiles([]);
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    // console.log("accepted files:", acceptedFiles);
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const visiblePopup = useAtomValue(visiblePopupImportAtom);

  return (
    <Popup
      visible={visiblePopup}
      dragEnabled={true}
      showTitle={true}
      title={t("UploadFiles")}
      onHiding={handleCancelClick}
      height={350}
      width={570}
      deferRendering={false}
      className={`upload-popup ${className}`}
      wrapperAttr={{
        class: "upload-popup-wrapper",
      }}
    >
      <div {...getRootProps()} id={"upload-box"}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className={"guide-text"}>{t("DropFileHere")}</p>
        ) : (
          <p className={"guide-text"}>{t("DragAndDropHere")}</p>
        )}
        <Button
          className={"btn-browse-file"}
          text={t("BrowseFile")}
          icon="/images/icons/upload.svg"
        />
        <p className={"mt-2"}>{t("MaxFileSize")}</p>
      </div>
      {files.length > 0 && (
        <div
          className={
            "file-container mt-2  mx-auto flex-col rounded border shadow items-center"
          }
        >
          <div className={""}>
            {files.map((f, idx) => {
              return (
                <div>
                  <Button
                    stylingMode={"text"}
                    icon={"/images/icons/excel-file.svg"}
                    hoverStateEnabled={false}
                    focusStateEnabled={false}
                    activeStateEnabled={false}
                  />
                  {f.name}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <ToolbarItem location="before" toolbar={"bottom"}>
        <Button
          onClick={onDownloadTemplate}
          icon={"/images/icons/download.svg"}
          id={"btn-trigger"}
          className={""}
          type={"default"}
          stylingMode={"text"}
          hoverStateEnabled={false}
          text={t("DownloadTemplateFile")}
        />
      </ToolbarItem>
      <ToolbarItem location="after" toolbar={"bottom"}>
        <Button
          text={t("Upload")}
          onClick={handleUploadClick}
          stylingMode="contained"
          type="default"
        />
      </ToolbarItem>
      <ToolbarItem location="after" toolbar={"bottom"}>
        <Button text={t("Cancel")} onClick={handleCancelClick} />
      </ToolbarItem>
    </Popup>
  );
};
