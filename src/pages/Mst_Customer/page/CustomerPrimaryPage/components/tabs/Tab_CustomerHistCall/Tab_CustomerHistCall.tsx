import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { BaseCardView } from "@/packages/ui/card-view/card-view";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";

import { useI18n } from "@/i18n/useI18n";
import { Icon } from "@/packages/ui/icons";
import { Popup } from "devextreme-react";
import { useParams } from "react-router-dom";
import { match } from "ts-pattern";
import EticketPopup from "./components/popup/Eticket_Popup/EticketPopup";
import "./components/style.scss";

export const renderIcon = (type: any) => {
  return match(type)
    .with("Incomming", () => <></>)

    .otherwise(() => <></>);
};

const Tab_CustomerHistCall = () => {
  let gridRef: any = useRef();

  const api = useClientgateApi();

  const { t } = useI18n("Tab_CustomerHistCall");

  const { CustomerCodeSys }: any = useParams();

  const { data, isLoading } = useQuery(
    ["listHistCall", CustomerCodeSys],
    async () => {
      const resp: any = await api.CallCall_GetByCustomerCodeSys(
        CustomerCodeSys
      );

      return resp;
    }
  );

  console.log(data?.DataList?.find((item: any) => item.CallId == "7412040000"));

  const [popup, setPopup] = useState({
    open: false,
    code: null,
    type: null,
  });

  const columns: any = [];

  const formSettings = {};

  const handleSelectionChanged = () => {};

  const handleSavingRow = () => {};

  const handleEditorPreparing = () => {};

  const handleEditRowChanges = () => {};

  const handleDeleteRows = () => {};

  const handleOnEditRow = () => {};

  const renderCallType = (callType: any) => {
    return match(callType)
      .with("1", () => (
        <span className={`message-type callin`}>
          <Icon name={`callin`} />
        </span>
      ))
      .with("2", () => (
        <span className={`message-type callout`}>
          <Icon name={`callout`} />
        </span>
      ))
      .otherwise(() => <></>);
  };

  const renderMissingCall = (callType: any) => {
    return match(callType)
      .with("1", () => (
        <span className={`message-type callmissedin`}>
          <Icon name={`callmissedin`} />
        </span>
      ))
      .with("2", () => (
        <span className={`message-type callmissedout`}>
          <Icon name={`callmissedout`} />
        </span>
      ))
      .otherwise(() => <></>);
  };

  const currentCallType = (callType: any) => {
    return match(callType)
      .with("1", () => "đến")
      .with("2", () => "đi")
      .otherwise(() => "");
  };

  const formattedPhoneNumber = (phoneNo: any) => {
    const numberRegex = /^[0-9]*$/;
    if (
      numberRegex.test(phoneNo) &&
      phoneNo &&
      phoneNo.length >= 10 &&
      phoneNo.length <= 11
    ) {
      return (
        phoneNo.substring(0, 4) +
        "." +
        phoneNo.substring(4, 7) +
        "." +
        phoneNo.substring(7)
      );
    }

    return phoneNo;
  };

  const handleOpenDetail = (code: any, type: any) => {
    setPopup({
      open: true,
      code: code,
      type: type,
    });
  };

  const customCard = (item: any) => {
    const { Json_Call_CallBizRef } = item;

    const listCallBizRef = JSON.parse(Json_Call_CallBizRef) ?? [];

    const eticketFound = listCallBizRef?.find(
      (item: any) => item?.BizType == "ETICKET"
    );

    const campaignFound = listCallBizRef?.find(
      (item: any) => item?.BizType == "CAMPAIGN"
    );

    const checkUrl = (path: any) => {
      return ReactPlayer.canPlay(path);
    };

    return (
      <div className="px-[10px] pt-[5px] detail-customer-tab-content-item">
        <div className="mb-1 px-[35px] py-[10px] flex flex-col gap-3 relative rounded-md shadow-sm bg-white hover:shadow-md ease-linear duration-100">
          <div className="font-bold">
            Cuộc gọi {item?.TalkTime == 0 && "nhỡ"}{" "}
            {currentCallType(item?.CallType)} từ số{" "}
            {formattedPhoneNumber(item?.FromNumber)}
          </div>
          <div>Độ dài cuộc gọi: {item?.TalkTime}s</div>

          <div>
            Thời gian gọi {currentCallType(item?.CallType)}: {item?.StartDTime}
          </div>

          <div>
            File ghi âm:{" "}
            {item?.RecFilePathFull && checkUrl(item?.RecFilePathFull)
              ? ""
              : "Không có file ghi âm!"}
          </div>

          {item?.RecFilePathFull && checkUrl(item?.RecFilePathFull) && (
            <ReactPlayer
              url={item.RecFilePathFull}
              controls
              config={{
                file: {
                  forceVideo: false,
                  forceAudio: true,
                },
              }}
              width={300}
              height={35}
              volume={0.1}
            />
          )}

          <div>Agent tiếp nhận: {item?.suag_UserName}</div>

          {eticketFound && (
            <div>
              Mã eTicket:{" "}
              <span
                className="hover:underline cursor-pointer hover:text-[#00703c]"
                onClick={() =>
                  handleOpenDetail(eticketFound?.BizRefCode, "ETICKET")
                }
              >
                {eticketFound?.BizRefCode}
              </span>
            </div>
          )}

          {campaignFound && (
            <div>
              Mã chiến dịch:{" "}
              <span
                className="hover:underline cursor-pointer hover:text-[#00703c]"
                onClick={() =>
                  handleOpenDetail(campaignFound?.BizRefCode, "CAMPAIGN")
                }
              >
                {campaignFound?.BizRefCode}
              </span>
            </div>
          )}

          <div className="absolute left-[-10px] rounded-[5px] top-[calc(50%-18px)] ">
            {item?.TalkTime == 0
              ? renderMissingCall(item?.CallType)
              : renderCallType(item?.CallType)}
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
      display: "Thời gian cuộc gọi đên",
      key: "call_incoming",
    },
    {
      display: "Thời gian cuộc gọi đi",
      key: "call_outgoing",
    },
    {
      display: "Thời gian cuộc gọi nhỡ",
      key: "call_missing",
    },
  ];

  const sortProcess = (a: any, b: any, condition: any, type: any) => {
    return match(condition)
      .with("call_incoming", () => {
        if (a.CallType === "1" && b.CallType !== "1") {
          return -1; // Move 'type' to the beginning
        } else if (a.CallType !== "1" && b.CallType === "1") {
          return 1; // Move 'type' to the end
        } else {
          if (a.CallType == "1" && b.CallType == "1") {
            const a_time: any = new Date(a.CreateDTimeUTC);
            const b_time: any = new Date(b.CreateDTimeUTC);

            return type == "asc" ? a_time - b_time : b_time - a_time;
          } else {
            return type == "asc" ? a.Idx - b.Idx : b.Idx - a.Idx;
          }
        }
      })
      .with("call_outgoing", () => {
        if (a.CallType === "2" && b.CallType !== "2") {
          return -1; // Move 'type' to the beginning
        } else if (a.CallType !== "2" && b.CallType === "2") {
          return 1; // Move 'type' to the end
        } else {
          if (a.CallType == "2" && b.CallType == "2") {
            const a_time: any = new Date(a.CreateDTimeUTC);
            const b_time: any = new Date(b.CreateDTimeUTC);

            return type == "asc" ? a_time - b_time : b_time - a_time;
          } else {
            return type == "asc" ? a.Idx - b.Idx : b.Idx - a.Idx;
          }
        }
      })
      .with("call_missing", () => {
        if (a.TalkTime === "0" && b.TalkTime !== "0") {
          return -1; // Move 'type' to the beginning
        } else if (a.TalkTime !== "0" && b.TalkTime === "0") {
          return 1; // Move 'type' to the end
        } else {
          if (a.TalkTime == "0" && b.TalkTime == "0") {
            const a_time: any = new Date(a.CreateDTimeUTC);
            const b_time: any = new Date(b.CreateDTimeUTC);

            return type == "asc" ? a_time - b_time : b_time - a_time;
          } else {
            return type == "asc" ? a.Idx - b.Idx : b.Idx - a.Idx;
          }
        }
      })
      .otherwise(() => (type == "asc" ? a.Idx - b.Idx : b.Idx - a.Idx));
  };

  const handleClose = () => {
    setPopup({
      open: false,
      code: null,
      type: null,
    });
  };

  return (
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
          storeKey={"tab-call"}
          ref={null}
          customCard={customCard}
          sortData={sortData}
          sortProcess={sortProcess}
        />
        <Popup
          visible={popup.open}
          onHidden={handleClose}
          hideOnOutsideClick
          showCloseButton
          title={t(`Detail ${popup.type}`)}
          width={"90%"}
        >
          <EticketPopup TicketID={popup.code} />
        </Popup>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Tab_CustomerHistCall;
