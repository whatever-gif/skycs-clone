import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useConfiguration, useNetworkNavigate } from "@/packages/hooks";
import { EticketLayout } from "@/packages/layouts/eticket-layout";
import { showErrorAtom } from "@/packages/store";
import { IconName } from "@/packages/ui/icons";
import PartHeaderInfo from "@/pages/eticket/eticket/Components/Info/Detail/part-header-info";
import {
  currentTabAtom,
  currentValueTabAtom,
  reloadingtabAtom,
} from "@/pages/eticket/eticket/Components/Info/Detail/store";
import "@/pages/eticket/eticket/Components/Info/Detail/style.scss";
import { useAuth } from "@packages/contexts/auth";
import { useQuery } from "@tanstack/react-query";
import { Tabs } from "devextreme-react";
import { Item as TabItem } from "devextreme-react/tabs";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "src/pages/admin-page/admin-page.scss";
import "./components/style.scss";
import { Tab_Attachments } from "./components/tab-attachments";
import { Tab_Detail } from "./components/tab-detail";

export const CustomerEticket_Popup = ({ TicketID }: any) => {
  const { t } = useI18n("Eticket_Detail");
  const { auth } = useAuth();
  const param = useParams();
  const api = useClientgateApi();
  const setCurrentTag = useSetAtom(currentTabAtom);
  const showError = useSetAtom(showErrorAtom);
  const config = useConfiguration();
  const setCurrentValueTab = useSetAtom(currentValueTabAtom);
  const setReloadingtab = useSetAtom(reloadingtabAtom);
  const navigate = useNetworkNavigate();
  //const { auth: { currentUser } } = useAuth();
  // const hub = useHub("global");
  // useEffect(() => {
  //   hub.onReceiveMessage("dungvatest", (c) => {
  //     // alert("dungvatest");
  //     console.log("dungvatest ", c);
  //   });
  // });

  const { data: dataTicket, isLoading } = useQuery({
    queryKey: ["ET_Ticket_GetByTicketID", TicketID],
    queryFn: async () => {
      if (TicketID) {
        const payload = {
          TicketID: TicketID ?? "",
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

  const handleNavigate = () => {
    // eticket/:TicketID
    navigate(`/eticket/edit/${dataTicket.Lst_ET_Ticket[0].TicketID}`);
  };

  console.log("dataTicket", dataTicket);

  const { data: dataListMedia, isLoading: isLoadingListMedia } = useQuery({
    queryKey: ["MstSubmissionForm/Search"],
    queryFn: async () => {
      if (TicketID) {
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

  const [currentTab, setCurrentTab] = useState(0);

  const onItemClick = (e: any) => {
    setCurrentTab(e.itemIndex);
  };

  // if (isLoading || isLoadingListMedia || isLoadingDynamicField) {
  //   return <LoadPanel position={{ of: "#root" }} />;
  // }

  const handleBackToManager = () => {
    navigate("/eticket/eticket_manager");
  };

  const handleResponse = () => {
    const messList = dataTicket.Lst_ET_TicketMessage;
    if (Array.isArray(messList)) {
      if (messList.length) {
        const item = messList[0];
        const itemFind = messList.find((item) => item?.ConvMessageType !== "9");
        let flag: IconName | "eventlog" = "remark";
        let flagIncoming = "";
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
              console.log("itemFind ", itemFind);
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

  return (
    <EticketLayout className={"eticket eticket-detail"}>
      <EticketLayout.Slot name={"Header"}></EticketLayout.Slot>
      <EticketLayout.Slot name={"Content"}>
        {!dataTicket ? (
          <></>
        ) : (
          <div className={"w-full detail"}>
            <PartHeaderInfo data={dataTicket} />
            <div className="separator"></div>
            <div
              className={
                "w-full flex flex-col pl-4 pt-0 sep-bottom-1 tab-ctn-1"
              }
            >
              <Tabs
                // width={400}
                onItemClick={onItemClick}
                selectedIndex={currentTab}
              >
                <TabItem text={t("eTicket Detail")}></TabItem>
                {/* <TabItem text={t("WorkFlow")}></TabItem> */}
                <TabItem text={t("Attachments")}></TabItem>
              </Tabs>
            </div>
            <div className={"w-full flex flex-col"}>
              {currentTab == 0 ? (
                <Tab_Detail
                  data={dataTicket}
                  listMedia={dataListMedia}
                  dataDynamicField={dataDynamicField}
                />
              ) : (
                <Tab_Attachments data={dataTicket} />
              )}
            </div>
          </div>
        )}
      </EticketLayout.Slot>
    </EticketLayout>
  );
};
export default CustomerEticket_Popup;
