import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { EticketLayout } from "@/packages/layouts/eticket-layout";
import { showErrorAtom } from "@/packages/store";
import PartHeaderInfo from "@/pages/eticket/eticket/Components/Info/Detail/part-header-info";
import { Tab_Attachments } from "@/pages/eticket/eticket/Components/Info/Detail/tab-attachments";
import { Tab_Detail } from "@/pages/eticket/eticket/Components/Info/Detail/tab-detail";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel } from "devextreme-react";
import Tabs, { Item as TabItem } from "devextreme-react/tabs";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import "src/pages/admin-page/admin-page.scss";
import "../../../../../../../../../eticket/eticket.scss";
import "../Eticket_Popup/style_1.scss";

const EticketPopup = ({ TicketID }: any) => {
  const { t } = useI18n("Eticket_Detail");
  const { auth } = useAuth();
  const api: any = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);

  const {
    data: dataTicket,
    isLoading,
    refetch,
  } = useQuery({
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

  const { data: dataListMedia, isLoading: isLoadingListMedia } = useQuery({
    queryKey: ["  "],
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
      queryKey: ["Mst_TicketColumnConfig_GetAllActive", [TicketID]],
    }
  );

  useEffect(() => {
    refetch();
  }, [TicketID]);

  const [currentTab, setCurrentTab] = useState(0);

  const onItemClick = (e: any) => {
    setCurrentTab(e.itemIndex);
  };

  if (isLoading || isLoadingListMedia || isLoadingDynamicField) {
    return <LoadPanel position={{ of: "#root" }} />;
  }

  return (
    <EticketLayout
      className={"eticket eticket-detail eticket-detail-popup w-full h-full"}
    >
      <EticketLayout.Slot name={"Header"}></EticketLayout.Slot>
      <EticketLayout.Slot name={"Content"}>
        <div className={"w-full detail"}>
          <PartHeaderInfo data={dataTicket} onReload={refetch} />
          <div className="separator"></div>
          <div
            className={"w-full flex flex-col pl-4 pt-0 sep-bottom-1 tab-ctn-1"}
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
              />
            ) : (
              <Tab_Attachments
                onReload={refetch}
                data={dataTicket}
                isDetail={true}
              />
            )}
          </div>
        </div>
      </EticketLayout.Slot>
    </EticketLayout>
  );
};

export default EticketPopup;
