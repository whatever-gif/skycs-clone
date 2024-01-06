import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import { Icon, IconName } from "@/packages/ui/icons";
import { Avatar } from "@/pages/eticket/components/avatar";
import { Button, SelectBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import { ReactNode, useState } from "react";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import PopupCall from "./Popup/call";
interface CallItem {
  CallID: number;
  CallType: number;
  State: number;
  FromNumber: number;
  ToNumber: number;
  TalkTime: number;
  TalkDTime: string;
  TalkLocalDTimeFrom: string;
  TalkLocalDTimeTo: string;
  Type: string;
  RecFilePath?: string;
}

export const PartReplyCall = ({
  data,
  onReload,
}: {
  data: any;
  onReload: any;
}) => {
  const [popup, setPopup] = useState<ReactNode>(<></>);
  const [file, setFile] = useState<CallItem[]>([]);
  const { t } = useI18n("Eticket_Detail_Call");
  const { auth } = useAuth();
  const api = useClientgateApi();
  const Lst_Eticket_ActionType = [
    {
      ActionTypeCode: "0",
      ActionTypeName: t("Send"),
    },
    {
      ActionTypeCode: "1",
      ActionTypeName: t("Send and mark eTicket as Closed"),
    },
    {
      ActionTypeCode: "2",
      ActionTypeName: t("Send and mark eTicket as Processing"),
    },
  ];
  const showError = useSetAtom(showErrorAtom);
  const initValue = {
    ActionType: data?.ActionType || "0",
    TicketID: data?.TicketID || "",
    OrgID: data?.OrgID || "",
    Description: data?.Description || "",
  };
  const [addRemark, setAddRemark] = useState(initValue);
  const callLastest = async () => {
    callApi.getMyLatestCall(auth.networkId ?? "").then(async (resp) => {
      if (resp.Success) {
        if (resp.Data) {
          const response = await api.ET_Ticket_GetCallMessageByCallID(
            resp.Data?.Id
          );
          if (response.isSuccess) {
            toast.success(t("ET_Ticket_GetCallMessageByCallID success!"));
            const param = {
              ...response.Data,
            };
            setFile([param]);
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
          toast.error("There is no call to show");
        }
      }
    });
  };

  const handleShowPopUp = () => {
    setPopup(
      <PopupCall
        data={[]}
        onClose={() => setPopup(<></>)}
        onSelect={selectFile}
      />
    );
  };

  const selectFile = (e: any) => {
    setFile([e]);
    setPopup(<></>);
  };

  const hanldleAddCall = async () => {
    const obj = {
      ActionType: addRemark.ActionType,
      TicketID: addRemark.TicketID,
      List_ET_TicketMessageCall: file.map((item) => {
        return {
          CallID: item.CallID,
        };
      }),
    };
    const response = await api.AddCall(obj);
    if (response.isSuccess) {
      toast.success(t("AddCall success!"));
      onReload();
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

  const handleRemoveFile = () => {
    setFile([]);
  };
  return (
    <div className={"w-full box-reply message-reply part-reply-call mb-2"}>
      <center
        className="h-[200px] content-call flex align-items-center justify-center"
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        {file.length ? (
          <div className="w-[100%] p-3">
            {file.map((item: CallItem, idx: number) => {
              console.log("item ", item);
              let flag: IconName = "callin";
              console.log("item ", item);
              if (item.State === 6) {
                if (item.CallType === 1) {
                  flag = "callin";
                } else {
                  flag = "callout";
                }
              } else {
                if (item.CallType === 1) {
                  flag = "callmissedin";
                } else {
                  flag = "callmissedout";
                }
              }

              console.log("flag ", flag);
              return (
                <div key={idx} className="message-item call-item">
                  <div className="flex p-2 pop-up-use">
                    <div className=" avatar-name mr-4">
                      <Avatar
                        //img={data.AuthorImage}
                        name={item.AgentName ?? ""}
                        img={null}
                        size={"sx"}
                        className="mr-1"
                      />
                      <strong className="name">{item.AgentName}</strong>
                    </div>
                    <span className="text-gray" style={{ lineHeight: "32px" }}>
                      <i className="dx-icon-clock mr-1"></i>
                      {item.TalkLocalDTimeFrom}
                    </span>
                  </div>
                  <div
                    className="position-absolute"
                    style={{ top: 0, right: 0 }}
                  >
                    <Button
                      stylingMode="outlined"
                      type="danger"
                      className="btn-msg-action"
                      icon="trash"
                      onClick={handleRemoveFile}
                    />
                  </div>
                  <span className={`message-type ${flag}`}>
                    <Icon name={`${flag}`} />
                  </span>

                  <div className="w-full pl-5 pr-5">
                    {item?.RecFilePath && (
                      <ReactPlayer
                        url={item.RecFilePath}
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
                    <br />
                    <p>
                      <span>{t("CallID")}</span>: <strong>{item.CallID}</strong>
                    </p>
                    <p>
                      <span>{t("FromNumber")}</span>:{" "}
                      <strong>{item.FromNumber}</strong>
                    </p>
                    <p>
                      <span>{t("ToNumber")}</span>:{" "}
                      <strong>{item.ToNumber}</strong>
                    </p>
                    <p>
                      <span>{t("TalkTime")}</span>:{" "}
                      <strong>{item.TalkTime}</strong>
                    </p>
                    <p>
                      <span>{t("TalkDTime")}</span>:{" "}
                      <strong>{item.TalkDTime}</strong>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <PermissionContainer permission={"BTN_ETICKET_DTLETICKET_CALL"}>
              <Button
                stylingMode={"contained"}
                type="default"
                icon="file"
                text={t("Add Record's File")}
                className="mr-1"
                onClick={handleShowPopUp}
              />
            </PermissionContainer>

            {/* <PermissionContainer
              permission={"BTN_ETICKET_DTLETICKET_ADD_CUOC_GOI_DANG_THUC_HIEN"}
            >
              <Button
                stylingMode={"contained"}
                type="default"
                icon="file"
                text={t("Add Call")}
                className="mr-1"
                onClick={callLastest}
              />
            </PermissionContainer> */}
          </>
        )}
      </center>

      <div
        className={"w-full box-button-eticket"}
        style={{ textAlign: "center" }}
      >
        <div className="flex">
          <SelectBox
            value={addRemark.ActionType} // giá trị khởi tạo
            valueExpr={"ActionTypeCode"} // giá trị được chọn
            displayExpr={"ActionTypeName"} // giá trị hiển thị
            style={{ width: 320, marginRight: 8 }}
            height={30}
            searchEnabled={true} // hiển thị chức năng tìm kiếm trong selectbox
            minSearchLength={3} // số lượng ký tự bắt đầu tìm kiếm
            searchExpr={["ActionTypeCode", "ActionTypeName"]} // tìm kiếm theo trường dữ liệu nào
            searchTimeout={10} // độ trễ thời điểm người dùng nhập xong và thời điểm tìm kiếm được thực hiện
            showDataBeforeSearch={false} // true: luôn hiển thị tất cả danh sách dữ liệu kể cả chưa nhập tới minSearchLength; false: không hiển thị dữ liệu cho đến khi nhập số ký tự bằng minSearchLength
            //showClearButton={true} // hiển thị item xóa dữ liệu
            dataSource={Lst_Eticket_ActionType} // nguồn dữ liệu
            onValueChanged={(event: any) => {
              const dataCur = {
                ...addRemark,
                ActionType: event.value,
              };
              setAddRemark(dataCur);
            }}
          ></SelectBox>
          <Button
            stylingMode={"contained"}
            type="default"
            icon="email"
            text={t("Send Call")}
            className="eticket-button-send"
            onClick={hanldleAddCall}
          >
            {t("Send Call")}
            <Icon style={{ marginLeft: "10px" }} name="send"></Icon>
          </Button>
        </div>
      </div>
      {popup}
    </div>
  );
};
