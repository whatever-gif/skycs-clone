import PermissionContainer from "@/components/PermissionContainer";
import { getYearMonthDate } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { permissionAtom, showErrorAtom } from "@/packages/store";
import { customizeGridSelectionKeysAtom } from "@/packages/ui/base-gridview/store/normal-grid-store";
import { Button } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";
interface HeaderPartProps {
  onAddNew: () => void;
  searchCondition: any;
}

const HeaderPart = ({ onAddNew, searchCondition }: HeaderPartProps) => {
  const { t } = useI18n("Eticket_Manager_Header");
  const selectedItems = useAtomValue(customizeGridSelectionKeysAtom);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const permissionStore = useAtomValue(permissionAtom);
  const handleExportExcel = async () => {
    const TicketIDSearch = searchCondition?.TicketID ?? "";
    let ticketSelect = [...selectedItems];
    if (TicketIDSearch !== "" && TicketIDSearch) {
      ticketSelect = [...ticketSelect, TicketIDSearch];
    }

    let conditionParam = {
      ...searchCondition,
      FlagOutOfDate: searchCondition?.FlagOutOfDate ? "1" : "",
      FlagNotRespondingSLA: searchCondition?.FlagNotRespondingSLA ? "1" : "",
      TicketSource: searchCondition?.TicketSource
        ? searchCondition.TicketSource.join(",")
        : "",
      CustomerCodeSysERP: searchCondition?.CustomerCodeSysERP
        ? searchCondition.CustomerCodeSysERP.join(",")
        : "",
      TicketStatus: searchCondition?.TicketStatus
        ? searchCondition.TicketStatus.join(",")
        : "",
      // TicketID: selectedItems.join(","),
      TicketID: ticketSelect.join(",") ?? "",
      Follower: searchCondition?.Follower
        ? searchCondition.Follower.join(",")
        : "",
      TicketDeadlineFrom: searchCondition?.TicketDeadline[0]
        ? getYearMonthDate(searchCondition?.TicketDeadline[0])
        : "",
      TicketDeadlineTo: searchCondition?.TicketDeadline[1]
        ? getYearMonthDate(searchCondition?.TicketDeadline[1])
        : "",
      CreateDTimeUTCFrom: searchCondition?.CreateDTimeUTC[0]
        ? getYearMonthDate(searchCondition?.CreateDTimeUTC[0])
        : "",
      CreateDTimeUTCTo: searchCondition?.CreateDTimeUTC[1]
        ? getYearMonthDate(searchCondition?.CreateDTimeUTC[1])
        : "",
      LogLUDTimeUTCFrom: searchCondition?.LogLUDTimeUTC[0]
        ? getYearMonthDate(searchCondition?.LogLUDTimeUTC[0])
        : "",
      LogLUDTimeUTCTo: searchCondition?.LogLUDTimeUTC[1]
        ? getYearMonthDate(searchCondition?.LogLUDTimeUTC[1])
        : "",
      CustomerCodeSys: searchCondition?.CustomerCodeSys
        ? searchCondition.CustomerCodeSys.join(",")
        : "",
      TicketType: searchCondition?.TicketType
        ? searchCondition.TicketType.join(",")
        : "",
      DepartmentCode: searchCondition?.DepartmentCode
        ? searchCondition.DepartmentCode.join(",")
        : "",
      AgentCode: searchCondition?.AgentCode
        ? searchCondition.AgentCode.join(",")
        : "",
      TicketPriority: searchCondition?.TicketPriority
        ? searchCondition.TicketPriority.join(",")
        : "",
      OrgID: searchCondition?.OrgID ? searchCondition.OrgID.join(",") : "",
      TicketCustomType: searchCondition?.TicketCustomType
        ? searchCondition?.TicketCustomType.join(",")
        : "",
    };

    const response = await api.ET_Ticket_Export(conditionParam);
    if (response.isSuccess) {
      if (response.Data) {
        toast.success(t("Export Excel success"));
        window.location.href = response.Data;
      }
    } else {
      showError({
        message: response._strErrCode,
        _strErrCode: response._strErrCode,
        _strTId: response._strTId,
        _strAppTId: response._strAppTId,
        _objTTime: response._objTTime,
        _strType: response._strType,
        _dicDebug: response._dicDebug,
        _dicExcs: response._dicExcs,
      });
    }
  };

  // const { exportButton, exportDialog } = useExportExcel({
  //   buttonClassName: "w-full",
  //   selectedItems,
  //   onExportExcel: handleExportExcel,
  // });

  const checkPermision = (permission: string) => {
    return permissionStore.buttons?.includes(permission) ?? false;
  };

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">
          {t("Eticket_Manager")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <PermissionContainer permission={"BTN_ETICKET_LIST_CREATE"}>
          <Button
            icon="/images/icons/plus-circle.svg"
            stylingMode={"contained"}
            type="default"
            className="heder-part-button-add"
            text={t("Add New")}
            onClick={onAddNew}
          />
        </PermissionContainer>

        <DropDownButton
          showArrowIcon={false}
          keyExpr={"id"}
          className="menu-items"
          displayExpr={"text"}
          wrapItemText={false}
          dropDownOptions={{
            width: 200,
            wrapperAttr: {
              class: "headerform__menuitems",
            },
          }}
          icon="/images/icons/more.svg"
        >
          <DropDownButtonItem
            onClick={handleExportExcel}
            visible={checkPermision("BTN_ETICKET_LIST_MORE_EXPORTEXCEL")}
            render={(item: any) => {
              return (
                <Button
                  stylingMode="text"
                  hoverStateEnabled={false}
                  className={""}
                  text={t("ExportExcel")}
                />
              );
            }}
          />
        </DropDownButton>

        {/* {exportDialog} */}
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};

export default HeaderPart;
