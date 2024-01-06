import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration, useNetworkNavigate } from "@/packages/hooks";
import { showErrorAtom } from "@/packages/store";
import { IconName } from "@/packages/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, CheckBox, Form, LoadPanel, Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { memo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import { PartMessageItem } from "../../Info/Detail/part-message-item";
import { dataRowAtom, popupSplitVisibleAtom } from "../store";
import "./style.scss";
interface Props {
  onCancel: () => void;
  onSave?: () => void;
}

interface data {
  title: string;
  message: string;
  id: string;
  date: string;
  channel:
    | "remove"
    | "add"
    | "edit"
    | "trash"
    | "plus"
    | "pdf"
    | "xlsx"
    | "jpg"
    | "docx"
    | "expandDown"
    | "png"
    | "email"
    | "call"
    | "zalo"
    | "facebook"
    | "sms"
    | "livechat";
}

const index = ({ onCancel, onSave }: Props) => {
  const { t } = useI18n("Eticket_Manager_Split");
  const api: any = useClientgateApi();
  const config = useConfiguration();
  const popupVisible = useAtomValue(popupSplitVisibleAtom);
  const { auth } = useAuth();
  const showError = useSetAtom(showErrorAtom);
  const formRef: any = useRef(null);
  const [formData, setFormData] = useState({});
  const dataRow = useAtomValue(dataRowAtom);
  const navigate = useNetworkNavigate();
  const getIcon = (type: string) => {
    // NONE = 0;
    // EMAIL = 1;
    // CALL = 2;
    // SMS = 3;
    // CHAT = 4;
    // FACEBOOK = 5;
    // ZALO = 6;
    // YOUTUBE = 7;
    // PORTAL = 8;
    return match(type)
      .with("0", () => {
        return "NONE";
      })
      .with("1", () => {
        return "EMAIL";
      })
      .with("2", () => {
        return "CALL";
      })
      .with("3", () => {
        return "SMS";
      })
      .with("4", () => {
        return "livechat"; // CHAT
      })
      .with("5", () => {
        return "FACEBOOK";
      })
      .with("6", () => {
        return "ZALO";
      })
      .with("7", () => {
        return "YOUTUBE";
      })
      .with("8", () => {
        return "PORTAL";
      })
      .otherwise(() => {
        return "NONE";
      });
  };
  const { data, isLoading } = useQuery({
    queryKey: ["GetEticketById", dataRow, popupVisible],
    queryFn: async () => {
      if (popupVisible && dataRow.length) {
        const response = await api.ET_Ticket_GetByTicketID({
          TicketID: dataRow[0]?.TicketID ?? "",
          OrgID: auth.orgData?.Id ?? "",
        });
        if (response.isSuccess) {
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
      }
      return null;
    },
  });

  const handleSave = async () => {
    const formData = formRef.current.instance.option("formData");
    const newData = Object.keys(formData)
      .filter((item) => {
        return formData[item];
      })
      .map((item: string) => {
        return parseFloat(item.split("-")[item.split("-").length - 1]);
      });
    //AutoId-14
    const getData = data?.Lst_ET_TicketMessage.filter((item: any) => {
      return newData.includes(item.AutoId);
    }).map((item: any) => {
      return {
        TicketID: item.TicketID,
        AutoID: item.AutoId,
      };
    });

    const obj = {
      TicketIDRoot: dataRow[0]?.TicketID ?? "",
      OrgID: auth.orgData?.Id ?? "",
      Lst_ET_TicketMessage: getData,
    };

    const response = await api.ET_Ticket_Split(obj);
    if (response.isSuccess) {
      toast.success(t("Split SuccessFully"));
      navigate("/eticket/eticket_manager");
      onCancel();
      onSave?.();
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

  const handleShowIcon = (data: any): string => {
    let type = "email";
    return getIcon(data.ChannelId).toLocaleLowerCase();
  };

  const [formValue, setFormValue] = useState({
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    OrgId: auth.orgData?.Id,
  });

  const dataRender = data ? data.Lst_ET_TicketMessage : [];
  const customize = dataRender.filter((item: any) => {
    return item?.ConvMessageType != "9";
  });

  return (
    <Popup
      className="popup"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={t(`Eticket Split`)}
      width={700}
      height={"auto"}
      visible={popupVisible}
    >
      <LoadPanel
        visible={isLoading}
        showIndicator={true}
        showPane={true}
        container={".popup"}
        shadingColor="rgba(0,0,0,0.4)"
      />
      <div className="tag flex items-center justify-between mb-4">
        <div className="left">
          <p className="strong">
            {dataRow.length &&
              t(`${dataRow[0].TicketName}-${dataRow[0].CustomerCodeSys}`)}
          </p>
        </div>
        <div className="right">{/* <p>{`${dataRow[0].TicketID}`}</p> */}</div>
      </div>
      <p className="mb-2">
        {t("Select one of contents below to transport to new eTickets:")}
      </p>
      <div className="popup-content">
        <Form labelMode="hidden" formData={formData} ref={formRef}>
          {customize.map((item: any, index: number) => {
            let flag: IconName | "eventlog" = "remark";
            let flagIncoming = "";
            if (item.IsIncoming === "0") {
              flagIncoming = "out";
            }
            if (item.IsIncoming === "1") {
              flagIncoming = "in";
            }

            switch (item?.ConvMessageType) {
              // case "1": {
              //   if (item.ChannelId === "0") {
              //     flag = "note";
              //   }
              //   break;
              // }
              // case "9": {
              //   if (item.ChannelId === "0") {
              //     flag = "eventlog";
              //   }
              //   break;
              // }
              case "3": {
                if (item?.ChannelId === "1") {
                  flag = "email" + flagIncoming;
                }
                break;
              }
              case "11": {
                if (item?.ChannelId === "2") {
                  const detail = JSON.parse(item.Detail);
                  if (detail.State === 6) {
                    flag = "call" + flagIncoming;
                  } else {
                    flag = "callmissed" + flagIncoming;
                  }
                }
                break;
              }
              case "8":
              case "10": {
                if (item?.ChannelId === "6") {
                  flag = "zalo" + flagIncoming;
                }
                break;
              }

              default: {
                flag = "remark";
                break;
              }
            }

            return (
              <SimpleItem
                key={index}
                dataField={`${item.AutoId}`}
                name={t("AutoId")}
                editorType="dxCheckBox"
                render={(param) => {
                  const { component: formComponent, dataField } = param;
                  return (
                    <div className="flex items-center justify-space-between">
                      <CheckBox
                        onValueChanged={(e) => {
                          formComponent.updateData(
                            `AutoId-${dataField}`,
                            e.value
                          );
                        }}
                      ></CheckBox>
                      <div className="w-[95%]">
                        <PartMessageItem
                          isHidenButton={true}
                          onGim={() => {}}
                          key={`part-message-item-${index}`}
                          data={item}
                          flag={flag == "remark" ? "note" : flag}
                          refetch={() => {}}
                        />
                      </div>

                      {/* <div
                        className="position-absolute"
                        style={{ top: 0, right: 0 }}
                      >
                        <span className={`message-type ${messageTypeCss}`}>
                          <i></i>
                        </span>
                      </div> */}
                    </div>
                  );
                }}
              />
            );
          })}
        </Form>
      </div>
      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Save")}
          type={"default"}
          stylingMode={"contained"}
          onClick={handleSave}
        />
        <Button
          text={t("Close")}
          stylingMode={"contained"}
          onClick={onCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default index;

export const MessageDesciption = memo(({ value }: any) => {
  const handleConvertMessage = (value: any) => {
    let type1 = "";
    if (value?.ConvMessageType === "1" && value?.ChannelId === "0") {
      type1 = "remark";
    } else if (value?.ConvMessageType === "3" && value?.ChannelId === "1") {
      type1 = "email";
    } else if (
      (value?.ConvMessageType === "8" || value?.ConvMessageType === "10") &&
      value?.ChannelId === "6"
    ) {
      type1 = "zalo";
    } else if (value?.ConvMessageType === "4" && value?.ChannelId === "2") {
      type1 = "call";
    }
    if (type1 === "email" || type1 === "call") {
      return `${type1} ${value.IsIncoming === "1" ? "in" : "out"}`;
    }
    if (type1 == "call") {
      return `${type1} ${value.Call?.Type?.toLocaleLowerCase()}`;
    }
    return <p></p>;
  };

  return handleConvertMessage(value);
});
