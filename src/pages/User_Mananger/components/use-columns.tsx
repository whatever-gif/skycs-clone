import { ColumnOptions } from "@packages/ui/base-gridview";

import { filterByFlagActive, uniqueFilterByDataField } from "@packages/common";
import { StatusButton } from "@packages/ui/status-button";
import { useI18n } from "@/i18n/useI18n";
import { SysUserData } from "@packages/types";
import { useSetAtom } from "jotai";

import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import {
  avatar,
  dataFormAtom,
  flagEdit,
  showDetail,
  showPopup,
  viewingDataAtom,
} from "@/pages/User_Mananger/components/store";
import { useEffect } from "react";
import { useClientgateApi } from "@/packages/api";

const flagEditorOptions = {
  searchEnabled: true,
  valueExpr: "value",
  displayExpr: "text",
  items: [
    {
      value: "1",
      text: "1",
    },
    {
      value: "0",
      text: "0",
    },
  ],
};

interface UseDealerGridColumnsProps {
  data: SysUserData[];
}

export const useDealerGridColumns = ({ data }: UseDealerGridColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const api = useClientgateApi();
  const setDataForm = useSetAtom(dataFormAtom);
  const setAvt = useSetAtom(avatar);
  const setFlag = useSetAtom(flagEdit);

  const viewRow = async (rowIndex: number, data: any) => {
    setShowDetail(true);
    setFlag("Detail");
    const resp = await api.Sys_User_Data_GetByUserCode(data.UserCode);
    if (resp.isSuccess) {
      setAvt(resp?.Data?.Lst_Sys_User?.Avatar);
      setDataForm({
        ...resp?.Data?.Lst_Sys_User,
        FlagNNTAdmin:
          resp.Data?.Lst_Sys_User?.FlagNNTAdmin === "1" ? true : false,
        FlagSysAdmin:
          resp.Data?.Lst_Sys_User?.FlagSysAdmin === "1" ? true : false,
        FlagActive: resp.Data?.Lst_Sys_User?.FlagActive === "1" ? true : false,
        DepartmentName: resp.Data?.Lst_Sys_UserMapDepartment?.map(
          (item: any) => item.DepartmentCode
        ),
        GroupName: resp.Data?.Lst_Sys_UserInGroup?.map(
          (item: any) => item.GroupCode
        ),
        ReUserPassword: resp.Data?.Lst_Sys_User?.UserPassword,
      });
    }
    setPopupVisible(true);
  };

  const { t } = useI18n("User_Mananger-colums");
  const columns: ColumnOptions[] = [
    {
      dataField: "ACId",
      editorOptions: {
        placeholder: t("Input"),
      },
      filterType: "exclude",
      caption: t("UserID"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "UserName",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("UserName"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      cellRender: ({ data, rowIndex, value }: any) => {
        return (
          <LinkCell
            key={nanoid()}
            onClick={() => viewRow(rowIndex, data)}
            value={value}
          />
        );
      },
    },
    {
      dataField: "EMail",
      editorOptions: {
        readOnly: true,
      },
      filterType: "exclude",
      caption: t("EMail"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "PhoneNo",
      editorOptions: {
        readOnly: true,
      },
      filterType: "exclude",
      caption: t("PhoneNo"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "Extension",
      editorOptions: {
        readOnly: true,
      },
      filterType: "exclude",
      caption: t("Extension"),
      width: 118,
      alignment: "center",
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "DepartmentName",
      editorOptions: {
        readOnly: true,
      },
      filterType: "exclude",
      caption: t("DepartmentName"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "GroupName",
      editorOptions: {
        readOnly: true,
      },
      filterType: "exclude",
      caption: t("GroupName"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "AuthorizeDTimeStart",
      editorOptions: {
        readOnly: true,
      },
      filterType: "exclude",
      caption: t("AuthorizeDTimeStart"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "FlagActive",
      caption: t("Status"),
      editorType: "dxSwitch",
      columnIndex: 2,
      headerFilter: {
        dataSource: filterByFlagActive(data ?? [], {
          true: t("Active"),
          false: t("Inactive"),
        }),
      },
      filterType: "exclude",
      groupKey: "BASIC_INFORMATION",
      visible: true,
      cellRender: ({ data }: any) => {
        return <StatusButton key={nanoid()} isActive={data.FlagActive} />;
      },
    },
  ];
  // return array of the first item only

  return columns;
};
