import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { ET_TicketMessage } from "@/packages/types";
import { Icon, IconName } from "@/packages/ui/icons";
import { useSetAtom } from "jotai";
import { ReactNode, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import audioFile from "../../../../../../../../public/audio/test.mp3";
import { Avatar } from "../../../../../components/avatar";

export const PartMessageItem = ({ data }: { data: ET_TicketMessage }) => {
  const { t } = useI18n("Eticket_Detail_Message");
  const [playTime, setPlayTime] = useState(0);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const handleProgress = (state: any) => {
    setPlayTime(state.playedSeconds);
  };

  const [currentPopUp, setCurrentPopUp] = useState<ReactNode>(<></>);

  const handleUpdatePin = async () => {
    const obj = {
      TicketID: data.TicketID,
      OrgID: data.OrgID,
      IsPin: data.IsPin === "0" ? "1" : "0",
      AutoID: data.AutoId,
    };

    // console.log("obj ", obj, "data", data);

    const response = await api.ET_Ticket_UpdatePin(obj);
    if (response.isSuccess) {
      toast.success(t("Update Pin successfully"));
      window.location.reload();
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

  // const AttachmentList = () => {
  //   if (!data.Attachments || data.Attachments.length == 0) return <></>;

  //   return (
  //     <div className="w-full pl-5 pr-5">
  //       <div className="flex pl-2 pt-1">
  //         {data.Attachments.map((att, idx) => {
  //           return <Attachment file={att}></Attachment>;
  //         })}
  //       </div>
  //     </div>
  //   );
  // };

  const RemarkDetail = ({ remark }: { remark: ET_TicketMessage }) => {
    return <div className="w-full pl-5 pr-5">{remark.Description}</div>;
    // return (
    //   <div
    //     className="w-full pl-5 pr-5"
    //     dangerouslySetInnerHTML={{
    //       __html: "<span style='color: red;'>hello cao to</span>",
    //     }}
    //   >
    //     {"<span style='color: red;'>hello cao to</span>"}
    //   </div>
    // );
  };

  const EmailDetail = ({ email }: { email: ET_TicketMessage }) => {
    const objDescription =
      email.Description != null ? JSON.parse(email.Description) : null;
    return (
      <div className="w-full pl-5 pr-5">
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2">Email gửi đi: </span>
          <span>{email.ObjectSenderId}</span>
        </div>
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2">Tiêu đề: </span>
          <span>{objDescription?.SubTitleSend || "--------"}</span>
        </div>
        <div className="flex pl-2 pt-1">
          <span
            className="text-gray mr-2"
            style={{ width: "200px", display: "block" }}
          >
            Nội dung:{objDescription?.MessageSend || "--------"}
          </span>
          <div className="inline-block">{email.Detail}</div>
        </div>
      </div>
    );
  };

  const CallDetail = ({ call }: { call: any }) => {
    return (
      <div className="w-full pl-5 pr-5">
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2">
            Cần hỗ trợ tạo đơn hàng ngày 20-10 trên DMS cho khách hàng Nguyễn
            Văn A{" "}
          </span>
          {/* <span>{call.FromNumber}</span> */}
        </div>
        {/* <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2">SĐT nhận: </span>
          <span>{call.ToNumber}</span>
        </div> */}
      </div>
    );
  };

  const ZaloDetail = ({ data }: { data: any }) => {
    if (data.IsIncoming === "0") {
      return (
        <div className="w-full pl-5 pr-5">
          <div className="flex pl-2 pt-1">
            <span className="text-gray mr-2">
              Cần hỗ trợ tạo đơn hàng ngày 20-10 trên DMS cho khách hàng Nguyễn
              Văn A{" "}
            </span>
            {/* <span>{call.FromNumber}</span> */}
          </div>
          {/* <div className="flex pl-2 pt-1">
            <span className="text-gray mr-2">SĐT nhận: </span>
            <span>{call.ToNumber}</span>
          </div> */}
        </div>
      );
    } else {
      return (
        <div className="w-full pl-5 pr-5">
          <div className="flex pl-2 pt-1">
            <span className="text-gray mr-2">
              Cần hỗ trợ tạo đơn hàng ngày 20-10 trên DMS cho khách hàng Nguyễn
              Văn A{" "}
            </span>
            {/* <span>{call.FromNumber}</span> */}
          </div>
          {/* <div className="flex pl-2 pt-1">
            <span className="text-gray mr-2">SĐT nhận: </span>
            <span>{call.ToNumber}</span>
          </div> */}
        </div>
      );
    }
  };

  const EventDetail = ({ data }: { data: ET_TicketMessage }) => {
    return (
      <div className="w-full pl-5 pr-5 pt-1">
        <center>{data.Detail ?? ""}</center>
      </div>
    );
  };

  const InfoDetail = ({ data }: { data: ET_TicketMessage }) => {
    if (data?.ConvMessageType === "1" && data?.ChannelId === "0")
      return <RemarkDetail remark={data}></RemarkDetail>;
    if (data?.ConvMessageType === "3" && data?.ChannelId === "1")
      return <EmailDetail email={data}></EmailDetail>;
    if (data?.ConvMessageType === "4" && data?.ChannelId === "2")
      return <CallDetail call={data}></CallDetail>;
    if (
      (data?.ConvMessageType === "8" || data?.ConvMessageType === "10") &&
      data?.ChannelId === "6"
    )
      return <ZaloDetail data={data}></ZaloDetail>;
    // else if (data.Type == "Call" && data.Call != null)
    //   return <CallDetail call={data.Call}></CallDetail>;
    // else if (data.Type == "Event")
    //   return <EventDetail data={data}></EventDetail>;
    return <></>;
  };

  // export interface EticketMessage {
  //   //Id: string;
  //   Type: string; //Email/Call/Note/Zalo/Event
  //   AuthorName: string | null;
  //   AuthorImage: string | null;

  //   IsPinned: boolean | null;
  //   Detail: string | null;
  //   Attachments?: UploadFile[];

  //   Call?: Call;
  //   Email?: Email;
  //   CreateDtime: string | null;
  // }

  const messageTypeCss = useMemo(() => {
    let type1: IconName = "remark";
    // console.log(
    //   "convMessageType ",
    //   data?.ConvMessageType,
    //   "ChannelId",
    //   data?.ChannelId
    // );

    switch (data?.ConvMessageType) {
      case "1": {
        if (data?.ChannelId === "0") {
          type1 = "remark";
        }
        break;
      }
      case "3": {
        if (data?.ChannelId === "1") {
          type1 = "email";
        }
        break;
      }
      case "4": {
        if (data?.ChannelId === "2") {
          type1 = "call";
        }
        break;
      }
      case "8":
      case "10": {
        if (data?.ChannelId === "6") {
          type1 = "zalo";
        }
        break;
      }
      default: {
        type1 = "remark";
        break;
      }
    }
    // if (data?.ConvMessageType === "1" && data?.ChannelId === "0") {
    //   type1 = "remark";
    //   console.log("typ remark", type1);
    // } else if (data?.ConvMessageType === "3" && data?.ChannelId === "1") {
    //   type1 = "email";
    //   console.log("typ email", type1);
    // } else if (
    //   (data?.ConvMessageType === "8" || data?.ConvMessageType === "10") &&
    //   data?.ChannelId === "6"
    // ) {
    //   type1 = "zalo";
    //   console.log("type zalo", type1);
    // } else if (data?.ConvMessageType === "4" && data?.ChannelId === "2") {
    //   type1 = "call";
    //   console.log("type call", type1);
    // }
    // if (type1 === "email" || type1 === "call" || type1 === "zalo") {
    //   return `${type1} ${data.IsIncoming === "1" ? "in" : "out"}`;
    // }

    // console.log("type ", type1);
    // if (type1 == "call") {
    //   return `${type1} ${data.Call?.Type?.toLocaleLowerCase()}`;
    // }
    return type1;
  }, [data]);

  const handleReply = () => {
    console.log("data ", data);
  };

  const showPopUp = () => {
    console.log("data ", data.dataPin);
  };

  return (
    <div
      className={`w-full position-relative bg-white mb-3 pb-3 message-item ${messageTypeCss}`}
    >
      {data.TicketID != "Event" ? (
        <>
          <div className="flex p-2">
            <div className=" avatar-name mr-4">
              <Avatar
                //img={data.AuthorImage}
                name={data.UserId}
                img={null}
                size={"sx"}
                className="mr-1"
              />
              <strong className="name">{data.UserId}</strong>
            </div>
            <span className="text-gray" style={{ lineHeight: "32px" }}>
              <i className="dx-icon-clock mr-1"></i>
              {data.CreateDTimeUTC}
            </span>
          </div>

          {data?.ConvMessageType === "4" && data?.ChannelId === "2" ? (
            <div className="auto-file">
              <ReactPlayer
                url={audioFile}
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
            </div>
          ) : (
            <></>
          )}
          <span className={`message-type ${messageTypeCss}`}>
            <Icon name={`${messageTypeCss ?? "remark"}`} />
          </span>
        </>
      ) : (
        <></>
      )}
      <InfoDetail data={data}></InfoDetail>
      {/* <AttachmentList></AttachmentList> */}
      {currentPopUp}
    </div>
  );
};
