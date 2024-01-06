import { DataGrid } from "devextreme-react";
import { Column, Editing } from "devextreme-react/data-grid";
import { ColumnOptions } from "@/types";
import { FileUploader } from "devextreme-react/file-uploader";
import { useRef, useState } from "react";
import { useApiHeaders } from "@packages/api/headers";
import { useClientgateApi } from "@packages/api";

export const FileUploadCustom = (props: any) => {
  console.log("props:", props);
  const { data } = props;
  const { headers, baseURL } = useApiHeaders();
  const [isUploading, setIsUploading] = useState(false);

  const api = useClientgateApi();
  const handleUploadFile = async (file: File, callback: any) => {
    const resp = await api.File_UploadFile(file);
    if (resp.isSuccess) {
      data.setValue(resp.Data?.FileId);
    }
  };

  return (
    <FileUploader
      ref={null}
      selectButtonText="Select photo"
      labelText=""
      accept="image/*"
      uploadMode={"instantly"}
      name={"file"}
      // onValueChanged={handleFileSelected}
      uploadHeaders={{
        ...headers,
        "Content-Type": "multipart/form-data",
      }}
      uploadUrl={`${baseURL}/File/UploadFile`}
      disabled={isUploading}
      // onUploaded={handleAFileUploaded}
      uploadFile={handleUploadFile}
    />
  );
};

export const TestPage = () => {
  const columns: ColumnOptions[] = [
    {
      dataField: "id",
    },
    {
      dataField: "fileId",
      editCellComponent: FileUploadCustom,
    },
  ];
  const dataSource: any[] = [
    {
      id: "test",
    },
  ];
  return (
    <div>
      <DataGrid dataSource={dataSource}>
        <Editing allowAdding={true} />
        {columns.map((column, idx) => {
          return <Column key={idx} {...column} />;
        })}
      </DataGrid>
    </div>
  );
};
