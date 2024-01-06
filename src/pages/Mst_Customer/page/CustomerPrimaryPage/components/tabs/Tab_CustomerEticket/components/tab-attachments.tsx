import { useI18n } from "@/i18n/useI18n";
import { BaseGridView } from "@/packages/ui/base-gridview";
import { ColumnOptions } from "@/types";
import { useRef } from "react";

export const Tab_Attachments = ({ data }: any) => {
  const { Lst_ET_TicketAttachFile } = data;
  const { t } = useI18n("Eticket_Detail");
  let gridRef = useRef(null);
  const column: ColumnOptions[] = [
    {
      dataField: "Idx",
      visible: true,
      caption: t("Idx"), // thời gian tải lên
    },
    {
      dataField: "LogLUDTimeUTC",
      visible: true,
      caption: t("LogLUDTimeUTC"), // thời gian tải lên
    },
    {
      dataField: "LogLUDTimeUTC",
      visible: true,
      caption: t("LogLUDTimeUTC"), // Người tải lên
    },
    {
      dataField: "FileName",
      visible: true,
      caption: t("FileName"), // tên file
    },
    {
      dataField: "FileType",
      visible: true,
      caption: t("FileType"), // Định dạng
    },
    {
      dataField: "LogLUDTimeUTC",
      visible: true,
      caption: t("LogLUDTimeUTC"), // Dung lượng
    },
    {
      dataField: "LogLUDTimeUTC",
      visible: true,
      caption: t("LogLUDTimeUTC"), // Ký số
    },
  ];

  const handleDelete = (row: any) => {
    console.log("row ", row);
  };

  const handleDownload = (row: any) => {
    console.log("download row ", row);
  };

  const handleSign = (row: any) => {
    console.log("sign row ", row);
  };

  if (Array.isArray(Lst_ET_TicketAttachFile)) {
    return (
      <>
        <BaseGridView
          onReady={(ref) => {
            gridRef = ref;
          }}
          isLoading={false}
          formSettings={{}}
          onSelectionChanged={() => {}}
          dataSource={Lst_ET_TicketAttachFile}
          columns={column}
          keyExpr={["Idx"]}
          allowSelection={true}
          storeKey="Attachments"
          toolbarItems={[]}
          editable={false}
          showCheck={false}
        />
      </>
    );
  } else {
    return <>No Data</>;
  }
};
