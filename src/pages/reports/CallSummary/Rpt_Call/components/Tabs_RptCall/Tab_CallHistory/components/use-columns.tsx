import { ColumnOptions } from "@packages/ui/base-gridview";
import { useI18n } from "@/i18n/useI18n";
import { Mst_CustomerGroupData } from "@packages/types";
import { LinkCell } from "@/packages/ui/link-cell";
import { Icon } from "@/packages/ui/icons";

interface UseBankDealerGridColumnsProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const { t } = useI18n("Rpt_CallHistory_Column");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "idx", // Số thứ tự
      caption: t("idx"),
      width: 80,
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Id", // Mã cuộc gọi
      caption: t("Id"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CCNumber", // Số điện thoại tổng đài
      caption: t("CCNumber"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "RemoteNumber", // Số khách hàng
      caption: t("RemoteNumber"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerName", // Tên khách hàng
      caption: t("CustomerName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 2,
    },
    {
      dataField: "CallType",
      caption: t("CallType"), // loại cuộc gọi
      editorType: "dxTextBox",
      alignment: "center",
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "Status",
      caption: t("Trạng thái cuộc gọi"), // Trạng thái cuộc gọi
      editorType: "dxTextBox",
      alignment: "center",
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "StartDTime", // Thời gian bắt đầu
      caption: t("StartDTime"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "EndDTime", // Thời gian kết thúc
      caption: t("EndDTime"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "WaitTime", // Thời gian chờ
      caption: t("WaitTime"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TalkTime", // Thời gian đàm thoại
      caption: t("TalkTime"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "FirstAgent", // Agent tiếp nhận
      caption: t("FirstAgent"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "LastAgent", // Agent Kết thúc
      caption: t("LastAgent"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "HoldTime", // Thời gian giữ máy
      caption: t("HoldTime"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalTime", // Tổng thời gian cuộc gọi
      caption: t("TotalTime"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "RecFilePath", // file ghi âm
      caption: t("RecFilePath"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      cellRender: (data) => {
        if (data.displayValue) {
          return (
            <Icon
              name="headphone"
              className="cursor-pointer"
              onClick={() => {
                window.open(data.displayValue);
              }}
            ></Icon>
          );
        } else {
          return <></>;
        }
      },
    },
  ];
  // return array of the first item only
  return columns;
};
