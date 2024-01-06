import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { MdMetaColGroup, MdMetaColGroupSpecDto } from "@/packages/types";
import { Icon } from "@/packages/ui/icons";
import {
  Accordion,
  Button,
  CheckBox,
  List,
  LoadPanel,
  Switch,
} from "devextreme-react";
import { ItemDragging } from "devextreme-react/list";
import { useAtom, useSetAtom } from "jotai";
import { useMemo, useRef, useState } from "react";

import PermissionContainer from "@/components/PermissionContainer";
import { EditForm } from "./PopupField";
import { handleSort } from "./handle";
import { currentItemAtom, flagAtom, listData, showPopupAtom } from "./store";

interface ContentProps {
  listColGroups: MdMetaColGroup[];
  onSaved: () => void;
  onDelete: (data: any) => void;
}

const buildKey = (rawKey: string) => {
  return rawKey.replace(/\./g, "").toLowerCase();
};

export const ListGroupField = ({
  listColGroups,
  onSaved,
  onDelete,
}: ContentProps) => {
  const setFlag = useSetAtom(flagAtom);
  const { t } = useI18n("CustomField");

  const { t: common } = useI18n("Common");

  const ref: any = useRef();

  const [currentListData, setCurrentListData] = useAtom(listData);
  const [currentOpen, setCurrentOpen] = useState([]);

  const fieldByGroup = useMemo(() => {
    return currentListData?.reduce((result: any, curr: any) => {
      result[buildKey(curr.ColGrpCodeSys)] =
        result[buildKey(curr.ColGrpCodeSys)] ?? [];
      result[buildKey(curr.ColGrpCodeSys)].push({
        ...curr,
        FlagIsCheckDuplicate: curr.FlagIsCheckDuplicate == "1",
        FlagIsNotNull: curr.FlagIsNotNull == "1",
        FlagIsQuery: curr.FlagIsQuery == "1",

        IsUnique: curr.FlagIsCheckDuplicate == "1",
        IsRequired: curr.FlagIsNotNull == "1",
        IsSearchable: curr.FlagIsQuery == "1",
        // @ts-ignore
        Enabled: curr.FlagActive, // is boolean as we converted in response
      });
      return result;
    }, {});
  }, [currentListData]);

  const api = useClientgateApi();

  const setPopupVisible = useSetAtom(showPopupAtom);
  const setCurrentItem = useSetAtom(currentItemAtom);

  const handleSave = async (data: MdMetaColGroupSpecDto) => {
    onSaved();
    setPopupVisible(false);
  };

  const handleEdit = (item: MdMetaColGroupSpecDto) => {
    const obj = {
      ...item,
      ListOption: JSON.parse(item?.mdmc_JsonListOption ?? "[]"),
    };

    const list = JSON.parse(item?.mdmc_JsonListOption ?? "[]");

    if (item.ColDataType === "MASTERDATA") {
      obj.DataSource =
        list && list[0] && list[0]?.Value ? list[0]?.Value : undefined;
    }
    if (item.ColDataType === "MASTERDATASELECTMULTIPLE") {
      obj.DataSource =
        list && list[0] && list[0]?.Value ? list[0]?.Value : undefined;
    }
    setFlag("update");
    setCurrentItem(obj);
    setPopupVisible(true);
  };
  const handleAdd = async () => {
    setFlag("add");
    const resp = await api.Seq_GetColCodeSys();
    if (resp.isSuccess) {
      setCurrentItem({
        ColCodeSys: resp.Data,
        ColCode: resp.Data,
        ListOption: [],
        IsRequired: false,
        FlagIsNotNull: "0",
        IsUnique: false,
        FlagIsCheckDuplicate: "0",
        IsSearchable: true,
        FlagIsQuery: "1",
        Enabled: true,
        FlagActive: "1",
        FlagIsColDynamic: "1",
        OrderIdx: 0,
      });
      setPopupVisible(true);
    }
  };

  const handleDelete = async (data: MdMetaColGroupSpecDto) => {
    const result = currentListData?.filter(
      (item: any) => item?.ColCodeSys != data?.ColCodeSys
    );

    const sortedList = handleSort(result);

    setCurrentListData(sortedList);
  };
  const showError = useSetAtom(showErrorAtom);
  const handleItemReordered = async ({ component: listComponent }: any) => {
    const data = listComponent.instance().option("items");

    const sortedData = data?.map((item: any, index: any) => {
      return {
        ...item,
        OrderIdx: index + 1,
      };
    });

    const newListData = currentListData?.map((item: any) => {
      const found =
        sortedData?.find(
          (c: any) =>
            c?.ColCodeSys == item?.ColCodeSys &&
            c?.ColGrpCodeSys == item?.ColGrpCodeSys
        ) ?? undefined;
      if (found) {
        item.OrderIdx = found?.OrderIdx;
      }

      return item;
    });

    setCurrentListData(newListData);
  };

  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div className={"w-full h-full my-2"} id={"form-builder"}>
          <div className={"bg-white"}>
            <PermissionContainer permission={"BTN_CONFIGLAYOUT_ADD"}>
              <Button
                type={"default"}
                text={common("Add")}
                onClick={handleAdd}
                style={{ marginBottom: 10, marginLeft: 10 }}
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
          <Accordion
            ref={ref}
            collapsible={true}
            multiple={true}
            dataSource={listColGroups}
            itemTitleRender={(item) => {
              return <div>{item.ColGrpName}</div>;
            }}
            onSelectedItemKeysChange={(e: any) => {
              setCurrentOpen(e);
            }}
            selectedItemKeys={currentOpen}
            keyExpr="ColGrpCodeSys"
            className="custom-accordion"
            itemRender={(item) => {
              return (
                <List
                  dataSource={fieldByGroup[buildKey(item.ColGrpCodeSys)]?.sort(
                    (a: any, b: any) => a?.OrderIdx - b?.OrderIdx
                  )}
                  keyExpr="ColCodeSys"
                  allowItemDeleting={false}
                  onItemReordered={handleItemReordered}
                  itemRender={(c: any) => {
                    return (
                      <div className={"w-full flex items-center"}>
                        <div className={"w-[80px]"}>
                          <PermissionContainer
                            permission={"BTN_CONFIGLAYOUT_EDIT"}
                          >
                            <Button
                              onClick={() => handleEdit(c)}
                              stylingMode={"text"}
                            >
                              <Icon name={"edit"} size={10} />
                            </Button>
                          </PermissionContainer>
                          <PermissionContainer
                            permission={"BTN_CONFIGLAYOUT_DELETE"}
                          >
                            <Button
                              onClick={() => handleDelete(c)}
                              stylingMode={"text"}
                            >
                              <Icon
                                name={"trash"}
                                color={"#ff0000"}
                                size={10}
                              />
                            </Button>
                          </PermissionContainer>
                        </div>
                        <div className={"w-[100px] ml-2"}>{c.OrderIdx}</div>
                        <div className={"w-[300px] items-center"}>
                          {c.ColCode}
                        </div>
                        <div className={"w-[300px]"}>{c.ColCaption}</div>
                        <div className={"w-[300px]"}>{c.ColDataType}</div>
                        <div className={"w-[150px] flex items-center gap-1"}>
                          <CheckBox
                            readOnly={true}
                            stylingMode={"filled"}
                            text={t("Required Field")}
                            value={c.FlagIsNotNull == "1"}
                            className="w-[150px]"
                          />
                        </div>
                        <div className={"w-[150px] flex items-center gap-1"}>
                          <CheckBox
                            readOnly={true}
                            stylingMode={"filled"}
                            text={t("Unique Field")}
                            value={c.FlagIsCheckDuplicate == "1"}
                            className="w-[150px]"
                          />
                        </div>
                        <div className={"w-[150px] flex items-center"}>
                          <Switch
                            value={c.FlagActive}
                            readOnly={true}
                            stylingMode={"filled"}
                            switchedOnText={"FlagActive"}
                            switchedOffText={"Disabled"}
                          />
                          <span className={"ml-3"}>
                            {c.FlagActive ? t("FlagActive") : t("Disabled")}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                >
                  <ItemDragging allowReordering={true}></ItemDragging>
                </List>
              );
            }}
          />
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
