import { UploadedFile } from "@/packages/types";
import { Icon, IconName } from "@/packages/ui/icons";
import { Button, FileUploader, ProgressBar } from "devextreme-react";
import { RefObject } from "react";
import { match } from "ts-pattern";

interface SelectedFileProps {
  file: Partial<UploadedFile>;
  uploaderRef: RefObject<FileUploader>;
  onRemoveFile: (file: Partial<UploadedFile>) => void;
  disabled?: boolean;
  SelectedFileProps?: boolean;
  hiddenRemoveIcon?: any;
  progress?: any;
  keyData?: any;
}

const getIconName = (fileType: string) => {
  return match(fileType)
    .when(
      () => fileType.includes("pptx"),
      () => "pptx"
    )
    .when(
      () => fileType.startsWith("txt"),
      () => "txt"
    )
    .when(
      () => fileType.includes("xlsx"),
      () => "xlsx"
    )
    .when(
      () => fileType.includes("docx"),
      () => "docx"
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
      () => fileType.includes("txt"),
      () => "txt"
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
    .when(
      () => fileType.includes("pptx"),
      () => "pptx"
    )
    .otherwise(() => "pdf") as IconName;
};

export const SelectedFile = ({
  file,
  uploaderRef,
  keyData,
  onRemoveFile,
  disabled = false,
  progress,
  hiddenRemoveIcon,
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
      className={"flex-col w-300 m-2 shadow border p-1 file_Controller"}
      key={keyData}
    >
      <div className={"flex items-center"}>
        <Icon size={30} name={getIconName(file.FileFullName!)} />
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
      <input
        type="range"
        min={0}
        max={100}
        defaultValue={Math.round(progress)}
        style={{
          display: Math.round(progress) === 100 ? "none" : "block",
        }}
      />
    </div>
  );
};
