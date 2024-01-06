import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import { logger } from "@packages/logger";
import { MdMetaColGroupSpecDto, MstTicketColumnConfig } from "@packages/types";
import { Icon } from "@packages/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { CheckBox, LoadPanel, Switch } from "devextreme-react";
import Button from "devextreme-react/button";
import List, { ItemDragging } from "devextreme-react/list";
import { confirm } from "devextreme/ui/dialog";
import { useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { EditForm } from "./components/edit-form";
import { currentItemAtom, flagAtom, showPopupAtom } from "./components/store";
import "./list.scss";

export const Eticket_Custom_Field_Dynamic = () => {
  const { t } = useI18n("Eticket_Custom_Field_Dynamic");
  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const { auth } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Mst_TicketColumnConfig_GetAll_Perform"],
    queryFn: async () => {
      const response = await api.Mst_TicketColumnConfig_GetAll();
      if (response.isSuccess) {
        const listColDataTypeValid = [
          "DATE",
          "DATETIME",
          "DECIMAL",
          "INT",
          "MASTERDATA",
          "MASTERDATASELECTMULTIPLE",
          "PASSWORD",
          "PERCENT",
          "SELECTMULTIPLEDROPDOWN",
          "SELECTMULTIPLESELECTBOX",
          "SELECTONEDROPDOWN",
          "SELECTONERADIO",
          "TEXT",
          "TEXTAREA",
          "URL",
        ];

        const data = response.Data?.Lst_Mst_TicketColumnConfig;

        // data?.forEach(async (item: any) => {
        //   const _ = await api.Mst_TicketColumnConfig_Delete([
        //     {
        //       TicketColCfgCodeSys: item.TicketColCfgCodeSys,
        //       OrgID: auth.orgData?.Id ?? "",
        //     },
        //   ]);

        //   if (_.isSuccess) {
        //     toast.success("");
        //   } else {
        //     toast.error("");
        //   }
        // });

        // const listInvalid = data?.filter(
        //   (item: any) =>
        //     !listColDataTypeValid.includes(item?.TicketColCfgDataType)
        // );

        return data?.filter((c: any) =>
          listColDataTypeValid.includes(c?.TicketColCfgDataType)
        );
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
    },
  });

  // useEffect(() => {
  //   refetch();
  // }, []);

  const onSaved = async () => {
    await refetch();
  };

  const onDelete = async (data: MstTicketColumnConfig) => {
    const param = [
      {
        TicketColCfgCodeSys: data.TicketColCfgCodeSys,
        OrgID: auth.orgData?.Id ?? "",
      },
    ];

    const result = confirm(
      `<string>${t("Are You Want To Delete")}</string>`,
      `${t("Delete")}`
    );

    result.then(async (dialogResult: any) => {
      if (dialogResult) {
        const resp = await api.Mst_TicketColumnConfig_Delete(param);
        if (resp.isSuccess) {
          await refetch();
          toast.success(t("Delete Success"));
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
      }
    });
  };

  if (isLoading || !data) {
    return <LoadPanel />;
  }

  // if (fakeGroup && fakeGroup.length > 0) {
  return (
    <CustomFieldListPageContent
      listFields={data ?? []}
      onSaved={onSaved}
      onDelete={onDelete}
    />
  );
  // }
  // return <LoadPanel />;
};

interface ContentProps {
  listFields: MstTicketColumnConfig[];
  onSaved: () => void;
  onDelete: (data: MstTicketColumnConfig) => void;
}

// const buildKey = (rawKey: string) => {
//   return rawKey.replace(/\./g, "").toLowerCase();
// };

export const CustomFieldListPageContent = ({
  listFields,
  onSaved,
  onDelete,
}: ContentProps) => {
  const setFlag = useSetAtom(flagAtom);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const { t } = useI18n("Customer_DynamicField");
  const setPopupVisible = useSetAtom(showPopupAtom);
  const setCurrentItem = useSetAtom(currentItemAtom);
  const handleSave = async (data: MdMetaColGroupSpecDto) => {
    logger.debug("saved item:", data);
    onSaved();
    setPopupVisible(false);
  };

  const handleEdit = (item: MstTicketColumnConfig) => {
    const obj = {
      ...item,
      DataSource: [],
      ListOption: item.JsonListOption ? JSON.parse(item.JsonListOption) : "{}",
      FlagCheckDuplicate: item.FlagCheckDuplicate === "1" ? true : false,
      FlagCheckRequire: item.FlagCheckRequire === "1" ? true : false,
      FlagIsDynamic: item.FlagIsDynamic === "1" ? true : false,
      FlagActive: item.FlagActive === "1" ? true : false,
    };
    if (item.TicketColCfgDataType === "MASTERDATA") {
      obj.DataSource = JSON.parse(item.JsonListOption)[0].Value;
    }
    if (item.TicketColCfgDataType === "MASTERDATASELECTMULTIPLE") {
      obj.DataSource = JSON.parse(item.JsonListOption)[0].Value;
    }
    setFlag("update");
    setCurrentItem(obj);
    setPopupVisible(true);
  };
  const handleAdd = async () => {
    setFlag("add");
    const resp = await api.Seq_GetTicketColCfgCodeSys();
    if (resp.isSuccess) {
      setCurrentItem({
        TicketColCfgCodeSys: resp.Data,
        TicketColCfgCode: resp.Data,
        ListOption: [],
        FlagActive: true,
        FlagCheckRequire: true,
        FlagCheckDuplicate: true,
      });
      setPopupVisible(true);
    }
  };

  const handleDelete = async (item: MstTicketColumnConfig) => {
    onDelete(item);
  };

  const handleItemReordered = async ({ component: listComponent }: any) => {
    const data = listComponent.instance().option("items");
    let newOrderedData: any[] = [];
    for (let i = 0; i < data.length; i++) {
      newOrderedData.push({
        ...data[i],
        TicketColCfgIdx: i,
      });
    }
    const resp = await api.Mst_TicketColumnConfig_UpdateTicketColCfgIdx(
      newOrderedData
    );
    if (resp.isSuccess) {
      toast.success(t("Update Success"));
      onSaved();
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

  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div className={"w-full h-full my-2"} id={"form-builder"}>
          <div className={"m-1"}>
            <PermissionContainer
              permission={"BTN_ADMIN_ETICKETFIELD_LIST_CREATE"}
            >
              <Button
                type={"default"}
                text={t("Add New")}
                onClick={handleAdd}
              />
            </PermissionContainer>
          </div>
          <EditForm
            onCancel={() => {
              setPopupVisible(false);
            }}
            onSave={handleSave}
          />
          <LoadPanel
            container={".dx-viewport"}
            shadingColor="rgba(0,0,0,0.4)"
            position={"center"}
            showIndicator={true}
            showPane={true}
          />
          <List
            dataSource={listFields}
            keyExpr="TicketColCfgCodeSys"
            onItemReordered={handleItemReordered}
            allowItemDeleting={false}
            itemRender={(item) => {
              return (
                <div className={"w-full flex items-center"}>
                  <div className={"w-[80px]"}>
                    <PermissionContainer
                      permission={"BTN_ADMIN_ETICKETFIELD_LIST_UPDATE"}
                    >
                      <Button
                        onClick={() => handleEdit(item)}
                        stylingMode={"text"}
                      >
                        <Icon name={"edit"} size={10} />
                      </Button>
                    </PermissionContainer>
                    <PermissionContainer
                      permission={"BTN_ADMIN_ETICKETFIELD_LIST_DELETE"}
                    >
                      <Button
                        onClick={() => handleDelete(item)}
                        stylingMode={"text"}
                      >
                        <Icon name={"trash"} color={"#ff0000"} size={10} />
                      </Button>
                    </PermissionContainer>
                  </div>
                  <div className={"w-[300px] items-center"}>
                    {item.TicketColCfgCode}
                  </div>
                  <div className={"w-[300px]"}>{item.TicketColCfgName}</div>
                  <div className={"w-[300px]"}>{item.TicketColCfgDataType}</div>
                  <div className={"w-[150px]"}>
                    <CheckBox
                      readOnly={true}
                      stylingMode={"filled"}
                      text={t("Required Field")}
                      value={item.FlagCheckRequire === "1"}
                    />
                  </div>
                  <div className={"w-[150px]"}>
                    <CheckBox
                      readOnly={true}
                      stylingMode={"filled"}
                      text={t("Unique Field")}
                      value={item.FlagCheckDuplicate === "1"}
                    />
                  </div>
                  <div className={"w-[150px] flex items-center"}>
                    <Switch
                      value={item.FlagActive === "1"}
                      readOnly={true}
                      stylingMode={"filled"}
                      switchedOnText={t("FlagActive")}
                      switchedOffText={"Disabled"}
                    />
                    <span className={"ml-3"}>
                      {item.FlagIsDynamic ? t("FlagActive") : t("Disabled")}
                    </span>
                  </div>
                </div>
              );
            }}
          >
            <ItemDragging allowReordering={true}></ItemDragging>
          </List>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
