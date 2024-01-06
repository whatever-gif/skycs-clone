import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { LinkCell } from "@/packages/ui/link-cell";
import { viewingDataAtom } from "@/pages/Mst_Customer/components/store";
import { ColumnOptions } from "@/types";
import { atom, useSetAtom } from "jotai";

export const popupDescAtom = atom<any>(null);

export const useColumn = ({ ticketDynamic }: { ticketDynamic: any[] }) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const { t } = useI18n("Eticket_Manager_Column");
  const viewRow = (rowIndex: number, data: any) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const setPopupDesc = useSetAtom(popupDescAtom);

  const navigate = useNetworkNavigate();

  // thiếu
  // tương tác mới mới nhất,
  // tên khách hàng ,
  // phụ trách
  const ticketStatic = [
    "TicketDetail",
    "AgentTicketPriorityName", // Mức ưu tiên
    "NNTFullName", // Chi nhánh/ đại lý phụ trách
    "DepartmentName", // Phòng ban
    "AgentTicketCustomTypeName", // Phân loại tùy chọn
    "AgentTicketSourceName", // Nguồn
    "SLALevel", // SLA
    "Tags", // Tags
    "ListFollowerAgentName", // Người theo dõi
    "CreateBy", // Người tạo
    "CreateDTimeUTC", //Thời gian tạo
    "LogLUBy", // Người cập nhật cuối cùng
    "LogLUDTimeUTC", // Thời gian cập nhật cuối cùng
    "RemindWork", // Nhắc việc
    "RemindDTimeUTC", // Vào lúc
    "QtyMissCall",
  ];

  const staticColumn = ticketStatic.map((item) => {
    if (item == "TicketDetail") {
      return {
        dataField: item,
        caption: t(`${item}`),
        editorType: "dxTextBox",
        width: 300,
        visible: false,
        cellRender: ({ data }: any) => {
          return (
            <div dangerouslySetInnerHTML={{ __html: data.TicketDetail }}></div>
          );
        },
      };
    }

    return {
      dataField: item,
      caption: t(`${item}`),
      editorType: "dxTextBox",
      width: 200,
      visible: false,
    };
  });

  const dynamicColumn = ticketDynamic
    .filter((item) => {
      return item.FlagIsDynamic !== "0" && item.FlagActive !== "0";
    })
    .map((item) => {
      if (item.TicketColCfgDataType === "FILE") {
        return {
          dataField: item.TicketColCfgCodeSys.split(".").join(""),
          caption: t(item.TicketColCfgName),
          width: 200,
          visible: false,
          editCellComponent: FileUploadCustom,
        };
      }
      if (
        item.TicketColCfgDataType === "MASTERDATA" ||
        item.TicketColCfgDataType === "MASTERDATASELECTMULTIPLE"
      ) {
        return {
          dataField: item.TicketColCfgCodeSys.split(".").join(""),
          caption: t(item.TicketColCfgName),
          editorType: "dxTextBox",
          width: 200,
          visible: false,
        };
      } else {
        return {
          dataField: item.TicketColCfgCodeSys.split(".").join(""),
          caption: t(item.TicketColCfgName),
          editorType: "dxTextBox",
          width: 200,
          visible: false,
        };
      }
    });

  const columns: ColumnOptions[] = [
    {
      dataField: "id", // mã ticket
      caption: t("STT"),
      editorType: "dxTextBox",
      visible: true,
      filterType: "exclude",
      minWidth: 50,
      cellRender: (column: any) => {
        return <>{column.rowIndex + 1}</>;
      },
      allowFiltering: false,
      allowSorting: false,
    },
    {
      dataField: "TicketID", // mã ticket
      caption: t("TicketID"),
      editorType: "dxTextBox",
      visible: true,
      filterType: "exclude",
      minWidth: 120,
      cellRender: (column: any) => {
        return (
          <LinkCell
            onClick={() =>
              navigate(`/eticket/detail/${column.data.TicketID ?? ""}`)
            }
            value={column.data.TicketID}
          />
        );
      },
    },
    {
      dataField: "TicketName", // tên ticket
      caption: t("TicketName"),
      editorType: "dxTextBox",
      visible: true,
      width: 400,
    },
    {
      dataField: "CustomerTicketTypeName", // Phân loại
      caption: t("CustomerTicketTypeName"),
      editorType: "dxTextBox",
      visible: true,
      minWidth: 150,
    },
    {
      dataField: "CustomerName", // tên KH
      caption: t("CustomerName"),
      editorType: "dxTextBox",
      visible: true,
    },
    {
      dataField: "AgentName", // phụ trách
      caption: t("AgentName"),
      editorType: "dxTextBox",
      visible: true,
      minWidth: 150,
    },
    {
      dataField: "AgentTicketStatusName", // trạng thái
      caption: t("AgentTicketStatusName"),
      editorType: "dxTextBox",
      visible: true,
      cellRender: (param: any) => {
        return (
          <div className={`status-container flex justify-content-center`}>
            <span
              className={`status ${
                param?.displayValue
                  ? param?.displayValue.toLowerCase().split(" ").join("")
                  : ""
              }`}
            >
              {param?.displayValue ?? ""}
            </span>
          </div>
        );
      },
    },
    {
      dataField: "ReceptionDTimeUTC", // Thời điểm tiếp nhận
      caption: t("ReceptionDTimeUTC"),
      editorType: "dxTextBox",
      visible: true,
      minWidth: 200,
    },
    {
      dataField: "TicketDeadline", // Deadline
      caption: t("TicketDeadline"),
      editorType: "dxTextBox",
      visible: true,
    },
    {
      dataField: "Description", // Tương tác mới nhất
      caption: t("Description"),
      editorType: "dxTextBox",
      width: 400,
      visible: true,
      cellRender: ({ data }: any) => {
        return (
          <div
            dangerouslySetInnerHTML={{ __html: data?.Description }}
            className="cursor-pointer hover:text-[#00703c] line-clamp-1 hover:underline"
            onClick={() => setPopupDesc(data)}
          ></div>
        );
      },
    },
    ...staticColumn,
    ...dynamicColumn,
  ];

  return columns;
};
