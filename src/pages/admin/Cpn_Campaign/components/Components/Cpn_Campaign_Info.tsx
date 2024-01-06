import PermissionContainer from "@/components/PermissionContainer";
import { encodeFileType, revertEncodeFileType } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { convertDate } from "@/packages/common";
import { useAuth } from "@/packages/contexts/auth";
import { usePermissions } from "@/packages/contexts/permission";
import { useNetworkNavigate } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, LoadPanel } from "devextreme-react";
import DataGrid from "devextreme-react/data-grid";
import {
  GroupItem,
  Tab,
  TabPanelOptions,
  TabbedItem,
} from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import { currentInfo, listCampaignAtom } from "../store";
import Cpn_Campaign_Info_Common from "./Cpn_Campaign_Info_Common/Cpn_Campaign_Info_Common";
import Cpn_Campaign_List_Customer from "./Cpn_Campaign_List_Customer/Cpn_Campaign_List_Customer";
import "./style.scss";
interface tabInterface {
  title: string;
  component: ReactNode;
}

interface buttonItem {
  button: string;
  buttonComponent: ReactNode;
}

const Cpn_Campaign_Info = () => {
  const { hasButtonPermission } = usePermissions();
  const { t } = useI18n("Cpn_Campaign_Info");
  const param = useParams();
  const formRef: any = useRef(null);
  const currentItemData = useAtomValue(currentInfo);
  const setCurrentItemData = useSetAtom(currentInfo);
  const navigate = useNetworkNavigate();
  const setListCampaign = useSetAtom(listCampaignAtom);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const { auth } = useAuth();
  const commonRef = useRef<Form>(null);
  const dynamicRef = useRef<any>(null);
  const listCustomerRef = useRef<DataGrid>(null);

  const buttonRef = useRef<Button>(null);

  const tabs = [
    {
      title: t("Common Info"),
      component: (
        <Cpn_Campaign_Info_Common
          ref={commonRef}
          listCustomerRef={listCustomerRef}
        />
      ),
    },
    {
      title: t("List Customer"),
      component: (
        <Cpn_Campaign_List_Customer
          commonRef={commonRef}
          dynamicRef={dynamicRef}
          ref={listCustomerRef}
        />
      ),
    },
  ];

  const {
    data: dataGetByCode,
    isLoading: isLoadingGetByCode,
    refetch: refetchGetByCode,
  } = useQuery({
    queryKey: ["Cpn_Campaign_GetByCode", param?.CampaignCode],
    queryFn: async () => {
      if (param.CampaignCode) {
        const response = await api.Cpn_Campaign_GetByCode(
          param.CampaignCode,
          auth.orgData?.Id ?? ""
        );
        const item: any = response.Data?.Lst_Cpn_Campaign?.[0];
        const rate = item.CustomerRate;

        if (response.isSuccess) {
          const listAgent = response?.Data?.Lst_Cpn_CampaignAgent?.map(
            (item) => item.AgentCode ?? ""
          );
          const listUpload = response?.Data?.Lst_Cpn_CampaignAttachFile ?? [];
          const newUpdateLoading = listUpload.map((item) => {
            return {
              ...item,
              FileFullName: item.FileName,
              FileType: encodeFileType(item.FileType),
              FileUrlLocal: item.FilePath,
            };
          });
          setCurrentItemData({
            ...item,
            CampaignAgent: listAgent,
            uploadFiles: newUpdateLoading ?? [],
          });
          let customizeCampaignCustomer =
            response.Data?.Lst_Cpn_CampaignCustomer.map((item) => {
              if (item.JsonCustomerInfo && item.JsonCustomerInfo !== "") {
                return {
                  ...item,
                  QtyCall: `${item.QtyCall}/${rate}`,
                  ...JSON.parse(item.JsonCustomerInfo),
                };
              }

              return {
                ...item,
              };
            }) ?? [];
          setListCampaign(customizeCampaignCustomer);
          return response.Data;
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
      } else {
        return {};
      }
    },
  });

  useEffect(() => {
    refetchGetByCode();
  }, []);

  const handleCancel = useCallback((): void => {
    navigate("/campaign/Cpn_CampaignPage");
  }, []);

  const onDelete = async () => {
    const obj = {
      Cpn_Campaign: {
        CampaignCode: currentItemData.CampaignCode,
        OrgID: auth.orgData?.Id,
      },
      Lst_Cpn_CampaignAttachFile: [],
      Lst_Cpn_CampaignCustomer: [],
      Lst_Cpn_CampaignAgent: [],
    };

    const response = await api.Cpn_Campaign_Delete(obj);
    if (response.isSuccess) {
      handleCancel();
      navigate("/campaign/Cpn_CampaignPage");
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

  const executeState = useCallback(
    async (url: string) => {
      const obj = {
        OrgID: auth.orgData?.Id ?? "",
        CampaignCode: currentItemData?.CampaignCode,
      };
      const response = await api.Cpn_Campaign_ExecuteState(obj, url);
      if (response.isSuccess) {
        toast.success(t(`${url} successfully`));
        refetchGetByCode();
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
    [currentItemData]
  );

  const onSave = async () => {
    buttonRef.current?.instance.option("disabled", true);
    const { isValid } = formRef.current.instance.validate();
    let dynamicFields: any[] = [];
    if (dynamicRef.current) {
      if (dynamicRef.current.dynamicFields) {
        dynamicFields = dynamicRef.current.dynamicFields.dynamicField.reduce(
          (acc: any[], item: any) => {
            return [...acc, item.CampaignColCfgCodeSys];
          },
          []
        );
      }
    }
    if (!isValid) {
      toast.error(t("Please Input field required"));
    } else {
      const listCap =
        (listCustomerRef?.current?.props.dataSource as any[]) ?? [];
      if (listCap.length) {
        const obj: any = {
          Cpn_Campaign: {
            OrgID: auth.orgData?.Id,
            NetworkID: auth.networkId,
            ...currentItemData,
            DTimeStart: convertDate(currentItemData.DTimeStart),
            DTimeEnd: convertDate(currentItemData.DTimeEnd),
            CallRate: 1,
          },
          Lst_Cpn_CampaignAttachFile: currentItemData.uploadFiles.map(
            (item: any, index: any) => {
              return {
                Idx: index,
                FileName: item.FileFullName ?? "",
                FilePath: item.FileUrlLocal ?? "",
                FileType: revertEncodeFileType(item.FileType),
                FileSize: item.FileSize ?? 0,
              };
            }
          ),
          Lst_Cpn_CampaignAgent: [
            ...currentItemData.CampaignAgent.map((item: any) => {
              return {
                AgentCode: item,
              };
            }),
          ],
          Lst_Cpn_CampaignCustomer: [],
        };
        delete obj.Cpn_Campaign.uploadFiles;
        listCustomerRef?.current?.instance.saveEditData();
        const listCustomers =
          (listCustomerRef?.current?.instance.option("dataSource") as any[]) ??
          [];
        if (listCap.length === 0) {
          const response = await api.Cpn_Campaign_Update(
            obj,
            param?.CampaignCode
          );
          if (response.isSuccess) {
            toast.success(t("Campaign successfully created"));
            navigate("/campaign/Cpn_CampaignPage");
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
        } else {
          const checkAgent = listCap.every((item) => item.AgentCode);
          if (checkAgent) {
            const Lst_Cpn_CampaignCustomer = listCap.map((item, index) => {
              const valueJSON = dynamicFields.reduce((acc, itemReduce) => {
                return {
                  ...acc,
                  [`${itemReduce}`]:
                    typeof item[`${itemReduce}`] === "boolean"
                      ? item[`${itemReduce}`]
                        ? "1"
                        : "0"
                      : item[`${itemReduce}`] ?? "",
                };
              }, {});

              return {
                CustomerCodeSys: item.CustomerCodeSys,
                Idx: index,
                AgentCode: item.AgentCode,
                CustomerName: item.CustomerName,
                CustomerPhoneNo1: item.CustomerPhoneNo1,
                CustomerPhoneNo2: item.CustomerPhoneNo2,
                CustomerEmail: item.CustomerEmail,
                CustomerCompany: item.CustomerCompany,
                JsonCustomerInfo: JSON.stringify(valueJSON),
              };
            });
            obj.Lst_Cpn_CampaignCustomer = Lst_Cpn_CampaignCustomer;
            const response = await api.Cpn_Campaign_Update(
              obj,
              param?.CampaignCode
            );
            if (response.isSuccess) {
              toast.success(t("Campaign successfully created"));
              navigate("/campaign/Cpn_CampaignPage");
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
          } else {
            toast.error(t("Please Distribution Agent To Customer !"));
          }
        }
      } else {
        toast.error(t("Please Select Customer !"));
      }
    }
    buttonRef.current?.instance.option("disabled", false);
  };

  const listButton: buttonItem[] = [
    {
      button: "ADD",
      buttonComponent: (
        <Button
          ref={buttonRef}
          visible={hasButtonPermission(
            "BTN_CAMPAIGN_CAMPAIGNMANAGER_CREATE_SAVE"
          )}
          className="mr-1"
          key={nanoid()}
          type={"default"}
          onClick={onSave}
          stylingMode={"contained"}
          text={t("ADD")}
        />
      ),
    },
    {
      button: "EDIT",
      buttonComponent: (
        <Button
          visible={param?.flag === "detail"}
          className="mr-1"
          key={nanoid()}
          type={"default"}
          onClick={() => {
            navigate(
              `/campaign/Cpn_CampaignPage/Cpn_Campaign_Info/update/${param.CampaignCode}`
            );
          }}
          stylingMode={"contained"}
          text={t("EDIT")}
        />
      ),
    },
    {
      button: "UPDATE",
      buttonComponent: (
        <Button
          visible={hasButtonPermission(
            "BTN_CAMPAIGN_CAMPAIGNMANAGER_UPDATE_SAVE"
          )}
          className="mr-1"
          key={nanoid()}
          type={"default"}
          stylingMode={"contained"}
          text={t("UPDATE")}
          onClick={onSave}
        />
      ),
    },
    {
      button: "DELETE",
      buttonComponent: (
        <Button
          className="mr-1"
          visible={hasButtonPermission(
            "BTN_CAMPAIGN_CAMPAIGNMANAGER_DETAIL_DELETE"
          )}
          key={nanoid()}
          type={"default"}
          stylingMode={"contained"}
          onClick={onDelete}
          text={t("DELETE")}
        />
      ),
    },
    {
      button: "APPROVE", // duyệt
      buttonComponent: (
        <Button
          className="mr-1"
          key={nanoid()}
          visible={hasButtonPermission("BTN_CAMPAIGN_CAMPAIGNMANAGER_APPROVE")}
          type={"default"}
          onClick={() => executeState("Approve")}
          stylingMode={"contained"}
          text={t("APPROVE")}
        />
      ),
    },
    {
      button: "STARTED", //Bắt đầu
      buttonComponent: (
        <Button
          className="mr-1"
          key={nanoid()}
          visible={hasButtonPermission("BTN_CAMPAIGN_CAMPAIGNMANAGER_START")}
          type={"default"}
          onClick={() => executeState("Start")}
          stylingMode={"contained"}
          text={t("STARTED")}
        />
      ),
    },
    {
      button: "PAUSED", // Tạm dừng
      buttonComponent: (
        <Button
          className="mr-1"
          type={"default"}
          visible={hasButtonPermission("BTN_CAMPAIGN_CAMPAIGNMANAGER_PAUSE")}
          key={nanoid()}
          onClick={() => executeState("Pause")}
          stylingMode={"contained"}
          text={t("PAUSED")}
        />
      ),
    },
    {
      button: "CONTINUED", // Tiếp tục
      buttonComponent: (
        <Button
          className="mr-1"
          key={nanoid()}
          visible={hasButtonPermission("BTN_CAMPAIGN_CAMPAIGNMANAGER_CONTINUE")}
          type={"default"}
          stylingMode={"contained"}
          onClick={() => executeState("Continue")}
          text={t("CONTINUED")}
        />
      ),
    },
    {
      button: "FINISH", // kết thúc
      buttonComponent: (
        <Button
          className="mr-1"
          visible={hasButtonPermission("BTN_CAMPAIGN_CAMPAIGNMANAGER_FINISH")}
          key={nanoid()}
          type={"default"}
          onClick={() => executeState("Finish")}
          stylingMode={"contained"}
          text={t("FINISH")}
        />
      ),
    },
  ];

  const listButtonRender = useMemo(() => {
    if (param?.flag === "update") {
      return match(currentItemData.CampaignStatus)
        .with("PENDING", () => {
          return listButton.filter((item: buttonItem) => {
            return item.button === "UPDATE";
          });
        })
        .otherwise(() => {
          return [];
        });
    } else {
      if (currentItemData.CampaignStatus) {
        return match(currentItemData.CampaignStatus)
          .with("PENDING", () => {
            return listButton.filter((item: buttonItem) => {
              return (
                item.button === "DELETE" ||
                item.button === "APPROVE" ||
                item.button === "EDIT"
              );
            });
          })
          .with("APPROVE", () => {
            return listButton.filter((item: buttonItem) => {
              return item.button === "STARTED" || item.button === "FINISH";
            });
          })
          .with("STARTED", () => {
            const result = listButton.filter((item: buttonItem) => {
              return item.button === "PAUSED" || item.button === "FINISH";
            });

            // console.log("result ", result);

            return result;
          })
          .with("PAUSED", () => {
            return listButton.filter((item: buttonItem) => {
              return item.button === "CONTINUED" || item.button === "FINISH";
            });
          })
          .with("FINISH", () => {
            return [];
          })
          .otherwise(() => {
            return [];
          });
      } else {
        return listButton.filter((item: buttonItem) => {
          return item.button === "ADD";
        });
      }
    }
  }, [currentItemData, param?.flag]);

  const navigateBack = () => {
    navigate("/campaign/Cpn_CampaignPage");
  };

  // const listCampaignAgentValue = useAtomValue(listCampaignAgentAtom);
  return (
    <AdminContentLayout className={"Cpn_Campaign_Info"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex items-center w-full justify-between">
          <div className="breakcrumb">
            <p
              className="hover:underline cursor-pointer hover:text-[#00703c]"
              onClick={navigateBack}
            >
              {t("Cpn_CampaignPage")}
            </p>
            <p className="mr-2 ml-2">{`>`}</p>
            <p>{t(`${param?.flag ? param.flag : "add"} campaign`)}</p>
          </div>
          <div className="list-button">
            {listButtonRender.map((item: any) => {
              return item.buttonComponent;
            })}
            <PermissionContainer
              permission={
                param.flag == "detail"
                  ? "BTN_CAMPAIGN_CAMPAIGNMANAGER_DETAIL_CANCEL"
                  : param.flag == "update"
                  ? "BTN_CAMPAIGN_CAMPAIGNMANAGER_UPDATE_CANCEL"
                  : "BTN_CAMPAIGN_CAMPAIGNMANAGER_CREATE_CANCEL"
              }
            >
              <Button
                className="mr-1"
                type={"default"}
                stylingMode={"contained"}
                onClick={handleCancel}
                text={t("Cancel")}
              />
            </PermissionContainer>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        {!dataGetByCode && <LoadPanel />}
        {!!dataGetByCode && (
          <Form validationGroup="campaignForm" ref={formRef}>
            <GroupItem>
              <TabbedItem>
                <TabPanelOptions
                  deferRendering={false}
                  onSelectionChanged={(e: any) => {
                    // listCustomerRef.current?.instance.saveEditData();
                    // listCustomerRef.current?.instance.refresh();
                  }}
                />
                {tabs.map((item: tabInterface) => {
                  return (
                    <Tab key={item.title} title={item.title}>
                      {item.component}
                    </Tab>
                  );
                })}
              </TabbedItem>
            </GroupItem>
          </Form>
        )}
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Cpn_Campaign_Info;
