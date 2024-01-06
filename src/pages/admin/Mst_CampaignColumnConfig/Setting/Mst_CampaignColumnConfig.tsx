import { Icon } from "@packages/ui/icons";
import { CheckBox, LoadPanel, Switch } from "devextreme-react";
import Button from "devextreme-react/button";
import List from "devextreme-react/list";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useReducer } from "react";
import { EditForm } from "./Components/edit-form";
import {
  currentItemAtom,
  defatultValue,
  flagAtom,
  showPopupAtom,
} from "./Components/store";
// import "./list.scss";
import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { showErrorAtom } from "@/packages/store";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import {
  MdMetaColGroupSpecDto,
  MstCampaignColumnConfig,
  Mst_CampaignColumnConfig,
} from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { confirm } from "devextreme/ui/dialog";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";

interface ContentProps {
  listFields: MstCampaignColumnConfig[];
  onSaved: (data: any) => void;
  onDelete: (data: any) => void;
  onSuccess: () => void;
}

export const Mst_CampaignColumnConfig_Setting = () => {
  const { t } = useI18n("Mst_CampaignColumnConfig_Setting");

  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const {
    data: listFields,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const resp = await api.Mst_CampaignColumnConfig_Search();
      if (resp.isSuccess) {
        const fields = resp.DataList ?? [];
        return fields?.map((item: any) => {
          return {
            ...item,
            IsRequired: item?.FlagIsNotNull === "1",
            IsUnique: item?.FlagIsCheckDuplicate === "1",
            IsSearchable: item?.FlagIsQuery === "1",
          };
        });
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
    },
    queryKey: ["MdMetaColGroupSpec_Search"],
  });

  useEffect(() => {
    refetch();
  }, []);

  const onSaved = async (data: any) => {
    await refetch();
  };

  const onSuccess = async () => {
    await refetch();
  };

  const onDelete = async (data: any) => {
    const result = confirm(
      `<string>${t("Are You Want To Delete ?")}</string>`,
      `${t("Delete Warnning")}`
    );
    result.then(async (dialogResult: any) => {
      const param = {
        Lst_Mst_CampaignColumnConfig: [
          {
            ...data,
          },
        ],
      };

      if (dialogResult) {
        const resp = await api.Mst_CampaignColumnConfig_Delete(param);
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

  if (isLoading !== true) {
    return (
      <Mst_CampaignColumnConfig_SettingPage
        listFields={listFields ?? []}
        onSaved={onSaved}
        onDelete={onDelete}
        onSuccess={onSuccess}
      />
    );
  } else {
    return <LoadPanel />;
  }
};

const buildKey = (rawKey: string) => {
  return rawKey.replace(/\./g, "").toLowerCase();
};

export const Mst_CampaignColumnConfig_SettingPage = ({
  listFields,
  onSaved,
  onDelete,
  onSuccess,
}: ContentProps) => {
  const { t } = useI18n("Common");
  const setFlag = useSetAtom(flagAtom);
  const api = useClientgateApi();
  const setPopupVisible = useSetAtom(showPopupAtom);
  const setCurrentItem = useSetAtom(currentItemAtom);
  const handleSave = async (data: Mst_CampaignColumnConfig) => {
    onSaved(data);
    setPopupVisible(false);
  };
  const [loadingKey, reloading] = useReducer(() => nanoid(), "0");
  const defaultValueItem = useAtomValue(defatultValue);
  const handleEdit = (item: any) => {
    const obj = {
      ...item,
      ListOption: JSON.parse(item.JsonListOption),
    };
    if (
      item.CampaignColCfgDataType === "MASTERDATA" ||
      item.CampaignColCfgDataType === "MASTERDATASELECTMULTIPLE"
    ) {
      obj.DataSource = JSON.parse(item.JsonListOption)[0].Value;
    }
    setFlag("update");
    setCurrentItem(obj);
    setPopupVisible(true);
  };
  const handleAdd = async () => {
    setFlag("add");
    setCurrentItem(defaultValueItem);
    setPopupVisible(true);
  };

  const handleDelete = async (item: MdMetaColGroupSpecDto) => {
    onDelete(item);
  };

  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div className={"w-full h-full my-2"} id={"form-builder1"}>
          <PermissionContainer
            permission={"BTN_ADMIN_CAMPAIGN_COLUMN_CONFIG_CREATE"}
          >
            <Button type={"default"} text={t("AddNew")} onClick={handleAdd} />
          </PermissionContainer>
          <div className={"m-1"}></div>
          <EditForm
            onCancel={() => {
              setPopupVisible(false);
            }}
            onSave={handleSave}
            onSuccess={onSuccess}
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
            keyExpr="ColCodeSys"
            allowItemDeleting={false}
            itemRender={(item) => {
              return (
                <div className={"w-full flex items-center"}>
                  <div className={"w-[80px]"}>
                    <PermissionContainer
                      permission={"BTN_ADMIN_CAMPAIGN_COLUMN_CONFIG_UPDATE"}
                    >
                      <Button
                        onClick={() => handleEdit(item)}
                        stylingMode={"text"}
                      >
                        <Icon name={"edit"} size={10} />
                      </Button>
                    </PermissionContainer>
                    <PermissionContainer
                      permission={"BTN_ADMIN_CAMPAIGN_COLUMN_CONFIG_DELETE"}
                    >
                      <Button
                        onClick={() => handleDelete(item)}
                        stylingMode={"text"}
                      >
                        <Icon name={"trash"} color={"#ff0000"} size={10} />
                      </Button>
                    </PermissionContainer>
                  </div>
                  {/* <div className={"w-[300px]"}>
                    {item.CampaignColCfgCodeSys}
                  </div> */}
                  <div className={"w-[300px]"}>{item.CampaignColCfgCode}</div>
                  <div className={"w-[300px]"}>{item.CampaignColCfgName}</div>
                  <div className={"w-[300px]"}>
                    {item.CampaignColCfgDataType}
                  </div>
                  {/* <div className={"w-[150px]"}>
                    <CheckBox
                      readOnly={true}
                      stylingMode={"filled"}
                      text={"Required Field"}
                      value={true}
                    />
                  </div>
                  <div className={"w-[150px]"}>
                    <CheckBox
                      readOnly={true}
                      stylingMode={"filled"}
                      text={"Unique Field"}
                      value={true}
                    />
                  </div> */}
                  <div className={"w-[150px] flex items-center"}>
                    <Switch
                      value={item.FlagActive ?? false}
                      readOnly={true}
                      stylingMode={"filled"}
                      switchedOnText={"Active"}
                      switchedOffText={"Inactive"}
                    />
                    <span className={"ml-3"}>
                      {item.FlagActive ? t("Active") : t("Inactive")}
                    </span>
                  </div>
                </div>
              );
            }}
          >
            {/* <ItemDragging allowReordering={true}></ItemDragging> */}
          </List>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
