import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "@/packages/contexts/auth";
import { usePermissions } from "@/packages/contexts/permission";
import { Icon } from "@/packages/ui/icons";
import { Button, Form, List } from "devextreme-react";
import {
  ButtonItem,
  ButtonOptions,
  GroupItem,
  SimpleItem,
} from "devextreme-react/form";
import { nanoid } from "nanoid";
import React, { useRef, useState } from "react";
import { match } from "ts-pattern";

interface Props {
  item: any;
  formList: any[];
}

const ListFormComponent = ({ item, formList }: Props) => {
  const { t } = useI18n("Mst_TicketEstablishInfo_Save");
  const { hasButtonPermission } = usePermissions();
  const [list, setList] = useState(item.list);
  const listRef: any = useRef();
  const handleDelete = (title: any, itemList: any) => {
    let arr;
    if (itemList?.idCreate) {
      arr = list.filter((itemFilter: any) => {
        return itemFilter.idCreate !== itemList.idCreate;
      });
    } else {
      arr = list.filter((itemFilter: any) => {
        return itemFilter.TicketType !== itemList.TicketType;
      });
    }
    setList(arr);
  };
  const { auth } = useAuth();
  const handleAdd = () => {
    const defaultValue = {
      OrgID: auth.orgData?.Id,
      TicketSource: "", // hệ thống tự nhập
      NetworkID: auth.networkId,
      FlagUseType: "TYPE3",
      FlagActive: "1",
      Remark: "",
      flagRemoveWhenEdit: true,
      LogLUDTimeUTC: "", // ??
      LogLUBy: "", // ??
    };
    let obj = match(item.title)
      .with("Lst_Mst_TicketStatus", () => {
        return {
          AgentTicketStatusName: "",
          CustomerTicketStatusName: "",
          idCreate: nanoid(),
        };
      })
      .with("Lst_Mst_TicketPriority", () => {
        return {
          AgentTicketPriorityName: "",
          CustomerTicketPriorityName: "",
          idCreate: nanoid(),
        };
      })
      .with("Lst_Mst_TicketType", () => {
        return {
          AgentTicketTypeName: "",
          CustomerTicketTypeName: "",
          idCreate: nanoid(),
        };
      })
      .with("Lst_Mst_TicketSource", () => {
        return {
          AgentTicketSourceName: "",
          CustomerTicketSourceName: "",
          idCreate: nanoid(),
        };
      })
      .with("Lst_Mst_TicketCustomType", () => {
        return {
          AgentTicketCustomTypeName: "",
          CustomerTicketCustomTypeName: "",
          idCreate: nanoid(),
        };
      })
      .with("Lst_Mst_ReceptionChannel", () => {
        return {
          AgentReceptionChannelName: "",
          CustomerReceptionChannelName: "",
          idCreate: nanoid(),
        };
      })
      .with("Lst_Mst_ContactChannel", () => {
        return {
          AgentContactChannelName: "",
          CustomerContactChannelName: "",
          idCreate: nanoid(),
        };
      })
      .otherwise(() => {
        return {};
      });
    let newItem = {
      ...defaultValue,
      ...obj,
    };
    setList((prev: any) => {
      return [...prev, newItem];
    });
  };
  return (
    <>
      <List
        dataSource={list}
        keyExpr="ColCodeSys"
        allowItemDeleting={false}
        ref={listRef}
        activeStateEnabled={false}
        bounceEnabled={false}
        itemRender={(itemList) => {
          return (
            <Form
              formData={itemList}
              labelMode="hidden"
              validationGroup="Mst_TicketEstablishInfo_Form"
            >
              <GroupItem colCount={4}>
                {formList.map((itemForm: any, index: number) => {
                  if (
                    itemList.FlagActive === "0" &&
                    itemForm.dataField === "FlagActive"
                  ) {
                    return (
                      <SimpleItem
                        key={nanoid()}
                        {...itemForm}
                        editorOptions={{
                          readOnly: itemList.FlagUseType === "TYPE1",
                          value: itemList.FlagActive === "1",
                        }}
                      />
                    );
                  } else {
                    return (
                      <SimpleItem
                        key={nanoid()}
                        {...itemForm}
                        editorOptions={{
                          readOnly: itemList.FlagUseType === "TYPE1",
                        }}
                      />
                    );
                  }
                })}

                <ButtonItem>
                  <ButtonOptions
                    visible={hasButtonPermission(
                      "BTN_ADMIN_INFOETICKET_DELETE"
                    )}
                    disabled={itemList.FlagUseType !== "TYPE3"}
                    onClick={
                      () => handleDelete(item.title, itemList)
                      // handleSave(itemList, item.title)
                    }
                    stylingMode={"text"}
                  >
                    <Icon name={"trash"} color={"#ff0000"} size={10} />
                  </ButtonOptions>
                </ButtonItem>
              </GroupItem>
            </Form>
          );
        }}
      ></List>
      <PermissionContainer permission={"BTN_ADMIN_INFOETICKET_CREATE"}>
        <Button
          type={"default"}
          stylingMode={"contained"}
          className="button-action"
          onClick={() => handleAdd()}
        >
          {t("Add")}
        </Button>
      </PermissionContainer>
    </>
  );
};

export default ListFormComponent;
