import { Icon, IconName } from "@/packages/ui/icons";
import { UploadedFile } from "@packages/types";
import { ProgressBar } from "devextreme-react";
import Button from "devextreme-react/button";
import { FileUploader } from "devextreme-react/file-uploader";
import { RefObject } from "react";
import { match } from "ts-pattern";

interface SelectedFileProps {
  file: Partial<UploadedFile>;
  uploaderRef: RefObject<FileUploader>;
  onRemoveFile: (file: Partial<UploadedFile>) => void;
  disabled?: boolean;
  SelectedFileProps?: boolean;
  hiddenRemoveIcon?: any;
  process?: any;
}

const getIconName = (fileType: string) => {
  return match(fileType)
    .when(
      () => fileType.startsWith("video"),
      () => "video"
    )
    .when(
      () => fileType.startsWith("image"),
      () => "jpg"
    )
    .when(
      () => fileType.includes("spreadsheet"),
      () => "xlsx"
    )
    .when(
      () => fileType.includes("wordprocessing"),
      () => "docx"
    )
    .when(
      () => fileType.startsWith("application/msword"),
      () => "docx"
    )
    .when(
      () => fileType.startsWith("application/vnd.ms-excel"),
      () => "xlsx"
    )
    .when(
      () =>
        fileType.startsWith("application/vnd.ms-excel.sheet.macroEnabled.12"),
      () => "xlsx"
    )
    .when(
      () => fileType.includes("pdf"),
      () => "pdf"
    )
    .otherwise(() => "pdf") as IconName;
};

export const mappingFile = (fileType: string) => {
  return match(fileType)
    .when(
      () => fileType.startsWith("video"),
      () => "video"
    )
    .when(
      () => fileType.startsWith("image"),
      () => "jpg"
    )
    .when(
      () => fileType.includes("spreadsheet"),
      () => "xlsx"
    )
    .when(
      () => fileType.includes("wordprocessing"),
      () => "docx"
    )
    .when(
      () => fileType.includes("pdf"),
      () => "pdf"
    )
    .otherwise(() => "pdf") as IconName;
};

export const SelectedFile = ({
  file,
  uploaderRef,
  onRemoveFile,
  disabled = false,
  hiddenRemoveIcon,
  process,
}: SelectedFileProps) => {
  const handleRemoveFile = (file: Partial<UploadedFile>) => {
    onRemoveFile(file);
  };

  const handleDownload = () => {
    if (file?.FileUrlFS || file?.FileUrlLocal) {
      window.open(file?.FileUrlFS || file?.FileUrlLocal, "_blank");
    }
  };

  return (
    <div
      className={`flex-col w-300 m-2 shadow border p-1 file_Controller ${
        file.FileFullName === null ? "hidden" : ""
      }`}
    >
      <div className={"flex items-center"}>
        <Icon size={30} name={getIconName(file.FileType!)} />
        <span
          className={"ml-1 cursor-pointer hover:underline hover:text-blue-500"}
          onClick={() => handleDownload()}
        >
          {file.FileFullName}
        </span>
        {!hiddenRemoveIcon && (
          <Button
            className="hidden"
            disabled={hiddenRemoveIcon}
            stylingMode={"text"}
            onClick={() => handleRemoveFile(file)}
          >
            <Icon name={"remove"} />
          </Button>
        )}
      </div>
      <ProgressBar
        id="progress-bar-status"
        width="90%"
        min={0}
        value={process}
        visible={file.isUploading}
      />
    </div>
  );
};
