import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { BaseCardView } from "@/packages/ui/card-view/card-view";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { useI18n } from "@/i18n/useI18n";
import { showErrorAtom } from "@/packages/store";
import { Popup, ScrollView } from "devextreme-react";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import { match } from "ts-pattern";
import CustomerCampaign_Popup from "./CustomerCampagin_Popup";

const Tab_CustomerCampaign = () => {
  let gridRef: any = useRef();

  const [open, setOpen] = useState<boolean>(false);
  const [campaignCode, setCampaignCode] = useState<string>("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const { t } = useI18n("Tab_CustomerCampaign");

  const api = useClientgateApi();

  const showError = useSetAtom(showErrorAtom);

  const { CustomerCodeSys }: any = useParams();

  const { data, isLoading } = useQuery(
    ["listCustomerCampaign", CustomerCodeSys],
    async () => {
      const resp: any = await api.Mst_Customer_GetCampaignByCustomerCodeSys(
        CustomerCodeSys
      );
      if (resp?.isSuccess) {
        return resp;
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
  );

  const columns: any = [
    // {
    //   dataField: "CampaignCode",
    //   caption: t("CampaignCode"),
    //   cellRender: ({ data }: any) => {
    //     return (
    //       <span
    //         className="text-green-600 cursor-pointer"
    //         onClick={() => {
    //           handleOpen();
    //           setCampaignCode(data?.CampaignCode);
    //         }}
    //       >
    //         {data?.CampaignCode}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   dataField: "CampaignName",
    //   caption: t("CampaignName"),
    // },
    // {
    //   dataField: "CampaignTypeName",
    //   caption: t("CampaignTypeName"),
    // },
    // {
    //   dataField: "CampaignStatus",
    //   caption: t("CampaignStatus"),
    // },
    // {
    //   dataField: "CampaignCustomerCallStatus",
    //   caption: t("CampaignCustomerCallStatus"),
    // },
    // {
    //   dataField: "CallOutDTimeUTC",
    //   caption: t("CallOutDTimeUTC"),
    // },
  ];

  const formSettings = {};

  const handleSelectionChanged = () => {};

  const handleSavingRow = () => {};

  const handleEditorPreparing = () => {};

  const handleEditRowChanges = () => {};

  const handleDeleteRows = () => {};

  const handleOnEditRow = () => {};

  const checkCampaignStatus = (status: any) => {
    return (
      status == "APPROVE" ||
      status == "STARTED" ||
      status == "PAUSED" ||
      status == "CONTINUED"
    );
  };

  const customCard = (item: any) => {
    return (
      <div
        className="px-[10px] pt-[5px] detail-customer-tab-content-item"
        key={nanoid()}
      >
        <div
          className={`${
            checkCampaignStatus(item?.CampaignStatus)
              ? "bg-[#FFE4E4]"
              : "bg-white"
          } mb-1 px-[35px] py-[20px] grid grid-cols-3 gap-3 relative justify-between rounded-md shadow-sm hover:shadow-md ease-linear duration-100`}
        >
          <div className="flex flex-col gap-2">
            <div
              className="font-bold text-[16px] cursor-pointer hover:underline w-[400px] truncate"
              onClick={() => {
                setCampaignCode(item?.CampaignCode);
                handleOpen();
              }}
            >
              {item?.CampaignName} ({item?.CampaignCode})
            </div>
            <div>
              Loại chiến dịch: <strong>{item?.CampaignTypeName}</strong>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex align-items-center">
              Trạng thái chiến dịch:{" "}
              <div className="status-container pl-1">
                <span
                  className={`bg-sky-500 p-[5px] text-white rounded-[5px] status ${
                    item?.CampaignStatus
                      ? item?.CampaignStatus.toLowerCase()
                      : ""
                  }`}
                >
                  {item?.CampaignStatus}
                </span>
              </div>
            </div>
            <div>
              Thời gian tạo:
              <strong className="ml-1">{item?.cc_CreateDTimeUTC}</strong>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div>
              Agent phụ trách: <strong>{item?.AgentName}</strong>
            </div>
            <div className="flex align-items-center">
              Trạng thái thực hiện:{" "}
              <div className="status-container pl-1">
                <span
                  className={`bg-green-500 p-[5px] text-white rounded-[5px] status ${
                    item?.CampaignCustomerStatus
                      ? item?.CampaignCustomerStatus.toLowerCase()
                      : ""
                  }`}
                >
                  {item?.CampaignCustomerStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute left-[-10px] top-[calc(50%-18px)] rounded-[5px] bg-[#D1E8FF] flex justify-center items-center w-[30px] h-[30px] shadow-md">
            <svg
              width="18"
              height="14"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 9V7H20V9H16ZM17.2 16L14 13.6L15.2 12L18.4 14.4L17.2 16ZM15.2 4L14 2.4L17.2 0L18.4 1.6L15.2 4ZM3 15V11H2C1.45 11 0.979167 10.8042 0.5875 10.4125C0.195833 10.0208 0 9.55 0 9V7C0 6.45 0.195833 5.97917 0.5875 5.5875C0.979167 5.19583 1.45 5 2 5H6L11 2V14L6 11H5V15H3ZM12 11.35V4.65C12.45 5.05 12.8125 5.5375 13.0875 6.1125C13.3625 6.6875 13.5 7.31667 13.5 8C13.5 8.68333 13.3625 9.3125 13.0875 9.8875C12.8125 10.4625 12.45 10.95 12 11.35ZM2 7V9H6.55L9 10.45V5.55L6.55 7H2Z"
                fill="#298EF2"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const sortData = [
    {
      display: "Mặc định",
      key: "default",
    },
    {
      display: "Thời gian tạo",
      key: "campaign_create",
    },
    {
      display: "Thời gian thực hiện",
      key: "campaign_excute",
    },
  ];

  const sortProcess = (a: any, b: any, condition: any, type: any) => {
    return match(condition)
      .with("campaign_create", () => {
        const a_time: any = new Date(a.cc_CreateDTimeUTC);
        const b_time: any = new Date(b.cc_CreateDTimeUTC);

        return type == "asc" ? a_time - b_time : b_time - a_time;
      })
      .with("campaign_excute", () => {
        const a_time: any = new Date(a.LogLUDTimeUTC);
        const b_time: any = new Date(b.LogLUDTimeUTC);

        return type == "asc" ? a_time - b_time : b_time - a_time;
      })
      .otherwise(() => (type == "asc" ? a.Idx - b.Idx : b.Idx - a.Idx));
  };

  return (
    <>
      <AdminContentLayout className={"Category_Manager"}>
        <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
        <AdminContentLayout.Slot name={"Content"}>
          <BaseCardView
            isLoading={isLoading}
            dataSource={data?.isSuccess ? data.DataList ?? [] : []}
            columns={columns}
            keyExpr={"CustomerCodeSys"}
            formSettings={formSettings}
            onReady={(ref) => (gridRef = ref)}
            allowSelection={true}
            onSelectionChanged={handleSelectionChanged}
            onSaveRow={handleSavingRow}
            onEditorPreparing={handleEditorPreparing}
            onEditRowChanges={handleEditRowChanges}
            onDeleteRows={handleDeleteRows}
            onEditRow={handleOnEditRow}
            storeKey={"tab-campagin"}
            ref={null}
            customCard={customCard}
            sortData={sortData}
            sortProcess={sortProcess}
          />
        </AdminContentLayout.Slot>
      </AdminContentLayout>

      <Popup
        title="Chi tiết chiến dịch"
        showCloseButton
        visible={open}
        onHiding={handleClose}
      >
        <ScrollView>
          <CustomerCampaign_Popup CampaignCode={campaignCode} />
        </ScrollView>
      </Popup>
    </>
  );
};

export default Tab_CustomerCampaign;
