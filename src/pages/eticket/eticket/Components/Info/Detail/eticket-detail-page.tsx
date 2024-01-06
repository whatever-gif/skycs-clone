import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { usePermissions } from "@/packages/contexts/permission";
import { useNetworkNavigate } from "@/packages/hooks";
import { EticketLayout } from "@/packages/layouts/eticket-layout";
import { showErrorAtom } from "@/packages/store";
import { Icon, IconName } from "@/packages/ui/icons";
import { useAuth } from "@packages/contexts/auth";
import { useQuery } from "@tanstack/react-query";
import { Button, LoadPanel, Tabs } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { Item as TabItem } from "devextreme-react/tabs";
import { confirm } from "devextreme/ui/dialog";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "src/pages/admin-page/admin-page.scss";
import "../../../../eticket.scss";
import In_Charge_Of_Tranfer from "../../popup/In_Charge_Of_Tranfer";
import TransformCustomer from "../../popup/TransformCustomer";
import {
  dataRowAtom,
  popupCustomerVisibleAtom,
  popupSplitVisibleAtom,
  popupVisibleAtom,
} from "../../popup/store";
import Eticket_Split from "./../../../Components/popup/Eticket_Split";
import PartHeaderInfo from "./part-header-info";
import { currentTabAtom, currentValueTabAtom, reloadingtabAtom } from "./store";
import { Tab_Attachments } from "./tab-attachments";
import { Tab_Detail } from "./tab-detail";
export const EticketDetailPage = () => {
  const { t } = useI18n("Eticket_Detail");
  const { auth } = useAuth();
  const param = useParams();
  const api: any = useClientgateApi();
  const setCurrentTag = useSetAtom(currentTabAtom);
  const showError = useSetAtom(showErrorAtom);
  const setCurrentValueTab = useSetAtom(currentValueTabAtom);
  const setReloadingtab = useSetAtom(reloadingtabAtom);
  const navigate = useNetworkNavigate();
  const [currentCode, setCurrentCode] = useState(<></>);
  const { hasMenuPermission, hasButtonPermission } = usePermissions();
  const {
    auth: { orgData },
  } = useAuth();
  // const setPopupMergeVisible = useSetAtom(popupMergeVisibleAtom);
  const setPopupSplitVisible = useSetAtom(popupSplitVisibleAtom);
  const setPopupCustomerVisible = useSetAtom(popupCustomerVisibleAtom);
  const setPopupVisible = useSetAtom(popupVisibleAtom);
  const setDataRow = useSetAtom(dataRowAtom);
  const {
    data: dataTicket,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ET_Ticket_GetByTicketID", param?.TicketID],
    queryFn: async () => {
      if (param?.TicketID) {
        const payload = {
          TicketID: param?.TicketID ?? "",
          OrgID: auth.orgData?.Id ?? "",
        };
        const response = await api.ET_Ticket_GetByTicketID(payload);
        if (response.isSuccess) {
          if (response.Data !== undefined && response.Data !== null) {
            const objETicket =
              response.Data.Lst_ET_Ticket.lenght > 0
                ? response.Data.Lst_ET_Ticket[0]
                : null;
            if (objETicket !== undefined && objETicket !== null) {
              // titleETicket = `${objETicket.TicketName} - ${objETicket.TicketID}`;
            }
          }
          setDataRow(response.Data?.Lst_ET_Ticket);
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
          return {
            Lst_ET_Ticket: [{}],
            Lst_ET_TicketAttachFile: [{}],
            Lst_ET_TicketCustomer: [{}],
            Lst_ET_TicketFollower: [{}],
            Lst_ET_TicketMessage: [{}],
          };
        }
      } else {
        return {
          Lst_ET_Ticket: [{}],
          Lst_ET_TicketAttachFile: [{}],
          Lst_ET_TicketCustomer: [{}],
          Lst_ET_TicketFollower: [{}],
          Lst_ET_TicketMessage: [{}],
        };
      }
    },
  });

  const {
    data: dataChanel,
    isLoading: isLoadingDataChanel,
    refetch: refetchChanel,
  } = useQuery(["dataChanel"], () => api.Mst_Channel_GetByOrgID(orgData?.Id));

  useEffect(() => {
    if (isLoadingDataChanel) {
    } else {
      const result = dataChanel?.Data;
      if (result) {
        const listZalo = result.Lst_Mst_ChannelZalo;
        if (listZalo.length > 0) {
          const zaloOAID = listZalo[0];
          if (zaloOAID.moa_OAID) {
          } else {
            toast.error(
              t(
                "The feature wasn't config yet! Please contact to manager's support."
              )
            );
            setCurrentTag(3);
          }
        }
      } else {
        toast.error(
          t(
            "The feature wasn't config yet! Please contact to manager's support."
          )
        );
      }
    }
  }, [isLoadingDataChanel]);

  const handleNavigate = () => {
    navigate(`/eticket/edit/${dataTicket.Lst_ET_Ticket[0].TicketID}`);
  };

  const { data: dataListMedia, isLoading: isLoadingListMedia } = useQuery({
    queryKey: ["Mst_SubmissionForm_Search"],
    queryFn: async () => {
      if (param?.TicketID) {
        const response = await api.Mst_SubmissionForm_Search({
          Ft_PageSize: 1000,
          Ft_PageIndex: 0,
          FlagActive: 1,
        });
        if (response.isSuccess) {
          return response.DataList;
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
      }
    },
  });

  const { data: dataDynamicField, isLoading: isLoadingDynamicField } = useQuery(
    {
      queryFn: async () => {
        const response = await api.Mst_TicketColumnConfig_GetAllActive();
        if (response.isSuccess) {
          const listData = response.Data.Lst_Mst_TicketColumnConfig;
          if (listData.length) {
            const filterMasterData = listData
              .filter((item: any) => {
                return (
                  item.TicketColCfgDataType === "MASTERDATASELECTMULTIPLE" ||
                  item.TicketColCfgDataType === "MASTERDATA"
                );
              })
              .map((item: any) => {
                return item.TicketColCfgCodeSys;
              });
            if (filterMasterData.length) {
              const responseListOption =
                await api.Mst_TicketColumnConfig_GetListOption(
                  filterMasterData,
                  auth.orgData?.Id ?? ""
                );
              if (responseListOption.isSuccess) {
                const responseData =
                  responseListOption?.Data.Lst_Mst_TicketColumnConfig;
                const customizeDataResponse = listData.map((item: any) => {
                  const itemCheck = responseData.find((itemOption: any) => {
                    return (
                      itemOption.TicketColCfgCodeSys ===
                      item.TicketColCfgCodeSys
                    );
                  });
                  if (itemCheck) {
                    return {
                      ...item,
                      dataSource: itemCheck.Lst_MD_OptionValue,
                    };
                  } else {
                    return item;
                  }
                });

                return customizeDataResponse;
              } else {
                showError({
                  message: responseListOption._strErrCode,
                  _strErrCode: responseListOption._strErrCode,
                  _strTId: responseListOption._strTId,
                  _strAppTId: responseListOption._strAppTId,
                  _objTTime: responseListOption._objTTime,
                  _strType: responseListOption._strType,
                  _dicDebug: responseListOption._dicDebug,
                  _dicExcs: responseListOption._dicExcs,
                });
              }
            } else {
              return response.Data.Lst_Mst_TicketColumnConfig;
            }
          }

          return response.Data.Lst_Mst_TicketColumnConfig;
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
      queryKey: ["Mst_TicketColumnConfig_GetAllActive", [param?.TicketID]],
    }
  );

  useEffect(() => {
    refetch();
    if (orgData?.Id == "4053894000") {
      setCurrentTag(3);
    }
  }, []);

  const [currentTab, setCurrentTab] = useState(0);

  const onItemClick = (e: any) => {
    setCurrentTab(e.itemIndex);
  };

  if (isLoading || isLoadingListMedia || isLoadingDynamicField) {
    return <LoadPanel position={{ of: "#root" }} />;
  }

  const handleBackToManager = () => {
    navigate("/eticket/eticket_manager");
  };

  const handleDelete = async (tv: string) => {
    const param = dataTicket.Lst_ET_Ticket.map((item: ETICKET_REPONSE) => {
      return {
        OrgID: item.OrgID,
        TicketID: item.TicketID,
      };
    });
    const respDelete: any = await api.ET_Ticket_DeleteMultiple(param);
    if (respDelete.isSuccess) {
      toast.success(t("Delete Success"));
      handleBackToManager();
    } else {
      showError({
        message: respDelete._strErrCode,
        _strErrCode: respDelete._strErrCode,
        _strTId: respDelete._strTId,
        _strAppTId: respDelete._strAppTId,
        _objTTime: respDelete._objTTime,
        _strType: respDelete._strType,
        _dicDebug: respDelete._dicDebug,
        _dicExcs: respDelete._dicExcs,
      });
    }
  };

  const handleResponse = () => {
    const messList = dataTicket.Lst_ET_TicketMessage;
    if (Array.isArray(messList)) {
      if (messList.length) {
        const item = messList[0];
        const itemFind = messList.find((item) => item?.ConvMessageType !== "9");
        let flag: IconName | "eventlog" = "remark";
        let flagIncoming: "out" | "in" | "" = "";
        if (item.IsIncoming === "0") {
          flagIncoming = "out";
        }
        if (item.IsIncoming === "1") {
          flagIncoming = "in";
        }
        let obj: any = {
          ActionType: "0",
          MessageSend: "",
          OrgID: item.OrgID,
          SubFormCode: "",
          SubTitleSend: "",
          TicketID: item.TicketID,
        };

        // const { flag } = firtChild;

        switch (itemFind?.ConvMessageType) {
          case "1": {
            if (itemFind.ChannelId === "0") {
              flag = "note";
            }
            break;
          }
          case "9": {
            if (itemFind.ChannelId === "0") {
              flag = "eventlog";
            }
            break;
          }
          case "3": {
            if (itemFind?.ChannelId === "1") {
              flag = "email" + flagIncoming;
            }
            break;
          }
          case "11": {
            if (itemFind?.ChannelId === "2") {
              if (itemFind.State === "6") {
                flag = "call";
              } else {
                flag = "callmissed" + flagIncoming;
              }
              // flag = "call";
            }
            break;
          }
          case "8":
          case "10": {
            if (itemFind?.ChannelId === "6") {
              flag = "zalo" + flagIncoming;
            }
            break;
          }

          default: {
            flag = "remark";
            break;
          }
        }

        switch (flag) {
          case "note":
            {
              // 4
              setCurrentValueTab(obj);
              setReloadingtab(nanoid());
              setCurrentTag(3);
            }
            break;
          case "zaloout":
          case "zaloin": {
            obj = {
              ...obj,
              ObjType: "",
              ObjCode: "",
            };

            if (
              itemFind.ChannelId === "6" &&
              itemFind.ConvMessageType === "8"
            ) {
              obj = {
                // zalo
                ...obj,
                ObjType: "ZaloUserId",
                ObjCode: itemFind.ObjectReceiveId,
              };
            }
            if (
              itemFind.ChannelId === "6" &&
              itemFind.ConvMessageType === "10"
            ) {
              obj = {
                // phone
                ...obj,
                ObjType: "PhoneNo",
                ObjCode: itemFind.ObjectReceiveId,
                ZNS: [],
              };
            }
            setCurrentValueTab(obj);
            setReloadingtab(nanoid());
            setCurrentTag(0);
            break;
          }
          case "emailout":
          case "emailin": {
            obj = {
              CtmEmail: itemFind.ObjectReceiveId,
              SubTitleSend: "",
              SubFormCode: "",
            };
            setCurrentValueTab(obj);
            setReloadingtab(nanoid());
            setCurrentTag(1);
            break;
          }
          case "remark": {
            setCurrentTag(4);

            break;
          }
          case "callin":
          case "callmissedin":
          case "callmissedout":
          case "callOut": {
            setReloadingtab(nanoid());
            setCurrentTag(2);
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  };

  const showPopup = (text: any) => {
    let result = confirm(
      `${t(`Are you sure to ${text} eticket ?`)}`,
      `${t(`${text} Ticket`)}`
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        console.log("dataTicket ", dataTicket.Lst_ET_Ticket);
        if (text === "delete") {
          handleDelete(dataTicket.Lst_ET_Ticket);
        } else {
          handleClose(dataTicket.Lst_ET_Ticket);
        }
      }
    });
  };

  const handleClose = async () => {
    const param = dataTicket.Lst_ET_Ticket.map((item: ETICKET_REPONSE) => {
      return {
        OrgID: item.OrgID,
        TicketID: item.TicketID,
      };
    });

    const resp = await api.ET_Ticket_CloseMultiple(param);
    if (resp.isSuccess) {
      toast.success(t("Close Success"));
      handleBackToManager();
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

  const handleSplit = () => {
    setPopupSplitVisible(true);
  };
  const handleUpdateAgentCode = () => {
    setPopupVisible(true);
  };
  const handleUpdateCustomer = () => {
    setPopupCustomerVisible(true);
  };
  const listButton = [
    {
      title: t("Response"),
      onClick: handleResponse,
      permission: "BTN_ETICKET_DTLETICKET_REPLY",
    },
    {
      title: t("UpdateAgentCode"),
      onClick: handleUpdateAgentCode,
      permission: "BTN_ETICKET_DTLETICKET_MORE_CHUYEN_PHU_TRACH",
    },
    {
      title: t("Delete"),
      onClick: () => showPopup("delete"),
      permission: "BTN_ETICKET_DTLETICKET_MORE_DELETE",
    },
    {
      title: t("Split"),
      onClick: handleSplit,
      permission: "BTN_ETICKET_DTLETICKET_MORE_DETACHED",
    },

    {
      title: t("UpdateCustomer"),
      onClick: handleUpdateCustomer,
      permission: "BTN_ETICKET_DTLETICKET_MORE_CHUYEN_KHACH_HANG",
    },
    {
      title: t("Update"),
      onClick: handleNavigate,
      permission: "BTN_ETICKET_DTLETICKET_EDIT",
    },

    // {
    //   title: t("Rating"),
    //   onClick: () => {},
    //   permission: "BTN_ETICKET_DTLETICKET_DANH_GIA",
    // },
    // {
    //   title: t("Workflow"),
    //   onClick: handleWorkflow,
    //   permission: "",
    // },
    {
      title: t("Closed"),
      onClick: handleClose,
      permission: "BTN_ETICKET_DTLETICKET_MORE_CLOSE",
    },
  ];

  const listButtonSplit = () => {
    const newList = listButton
      .splice(0, 2)
      .filter((item) => hasButtonPermission(item.permission));
    const otherList = listButton
      .splice(0)
      .filter((item) => hasButtonPermission(item.permission));
    return (
      <div className="flex align-items-center flex-wrap">
        {newList.map((item: any) => {
          return (
            <Button
              key={nanoid()}
              stylingMode={"contained"}
              type="default"
              text={item.title}
              className="mr-1"
              onClick={item.onClick}
            />
          );
        })}
        <DropDownButton
          showArrowIcon={false}
          keyExpr={"id"}
          className=""
          displayExpr={"text"}
          wrapItemText={false}
          dropDownOptions={{
            width: 200,
            wrapperAttr: {
              class: "",
            },
          }}
          icon="/images/icons/more.svg"
        >
          {otherList.map((itemValue: any) => {
            return (
              <DropDownButtonItem
                onClick={() => itemValue.onClick()}
                key={nanoid()}
                render={(item: any) => {
                  return (
                    <Button
                      width={200}
                      key={nanoid()}
                      stylingMode={"contained"}
                      type="default"
                      text={itemValue.title}
                      className="mr-1"
                    />
                  );
                }}
              />
            );
          })}
        </DropDownButton>
      </div>
    );
  };

  return (
    <EticketLayout className={"eticket eticket-detail"}>
      <EticketLayout.Slot name={"Header"}>
        {!dataTicket ? (
          <></>
        ) : (
          <div className={"w-full flex flex-col"}>
            <div className={"page-header w-full flex items-center p-2"}>
              <div className={"before mr-auto"}>
                <div className="breadcrumb breadcrumb-eticket-detail flex align-items-center">
                  <span
                    className="cursor-pointer"
                    onClick={handleBackToManager}
                  >
                    {t("Eticket Manager")}
                  </span>
                  <Icon name="right"></Icon>
                  <strong>{t("Eticket Detail")}</strong>
                </div>
              </div>
              <div className={"center flex flex-grow justify-end ml-auto"}>
                {listButtonSplit()}
              </div>
            </div>
          </div>
        )}
      </EticketLayout.Slot>
      <EticketLayout.Slot name={"Content"}>
        {currentCode}

        {!!dataTicket ? (
          <div className={"w-full detail"}>
            <PartHeaderInfo data={dataTicket} onReload={refetch} />
            <div className="separator"></div>
            <div
              className={
                "w-full flex flex-col pl-4 pt-0 sep-bottom-1 tab-ctn-1"
              }
            >
              <Tabs onItemClick={onItemClick} selectedIndex={currentTab}>
                <TabItem text={t("eTicket Detail")}></TabItem>
                <TabItem text={t("Attachments")}></TabItem>
              </Tabs>
            </div>
            <div className={"w-full flex flex-col"}>
              {currentTab == 0 ? (
                <Tab_Detail
                  data={dataTicket}
                  listMedia={dataListMedia}
                  dataDynamicField={dataDynamicField}
                  refetch={refetch}
                />
              ) : (
                <Tab_Attachments onReload={refetch} data={dataTicket} />
              )}
            </div>
            {/* split */}
            <Eticket_Split
              onCancel={() => {
                setPopupSplitVisible(false);
              }}
            />

            {/* Chuyên phụ trách */}
            <In_Charge_Of_Tranfer onCancel={() => setPopupVisible(false)} />
            {/* chuyển khách hàng */}
            <TransformCustomer
              onCancel={() => {
                setPopupCustomerVisible(false);
              }}
            />
          </div>
        ) : (
          <></>
        )}
      </EticketLayout.Slot>
    </EticketLayout>
  );
};
export default EticketDetailPage;
