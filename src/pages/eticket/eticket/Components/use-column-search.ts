import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { authAtom } from "@/packages/store";
import { IItemProps } from "devextreme-react/form";
import CustomStore from "devextreme/data/custom_store";
import { useAtomValue } from "jotai";

interface Props {
  listAgent: any[];
  listDepart: any[];
  listOrg: any[];
  listEnterprise: any;
  getEstablishInfoType: any;
}

export const useColumnSearch = ({
  listAgent,
  listDepart,
  listOrg,
  listEnterprise,
  getEstablishInfoType,
}: Props) => {
  const { t } = useI18n("Eticket_Manager_Search");
  const auth = useAtomValue(authAtom);
  const api = useClientgateApi();
  const getListCustomer = new CustomStore({
    key: "CustomerCode",
    cacheRawData: true,
    loadMode: "processed",
    load: async (loadOptions: any) => {
      const resp: any = await api.Mst_Customer_Search({
        KeyWord: loadOptions?.searchValue,
      });
      return resp?.DataList ?? [];
    },
    byKey: async (key: any) => {
      const resp: any = await api.Mst_Customer_Search({
        KeyWord: key,
      });
      return resp?.DataList.filter((i: any) => i.CustomerCode === key) ?? [];
    },
  });

  const listColumn: IItemProps[] = [
    {
      dataField: "FlagOutOfDate", // ticket quá hạn
      caption: t("FlagOutOfDate"),
      visible: true,
      label: {
        text: t("FlagOutOfDate"),
      },
      colSpan: 2,
      cssClass:
        "flex align-items-center flex-direction-row-reverse justify-space-flex-end",
      editorType: "dxCheckBox",
      editorOptions: {
        showClearButton: true,
        defaultValue: false,
      },
    },
    {
      dataField: "FlagNotRespondingSLA", // ticket không đáp ứng sla
      caption: t("FlagNotRespondingSLA"),
      visible: true,
      label: {
        text: t("FlagNotRespondingSLA"),
      },
      colSpan: 2,
      cssClass:
        "flex align-items-center flex-direction-row-reverse justify-space-flex-end",
      editorType: "dxCheckBox",
      editorOptions: {
        showClearButton: true,
        defaultValue: false,
      },
    },
    {
      dataField: "DepartmentCode", // phòng ban
      caption: t("DepartmentCode"),
      visible: true,
      label: {
        text: t("DepartmentCode"),
      },
      colSpan: 2,
      editorOptions: {
        showClearButton: true,
        dataSource: listDepart.filter(
          (item: any) => item.OrgID === auth.orgId.toString()
        ),
        valueExpr: "DepartmentCode",
        displayExpr: "DepartmentName",
        searchEnabled: true,
        searchExpr: ["DepartmentName"],
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "AgentCode", // agent
      caption: t("AgentCode"),
      visible: true,
      label: {
        text: t("AgentCode"),
      },
      colSpan: 2,
      editorOptions: {
        showClearButton: true,
        dataSource: listAgent ?? [],
        valueExpr: "UserCode",
        displayExpr: "UserName",
        searchEnabled: true,
        searchExpr: ["UserName"],
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TicketStatus", // trạng thái
      caption: t("TicketStatus"),
      visible: true,
      label: {
        text: t("TicketStatus"),
      },
      colSpan: 2,
      editorOptions: {
        showClearButton: true,
        dataSource:
          getEstablishInfoType.Lst_Mst_TicketStatus.filter(
            (i: any) => i.FlagActive === "1"
          ) ?? [],
        valueExpr: "TicketStatus",
        displayExpr: "CustomerTicketStatusName",
        searchEnabled: true,
        searchExpr: ["CustomerTicketStatusName"],
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TicketPriority", // mức ưu tiên
      caption: t("TicketPriority"),
      visible: true,
      label: {
        text: t("TicketPriority"),
      },
      colSpan: 2,
      editorOptions: {
        showClearButton: true,
        dataSource:
          getEstablishInfoType.Lst_Mst_TicketPriority.filter(
            (i: any) => i.FlagActive === "1"
          ) ?? [],
        valueExpr: "TicketPriority",
        displayExpr: "CustomerTicketPriorityName",
        searchEnabled: true,
        searchExpr: ["CustomerTicketPriorityName"],
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TicketDeadline", // dealine
      caption: t("TicketDeadline"),
      visible: true,
      label: {
        text: t("TicketDeadline"),
      },
      colSpan: 1,
      editorType: "dxDateRangeBox",
      editorOptions: {
        showClearButton: true,
        type: "date",
        format: "yyyy-MM-dd",
        displayFormat: "yyyy-MM-dd",
      },
    },
    {
      dataField: "TicketType", // phân loại
      caption: t("TicketType"),
      visible: true,
      label: {
        text: t("TicketType"),
      },
      colSpan: 2,
      editorOptions: {
        showClearButton: true,
        dataSource: getEstablishInfoType.Lst_Mst_TicketType.filter((i: any) => {
          return i.FlagActive === "1";
        }),
        displayExpr: "CustomerTicketTypeName",
        valueExpr: "TicketType",
        searchEnabled: true,
        searchExpr: ["CustomerTicketTypeName"],
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "CustomerCodeSys", // khách hàng
      caption: t("CustomerCodeSys"),
      visible: true,
      label: {
        text: t("CustomerCodeSys"),
      },
      colSpan: 2,
      editorOptions: {
        dataSource: getListCustomer,
        displayExpr: "CustomerName",
        valueExpr: "CustomerCodeSys",
        searchEnabled: true,
        searchExpr: ["CustomerName"],
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TicketName", // tên ticket
      caption: t("TicketName"),
      visible: true,
      label: {
        text: t("TicketName"),
      },
      colSpan: 2,
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "TicketID", // mã ticket
      caption: t("TicketID"),
      visible: true,
      label: {
        text: t("TicketID"),
      },
      colSpan: 2,
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "Description", // Tương tác mới nhất
      caption: t("Description"),
      visible: true,
      label: {
        text: t("Description"),
      },
      colSpan: 2,
      editorOptions: {},
      editorType: "dxTextBox",
    },
    {
      dataField: "CreateDTimeUTC", //
      caption: t("CreateDTimeUTC"),
      visible: true,
      label: {
        text: t("CreateDTimeUTC"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {
        showClearButton: true,
        type: "date",
        format: "yyyy-MM-dd",
        displayFormat: "yyyy-MM-dd",
      },
    },
    {
      dataField: "LogLUDTimeUTC",
      caption: t("LogLUDTimeUTC"),
      visible: true,
      label: {
        text: t("LogLUDTimeUTC"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {
        showClearButton: true,
        type: "date",
        format: "yyyy-MM-dd",
        displayFormat: "yyyy-MM-dd",
      },
    },
    {
      dataField: "TicketSource",
      caption: t("TicketSource"),
      visible: true,
      label: {
        text: t("TicketSource"),
      },
      colSpan: 2,
      editorOptions: {
        showClearButton: true,
        dataSource:
          getEstablishInfoType.Lst_Mst_TicketSource.filter(
            (i: any) => i.FlagActive === "1"
          ) ?? [],
        displayExpr: "CustomerTicketSourceName",
        valueExpr: "TicketSource",
        searchEnabled: true,
        searchExpr: ["CustomerTicketSourceName"],
      },
      editorType: "dxSelectBox",
    },
    {
      dataField: "CustomerCompany", // Doanh nghiệp
      caption: t("CustomerCompany"),
      visible: true,
      label: {
        text: t("CustomerCompany"),
      },
      colSpan: 2,
      editorOptions: {
        showClearButton: true,
        dataSource: listEnterprise,
        displayExpr: "CustomerName",
        valueExpr: "CustomerCodeSys",
        searchEnabled: true,
        searchExpr: ["CustomerName"],
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "OrgID", // Doanh nghiệp
      caption: t("OrgID"),
      visible: true,
      label: {
        text: t("OrgID"),
      },

      colSpan: 2,
      editorOptions: {
        showClearButton: true,
        dataSource: listOrg,
        displayExpr: "NNTFullName",
        valueExpr: "OrgID",
        searchEnabled: true,
        searchExpr: ["NNTFullName"],
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "Follower", // Người theo dõi
      caption: t("Follower"),
      visible: true,
      label: {
        text: t("Follower"),
      },
      colSpan: 2,
      editorOptions: {
        showClearButton: true,
        dataSource: listAgent,
        valueExpr: "UserCode",
        displayExpr: "UserName",
        searchEnabled: true,
        searchExpr: ["UserName"],
      },
      editorType: "dxTagBox",
    },
    {
      dataField: "TicketCustomType", // Phân loại tùy chọn
      caption: t("TicketCustomType"),
      visible: true,
      label: {
        text: t("TicketCustomType"),
      },
      colSpan: 2,
      editorOptions: {
        showClearButton: true,
        dataSource:
          getEstablishInfoType.Lst_Mst_TicketCustomType.filter(
            (i: any) => i.FlagActive === "1"
          ) ?? [],
        displayExpr: "CustomerTicketCustomTypeName",
        valueExpr: "TicketCustomType",
        searchEnabled: true,
        searchExpr: ["TicketCustomType", "CustomerTicketCustomTypeName"],
      },
      editorType: "dxTagBox",
    },
  ];

  return listColumn;
};
