import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { usePermissions } from "@/packages/contexts/permission";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { Icon } from "@/packages/ui/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Accordion, Button, Form, List, LoadPanel } from "devextreme-react";
import {
  ButtonItem,
  ButtonOptions,
  GroupItem,
  IItemProps,
  SimpleItem,
} from "devextreme-react/form";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import "./../../../eticket.scss";
import "./style.scss";
const Mst_TicketEstablishInfo_Save = () => {
  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const { auth } = useAuth();
  const formRef = useRef<any>(null);
  const { t } = useI18n("Mst_TicketEstablishInfo_Save");
  const [valueApi, setValueApi] = useState<any[]>([]);
  const { hasButtonPermission } = usePermissions();

  const [currentOpen, setCurrentOpen] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Mst_TicketEstablishInfo_Save"],
    queryFn: async () => {
      const response = await api.Mst_TicketEstablishInfoApi_GetAllInfo();
      if (response.isSuccess) {
        const newReponse = Object.keys(response.Data).map((item) => {
          return {
            title: item,
            list: response.Data[item],
          };
        });
        console.log("newReponse ", newReponse);

        setValueApi(newReponse);
        return newReponse ?? [];
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

  useEffect(() => {
    refetch();
    return () => {};
  }, []);

  const defaultFormData: IItemProps[] = [
    {
      dataField: "AgentTicket",
      caption: "AgentTicket",
      editorType: "dxTextBox",
    },
    {
      dataField: "CustomerTicket",
      caption: "CustomerTicket",
      editorType: "dxTextBox",
    },
    {
      dataField: "FlagActive",
      caption: "FlagActive",
      editorType: "dxSwitch",
      editorOptions: {
        defaultValue: false,
      },
    },
  ];

  const getKey = useCallback((text: string) => {
    return match(text)
      .with("Lst_Mst_TicketStatus", () => "TicketStatus")
      .with("Lst_Mst_TicketPriority", () => "TicketPriority")
      .with("Lst_Mst_TicketType", () => "TicketType")
      .with("Lst_Mst_TicketSource", () => "TicketSource")
      .with("Lst_Mst_ReceptionChannel", () => "ReceptionChannel")
      .with("Lst_Mst_ContactChannel", () => "ContactChannel")
      .with("Lst_Mst_TicketCustomType", () => "TicketCustomType")
      .otherwise(() => "");
  }, []);

  const CallSave = useCallback(async (param: any) => {
    const response = await api.Mst_TicketEstablishInfoApi_Save(param);
    if (response.isSuccess) {
      queryClient.invalidateQueries(["Mst_TicketCustomType_GetAllActive"]);
      toast.success("Save successfully");
      await refetch();
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
  }, []);

  const handleDelete = async (title: any, itemList: any) => {
    const key = getKey(title);
    if (itemList?.idCreate) {
      const newValue = valueApi?.map((itemMap) => {
        if (itemMap.title === title) {
          return {
            ...itemMap,
            list: itemMap.list.filter((itemFilter: any) => {
              return itemFilter.idCreate !== itemList.idCreate;
            }),
          };
        } else {
          return itemMap;
        }
      });
      // console.log("newValue ", newValue);
      setValueApi(newValue);
      // getVisible(title);
    } else {
      const newValue = valueApi?.map((itemMap) => {
        if (itemMap.title === title) {
          return {
            ...itemMap,
            list: itemMap.list.filter((itemFilter: any) => {
              return itemFilter[key] !== itemList[key];
            }),
          };
        } else {
          return itemMap;
        }
      });
      // console.log("newValue ", newValue);
      setValueApi(newValue);
      // getVisible(title);
    }
  };

  const handleAdd = async (group: string) => {
    const defaultValue = {
      OrgID: auth.orgData?.Id,
      TicketSource: "", // hệ thống tự nhập
      NetworkID: auth.networkId,
      FlagUseType: "TYPE3",
      FlagActive: "1",
      Remark: "",
      flagRemoveWhenEdit: true,
      LogLUDTimeUTC: "2023-06-22 11:41:40", // ??
      LogLUBy: "0317844394@INOS.VN", // ??
    };
    const newValue = valueApi.map((itemValue: any) => {
      if (itemValue.title === group) {
        let obj = {};
        obj = match(itemValue.title)
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
        // console.log("newItem ", newItem);
        return {
          ...itemValue,
          list: [...itemValue.list, newItem],
        };
      } else {
        return itemValue;
      }
    });

    setValueApi(newValue);
    // getVisible(group);
  };

  const queryClient = useQueryClient();
  const handleUpdateAll = async () => {
    const { isValid } = formRef.current?.instance.validate();
    if (isValid) {
      const param = valueApi
        .map((item) => {
          return {
            ...item,
            list: item.list.map((itemList: any) => {
              return {
                ...itemList,
                FlagActive:
                  itemList.FlagActive && itemList.FlagActive !== "0"
                    ? "1"
                    : "0",
              };
            }),
          };
        })
        .reduce((acc: any, item: any) => {
          return {
            ...acc,
            [item.title]: item.list,
          };
        }, {});
      await CallSave(param);
    }
  };

  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="flex justify-end flex-1">
          <PermissionContainer permission={"BTN_ADMIN_INFOETICKET_SAVE"}>
            <Button
              type={"default"}
              className="button-action justify-self-right"
              stylingMode={"contained"}
              onClick={() => handleUpdateAll()}
            >
              {t("Save")}
            </Button>
          </PermissionContainer>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div className="form-builder">
          <LoadPanel
            container={".dx-viewport"}
            shadingColor="rgba(0,0,0,0.4)"
            position={"center"}
            visible={isLoading}
            showIndicator={true}
            showPane={true}
          />
          <Form
            ref={formRef}
            className="form-ticket-info"
            validationGroup="Mst_TicketEstablishInfo_Form"
          >
            <SimpleItem
              render={() => {
                return (
                  <Accordion
                    className="eticket-list"
                    collapsible={true}
                    multiple={true}
                    dataSource={valueApi}
                    itemTitleRender={(item) => t(item.title)}
                    itemRender={(item) => {
                      let formList: any[] = [];
                      formList = match(item.title)
                        .with("Lst_Mst_TicketStatus", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentTicketStatusName",
                                caption: "AgentTicketStatusName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerTicketStatusName",
                                caption: "CustomerTicketStatusName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_TicketPriority", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentTicketPriorityName",
                                caption: "AgentTicketPriorityName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerTicketPriorityName",
                                caption: "CustomerTicketPriorityName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_TicketType", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentTicketTypeName",
                                caption: "AgentTicketTypeName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerTicketTypeName",
                                caption: "CustomerTicketTypeName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_TicketSource", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentTicketSourceName",
                                caption: "AgentTicketSourceName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerTicketSourceName",
                                caption: "CustomerTicketSourceName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_TicketCustomType", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentTicketCustomTypeName",
                                caption: "AgentTicketCustomTypeName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerTicketCustomTypeName",
                                caption: "CustomerTicketCustomTypeName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_ReceptionChannel", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentReceptionChannelName",
                                caption: "AgentReceptionChannelName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerReceptionChannelName",
                                caption: "CustomerReceptionChannelName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .with("Lst_Mst_ContactChannel", () => {
                          return defaultFormData.map((item) => {
                            if (item.dataField === "AgentTicket") {
                              return {
                                dataField: "AgentContactChannelName",
                                caption: "AgentContactChannelName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            if (item.dataField === "CustomerTicket") {
                              return {
                                dataField: "CustomerContactChannelName",
                                caption: "CustomerContactChannelName",
                                editorType: "dxTextBox",
                                validationRules: [requiredType],
                              };
                            }
                            return item;
                          });
                        })
                        .otherwise(() => {
                          return defaultFormData;
                        });
                      return (
                        <>
                          <List
                            dataSource={item.list}
                            keyExpr="ColCodeSys"
                            allowItemDeleting={false}
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
                                    {formList.map(
                                      (itemForm: any, index: number) => {
                                        if (
                                          itemList.FlagActive === "0" &&
                                          itemForm.dataField === "FlagActive"
                                        ) {
                                          return (
                                            <SimpleItem
                                              key={nanoid()}
                                              {...itemForm}
                                              editorOptions={{
                                                readOnly:
                                                  itemList.FlagUseType ===
                                                  "TYPE1",
                                                value:
                                                  itemList.FlagActive === "1",
                                              }}
                                            />
                                          );
                                        } else {
                                          return (
                                            <SimpleItem
                                              key={nanoid()}
                                              {...itemForm}
                                              editorOptions={{
                                                readOnly:
                                                  itemList.FlagUseType ===
                                                  "TYPE1",
                                              }}
                                            />
                                          );
                                        }
                                      }
                                    )}

                                    <ButtonItem>
                                      <ButtonOptions
                                        visible={hasButtonPermission(
                                          "BTN_ADMIN_INFOETICKET_DELETE"
                                        )}
                                        disabled={
                                          itemList.FlagUseType !== "TYPE3"
                                        }
                                        onClick={
                                          () =>
                                            handleDelete(item.title, itemList)
                                          // handleSave(itemList, item.title)
                                        }
                                        stylingMode={"text"}
                                      >
                                        <Icon
                                          name={"trash"}
                                          color={"#ff0000"}
                                          size={10}
                                        />
                                      </ButtonOptions>
                                    </ButtonItem>
                                  </GroupItem>
                                </Form>
                              );
                            }}
                          ></List>
                          <PermissionContainer
                            permission={"BTN_ADMIN_INFOETICKET_CREATE"}
                          >
                            <Button
                              type={"default"}
                              stylingMode={"contained"}
                              className="button-action"
                              onClick={() => handleAdd(item.title)}
                            >
                              {t("Add")}
                            </Button>
                          </PermissionContainer>
                        </>
                      );
                    }}
                    onSelectedItemKeysChange={(e: any) => {
                      setCurrentOpen(e);
                    }}
                    selectedItemKeys={currentOpen}
                    keyExpr="title"
                  ></Accordion>
                );
              }}
            ></SimpleItem>
          </Form>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Mst_TicketEstablishInfo_Save;
