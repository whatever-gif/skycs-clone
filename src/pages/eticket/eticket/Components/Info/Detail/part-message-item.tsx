import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { ET_TicketMessage } from "@/packages/types";
import { Icon } from "@/packages/ui/icons";
import { getFullTime } from "@/utils/time";
import { Button } from "devextreme-react";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { ReactNode, useState } from "react";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import { Avatar } from "../../../../components/avatar";
import PopupAnotherPin from "./Popup/PopUpAnotherPin";
import { currentTabAtom, currentValueTabAtom, reloadingtabAtom } from "./store";
import "./style.scss";
export const PartMessageItem = ({
  data,
  onGim,
  isHidenButton = false,
  flag = "remark",
  isShowButton = ["pin", "reply", "delete"],
  handleCustomerDelete = () => {},
  refetch,
}: {
  onGim: any;
  data: ET_TicketMessage;
  isHidenButton?: boolean;
  flag: string;
  isShowButton?: string[];
  handleCustomerDelete?: () => void;
  refetch: () => void;
}) => {
  const { t } = useI18n("Eticket_Detail");

  const { t: common } = useI18n("Common");
  const { t: e } = useI18n("ErrorMessage");
  const formartDate = (d: any) => {
    if (d) {
      const date = new Date(d);
      const newDate = new Date(date);
      return getFullTime(new Date(newDate.setHours(newDate.getHours() + 7)));
    } else {
      return "---";
    }
  };

  const setCurrentTag = useSetAtom(currentTabAtom);
  const setCurrentValueTab = useSetAtom(currentValueTabAtom);
  const setReloadingtab = useSetAtom(reloadingtabAtom);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);

  const [currentPopUp, setCurrentPopUp] = useState<ReactNode>(<></>);

  const handleUpdatePin = async () => {
    const obj = {
      TicketID: data.TicketID ?? "",
      OrgID: data.OrgID ?? "",
      IsPin: data.IsPin === "0" ? "1" : "0",
      AutoID: data.AutoId,
    };

    const response = await api.ET_Ticket_UpdatePin(obj);
    if (response.isSuccess) {
      toast.success(t("Update Pin successfully"));
      onGim();
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

  const RemarkDetail = ({ remark }: { remark: ET_TicketMessage }) => {
    return (
      <div className="w-full pl-5 pr-5">
        <div
          className="format-text-html pl-2 text-bold"
          dangerouslySetInnerHTML={{
            __html: remark.Description ?? "--------------------",
          }}
        />
      </div>
    );
  };

  const NoteDetail = ({ data }: { data: ET_TicketMessage }) => {
    return (
      <div className="w-full pl-5 pr-5">
        <div
          className="format-text-html text-bold"
          dangerouslySetInnerHTML={{
            __html: data.Description ?? "--------------------",
          }}
        />
      </div>
    );
  };

  const EmailDetail = ({ email }: { email: ET_TicketMessage }) => {
    const objDescription =
      email.Description != null ? JSON.parse(email.Description) : null;
    return (
      <div className="w-full pl-5 pr-5">
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2 text-tile-eticket-detail">
            {t("Email send")}:{" "}
          </span>
          <span className="text-bold">{email.ObjectSenderId}</span>
        </div>
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2 text-tile-eticket-detail">
            {t("Email receive")}:{" "}
          </span>
          <span className="text-bold">{email.ObjectReceiveId}</span>
        </div>
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2 text-tile-eticket-detail">
            {t("Title")}:{" "}
          </span>
          <span className="text-bold">{objDescription?.SubTitleSend}</span>
        </div>
        <div className="flex align-items-flex-start pl-2 pt-1">
          <span
            className="text-gray mr-2 text-tile-eticket-detail"
            style={{ width: "w-full", display: "flex" }}
          >
            {t("Description")}:
          </span>{" "}
          <br />
          <div
            className="format-text-html"
            dangerouslySetInnerHTML={{
              __html: objDescription?.MessageSend ?? "--",
            }}
          />
        </div>
      </div>
    );
  };

  const CallDetail = ({ call }: { call: any }) => {
    const { Detail, Description } = call;
    const convertJSON = JSON.parse(Detail);
    const convertDescriptionJSON = JSON.parse(Description);
    console.log("converDescription ", convertDescriptionJSON);

    let fl = false;
    if (flag === "callin" || call === "callmissedin") {
      console.log("call ", call, "convertJSON ", convertJSON);
      fl = true;
    }

    return (
      <div className="w-full pl-5 pr-5">
        <div className="pl-2 pt-1">
          {convertJSON.RecFilePath && (
            <ReactPlayer
              url={convertJSON.RecFilePath}
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
          <div className="flex pl-2 pt-1">
            <span className="text-gray mr-2 text-tile-eticket-detail w-[140px]">
              {t("CallID")}{" "}
            </span>
            <span className="text-bold">{convertJSON.CallID}</span>
          </div>{" "}
          {/* Số điện thoại khách hàng */}
          <div className="flex pl-2 pt-1">
            <span className="text-gray mr-2 text-tile-eticket-detail w-[140px]">
              {call.IsIncoming === "0" ? t("FromNumberOut") : t("FromNumber")}
            </span>
            <span className="text-bold">{convertJSON.FromNumber}</span>
          </div>
          {/* số tổng đài */}
          <div className="flex pl-2 pt-1">
            <span className="text-gray mr-2 text-tile-eticket-detail w-[140px]">
              {call.IsIncoming === "0" ? t("CustomerNumber") : t("ToNumber")}
            </span>
            <span className="text-bold">{convertJSON.ToNumber}</span>
          </div>
          {/* thời gian cuộc gọi */}
          <div className="flex pl-2 pt-1">
            <span className="text-gray mr-2 text-tile-eticket-detail w-[140px]">
              {t("Call's Time")}
            </span>
            <span className="text-bold">
              {convertDescriptionJSON.StartDTime ||
              convertDescriptionJSON.EndDTime
                ? formartDate(convertDescriptionJSON.StartDTime) +
                  " - " +
                  formartDate(convertDescriptionJSON.EndDTime)
                : "----"}
              {}
            </span>
          </div>
          {/* độ dài cuộc gọi */}
          <div className="flex pl-2 pt-1">
            <div className="text-gray mr-2 text-tile-eticket-detail w-[140px]">
              {t("TalkTime")}
            </div>
            <span className="text-bold">{convertJSON.TalkTime}</span>
          </div>
        </div>
      </div>
    );
  };

  const ZaloDetail = ({ data }: { data: any }) => {
    // hiện tại zalo đi và đến sẽ phải check thêm
    if (data.IsIncoming === "0") {
      if (data.ConvMessageType === "10") {
        // case phone
        const dataJSON = JSON.parse(data?.Description);
        const convertDetail = JSON.parse(data?.Detail);
        return (
          <div className="w-full pl-5 pr-5">
            <div className=" pl-2 pt-1">
              {/* <span>Tên tài khoản zalo: {data.ObjectReceiveId}</span> <br /> */}
              {/* <span>Thời gian gửi: {data.MsgDTime}</span> <br /> */}
              <p>
                <span className="title">Zalo ZNS:</span>
                <span className="text-bold">{data.ObjectReceiveId}</span>
              </p>
              <p className="pt-1 flex">
                <span className="title"> {`${t("Content")}`}</span>:
                <div className="text-bold">{dataJSON[0].SubFormCode}</div>
              </p>
              <p className="pt-1">
                <span className="title">Mã Mẫu ZNS:</span>{" "}
                <span className="text-bold">{convertDetail.template_id}</span>
              </p>
              <table className="eticket-it-table">
                {dataJSON.map((item: any, index: number) => {
                  return (
                    <tr
                      className="pr-2 border-table"
                      key={`eticket-it-tr-${index}`}
                    >
                      <td>{item.ParamSFCodeZNS}</td>
                      <td>{item.ParamValue}</td>
                    </tr>
                  );
                })}
              </table>
              {/* <span>{call.FromNumber}</span> */}
            </div>
            {/* <div className="flex pl-2 pt-1">
              <span className="text-gray mr-2 text-tile-eticket-detail">SĐT nhận: </span>
              <span>{call.ToNumber}</span>
            </div> */}
          </div>
        );
      }

      return (
        <div className="w-full pl-5 pr-5">
          <div className="pl-2 pt-1">
            <span className="text-gray mr-2 text-tile-eticket-detail">
              <span>{t("Mail's ZaloUserID")}: </span>{" "}
              <span className="text-bold">{data.ObjectReceiveId}</span> <br />
            </span>
            <div className="mt-1"></div>
            <span className=" mr-2 text-bold ">{data.Description}</span>
            {/* <span>{call.FromNumber}</span> */}
          </div>
          {/* <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2 text-tile-eticket-detail">SĐT nhận: </span>
          <span>{call.ToNumber}</span>
        </div> */}
        </div>
      );
    } else {
      return (
        <div className="w-full pl-5 pr-5">
          <div className="pl-2 pt-1">
            <span className="text-gray mr-2 text-tile-eticket-detail">
              <span className="title">{t("Mail's ZaloUserID")}: </span>{" "}
              {data.ObjectReceiveId} <br />
            </span>
            <span className="text-gray mr-2 text-tile-eticket-detail">
              {data.Description}
            </span>
          </div>
        </div>
      );
    }
  };

  const EventDetail = ({ data }: { data: ET_TicketMessage }) => {
    return (
      <div className="w-full pl-5 pr-5 pt-3 flex align-items-center justify-center ">
        <div
          className="format-text-html text-center "
          dangerouslySetInnerHTML={{
            __html: data.Description ?? "---",
          }}
        />{" "}
      </div>
    );
  };

  const InfoDetail = ({ data }: { data: ET_TicketMessage }) => {
    if (flag === "remark") return <RemarkDetail remark={data}></RemarkDetail>;
    if (flag === "emailin" || flag === "emailout")
      return <EmailDetail email={data}></EmailDetail>;
    if (
      flag === "call" ||
      flag === "callmissedin" ||
      flag === "callmissedout" ||
      flag === "callout" ||
      flag === "callin"
    )
      return <CallDetail call={data}></CallDetail>;
    if (flag === "zaloin" || flag === "zaloout")
      return <ZaloDetail data={data}></ZaloDetail>;
    if (flag === "note") return <NoteDetail data={data}></NoteDetail>;
    if (flag === "eventlog") return <EventDetail data={data}></EventDetail>;
    return <></>;
  };

  const handleReply = () => {
    let obj: any = {
      ActionType: "0",
      MessageSend: "",
      OrgID: data.OrgID,
      SubFormCode: "",
      SubTitleSend: "",
      TicketID: data.TicketID,
    };

    switch (flag) {
      case "zaloout":
      case "zaloin": {
        obj = {
          ...obj,
          ObjType: "",
          ObjCode: "",
        };

        if (data.ChannelId === "6" && data.ConvMessageType === "8") {
          obj = {
            // zalo
            ...obj,
            ObjType: "ZaloUserId",
            ObjCode: data.ObjectReceiveId,
          };
        }
        if (data.ChannelId === "6" && data.ConvMessageType === "10") {
          obj = {
            // phone
            ...obj,
            ObjType: "PhoneNo",
            ObjCode: data.ObjectReceiveId,
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
          CtmEmail: data.ObjectReceiveId,
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
        // const obj = {
        //   ActionType: data?.ActionType || "0",
        //   TicketID: data?.TicketID || "",
        //   OrgID: data?.OrgID || "",
        //   Description: data?.Description || "",
        // };
        break;
      }
      case "callin":
      case "callmissedin":
      case "callmissedout":
      case "callout": {
        setReloadingtab(nanoid());
        setCurrentTag(2);
        break;
      }
      default: {
        break;
      }
    }
    // window.scrollTo(0, 0);
  };
  const showPopUp = () => {
    setCurrentPopUp(
      <PopupAnotherPin
        onGim={onGim}
        data={data?.dataPin ?? []}
        onClose={() => {
          setCurrentPopUp(<></>);
        }}
      />
    );
  };

  const handleDelete = async (data: any) => {
    const resp: any = await api.ETTicketMessage_DeleteMulti([
      {
        AutoID: data.AutoId,
        TicketID: data?.TicketID,
      },
    ]);

    if (resp?.isSuccess) {
      toast.success(common("Delete successfully!"));
      await refetch();
    } else {
      showError({
        message: e(resp._strErrCode),
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

  return (
    <div
      className={`w-full position-relative bg-white mb-3 pb-3 message-item ${flag} ${
        data?.checkPin ? "pin" : ""
      }`}
    >
      {flag != "eventlog" ? (
        <>
          <div className="flex p-3 pl-4 pop-up-use">
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

          {!isHidenButton && (
            <div className="position-absolute" style={{ top: 0, right: 0 }}>
              {data?.dataPin && data?.dataPin.length > 1 && (
                <Button
                  onClick={showPopUp}
                  stylingMode="outlined"
                  type="default"
                  className="pin-show button-icon-detail-eticket"
                >
                  {data?.dataPin.length - 1} <p>{t("Another pin")}</p>
                </Button>
              )}

              {isShowButton?.includes("reply") && (
                <Button
                  stylingMode="outlined"
                  type="default"
                  className="btn-msg-action button-icon-detail-eticket"
                  // icon="custom-reply"
                  onClick={handleReply}
                >
                  <Icon name="reply"></Icon>
                </Button>
              )}

              {isShowButton?.includes("pin") && (
                <Button
                  stylingMode="outlined"
                  type="default"
                  className="btn-msg-action button-icon-detail-eticket"
                  icon={data.IsPin === "1" ? "unpin" : "pin"}
                  onClick={() => handleUpdatePin()}
                >
                  <Icon name={data.IsPin === "1" ? "unpin" : "pin"} />
                </Button>
              )}

              {isShowButton?.includes("delete") && (
                <PermissionContainer
                  permission={"BTN_ETICKET_DTLETICKET_DELETEMESSAGE"}
                >
                  <Button
                    stylingMode="outlined"
                    type="danger"
                    className="btn-msg-action button-icon-detail-eticket"
                    icon="trash"
                    onClick={() => handleDelete(data)}
                  />
                </PermissionContainer>
              )}
              {isShowButton?.includes("customeDelete") && (
                <Button
                  stylingMode="outlined"
                  type="danger"
                  className="btn-msg-action button-icon-detail-eticket"
                  icon="trash"
                  onClick={handleCustomerDelete}
                />
              )}
            </div>
          )}
          {data?.ConvMessageType === "4" && data?.ChannelId === "2" ? (
            <div className="auto-file"></div>
          ) : (
            <></>
          )}

          {/* <span className={`message-type email in  ${messageTypeCss}`}>
            <i></i>
          </span> */}
          {flag === "eventlog" ? (
            ""
          ) : (
            <span className={`message-type ${flag}`}>
              <Icon name={`${flag ?? "remark"}`} />
            </span>
          )}
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
