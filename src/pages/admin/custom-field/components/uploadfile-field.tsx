import { UploadFieldCustom } from "./upload-field";

interface TextboxFieldProps {
  field: any;
  label: string;
  error?: any;
  required?: boolean;
  disabled?: boolean;
  direction?: string;
}

export const UploadFileField = ({
  field,
  label,
  required = false,
  error,
  disabled,
  direction,
}: TextboxFieldProps) => {
  const { onChange, ref, ...rest } = field;

  return (
    <div
      className={`flex ${direction == "vertical" ? "flex-col" : "my-[6px]"}  ${
        required ? "required" : ""
      } ${!!error ? "mb-4" : ""}`}
    >
      <label
        className={`${
          direction == "vertical"
            ? "w-full"
            : "w-[160px] min-w-[160px] pr-[10px]"
        } break-all`}
      >
        {label}
      </label>

      <UploadFieldCustom
        data={rest.value ?? []}
        className="w-full"
        controlFileInput={[
          "DOCX",
          "PDF",
          "JPG",
          "PNG",
          "XLSX",
          "TXT",
          "PPTX",
          "DOC",
          "XLS",
          "XLSM",
          "JPEG",
          "GIF",
          "SVG",
          "XML",
        ]}
        onValueChanged={async (e: any) => {
          await onChange({
            target: {
              name: rest.name,
              value: e,
            },
          });
        }}
      />
    </div>
  );
};
