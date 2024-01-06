import { ColumnOptions } from "@packages/ui/base-gridview";

import { useI18n } from "@/i18n/useI18n";
import { useSetAtom } from "jotai";

import { useClientgateApi } from "@/packages/api";
import { StatusButton } from "@/packages/ui/status-button";

import PermissionContainer from "@/components/PermissionContainer";
import { showErrorAtom } from "@/packages/store";
import { Button } from "devextreme-react";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { currentItemAtom, flagAtom, showPopupAtom } from "./store";

export const useConfigDynamicFieldColumn = ({ refetch }: any) => {
  const setPopupVisible = useSetAtom(showPopupAtom);
  const setFlag = useSetAtom(flagAtom);
  const setCurrentItem = useSetAtom(currentItemAtom);
  const api = useClientgateApi();

  const { t } = useI18n("ConfigDynamicField");

  const { t: common } = useI18n("Common");

  const showError = useSetAtom(showErrorAtom);

  const handleOpenDetail = (data: any) => {
    const obj = {
      ...data,
      ListOption: JSON.parse(data.JsonListOption),
    };
    if (data.ColDataType === "MASTERDATA") {
      const currentValue = JSON.parse(data.JsonListOption);

      obj.DataSource =
        currentValue && currentValue[0] && currentValue[0]?.Value
          ? currentValue[0]?.Value
          : "";
    }
    if (data.ColDataType === "MASTERDATASELECTMULTIPLE") {
      const currentValue = JSON.parse(data.JsonListOption);

      obj.DataSource =
        currentValue && currentValue[0] && currentValue[0]?.Value
          ? currentValue[0]?.Value
          : "";
    }
    setFlag("detail");
    setPopupVisible(true);
    setCurrentItem({ ...obj });

    console.log(obj);
  };

  const handleOpenEdit = (data: any) => {
    const obj = {
      ...data,
      ListOption: JSON.parse(data.JsonListOption),
    };
    if (data.ColDataType === "MASTERDATA") {
      const currentValue = JSON.parse(data.JsonListOption);

      obj.DataSource =
        currentValue && currentValue[0] && currentValue[0]?.Value
          ? currentValue[0]?.Value
          : "";
    }
    if (data.ColDataType === "MASTERDATASELECTMULTIPLE") {
      const currentValue = JSON.parse(data?.JsonListOption ?? "[]");

      obj.DataSource =
        currentValue && currentValue[0] && currentValue[0]?.Value
          ? currentValue[0]?.Value
          : "";
    }

    setFlag("update");
    setCurrentItem(obj);
    setPopupVisible(true);
  };

  const handleDelete = async (data: any) => {
    const resp: any = await api.MDMetaColumn_Delete(data.ColCodeSys);

    if (resp?.isSuccess) {
      toast.success(common("Delete successfully!"));
      refetch();
    } else {
      showError({
        message: resp._strErrCode,
        _strErrCode: resp._strErrCode,
        _strTId: resp._strTId,
        _strAppTId: resp._strAppTId,
        _objTTime: resp._objTTime,
        _strType: resp._strType,
        _dicDebug: resp._dicDebug,
        _dicExcs: resp._dicExcs,
      });
    }
  };

  const columns: ColumnOptions[] = [
    {
      dataField: "",
      editorOptions: {
        placeholder: t("Input"),
      },
      filterType: "exclude",
      visible: true,
      cellRender: ({ data }: any) => {
        return (
          <div className="flex w-full justify-around">
            <PermissionContainer permission="BTN_CONFIGDYNAMICFIELD_EDIT">
              <Button
                className={"cursor-pointer btn-icon"}
                icon={"/images/icons/edit.svg"}
                onClick={() => handleOpenEdit(data)}
              ></Button>
            </PermissionContainer>

            <PermissionContainer permission="BTN_CONFIGDYNAMICFIELD_DELETE">
              <Button
                className={"cursor-pointer btn-icon"}
                icon={"/images/icons/trash.svg"}
                onClick={() => handleDelete(data)}
              />
            </PermissionContainer>
          </div>
        );
      },
      width: 90,
    },
    {
      dataField: "ColCode",
      editorOptions: {
        placeholder: t("Input"),
      },
      filterType: "exclude",
      caption: t("ColCode"),
      visible: true,
      cellRender: ({ data }: any) => {
        return (
          <div
            className="text-[#00703c] font-semibold cursor-pointer"
            onClick={() => handleOpenDetail(data)}
          >
            {data.ColCode}
          </div>
        );
      },
    },
    {
      dataField: "ColCaption",
      editorOptions: {
        placeholder: t("Input"),
      },
      filterType: "exclude",
      caption: t("ColCaption"),
      visible: true,
    },
    {
      dataField: "ColDataType",
      editorOptions: {
        placeholder: t("Input"),
      },
      filterType: "exclude",
      caption: t("ColDataType"),
      visible: true,
    },
    {
      dataField: "FlagActive",
      editorOptions: {
        placeholder: t("Input"),
      },
      filterType: "exclude",
      caption: t("FlagActive"),
      visible: true,
      cellRender: ({ data }: any) => {
        return (
          <StatusButton key={nanoid()} isActive={data.FlagActive == "1"} />
        );
      },
    },
  ];

  return columns;
};
