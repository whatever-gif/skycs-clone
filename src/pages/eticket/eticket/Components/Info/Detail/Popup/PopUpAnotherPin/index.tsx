import { ET_TicketMessage } from "@/packages/types";
import { Button, Popup, ScrollView } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import React from "react";
import { IconName } from "@/packages/ui/icons";
import "./style.scss";
import { PartMessageItem } from "../../part-message-item";

interface Props {
  onClose: () => void;
  data: ET_TicketMessage[];
  onGim: any;
}

const PopupAnotherPin = ({ onClose, data, onGim }: Props) => {
  const handleCancel = () => {
    onClose();
  };

  return (
    <Popup
      position={"center"}
      showCloseButton={true}
      onHiding={handleCancel}
      className="popup-pin"
      title={`Popup Pin`}
      visible={true}
    >
      <ScrollView width={"100%"}>
        {data?.map((item: any, idx: number) => {
          let flag: IconName | "eventlog" = "remark";
          let flagIncoming = "";

          if (item.IsIncoming === "0") {
            flagIncoming = "out";
          }
          if (item.IsIncoming === "1") {
            flagIncoming = "in";
          }

          switch (item?.ConvMessageType) {
            case "1": {
              if (item.ChannelId === "0") {
                flag = "note";
              }
              break;
            }
            case "9": {
              if (item.ChannelId === "0") {
                flag = "eventlog";
              }
              break;
            }
            case "3": {
              if (item?.ChannelId === "1") {
                flag = "email" + flagIncoming;
              }
              break;
            }
            case "11": {
              if (item?.ChannelId === "2") {
                flag = "call";
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
          // console.log("item ", item, "flag ", flag);
          return (
            <PartMessageItem
              key={`part-message-item-${idx}`}
              data={item}
              flag={flag}
              onGim={onGim}
            />
          );
        })}
      </ScrollView>
      <ToolbarItem toolbar={"bottom"} location={"center"}>
        <Button
          text={"Cancel"}
          stylingMode={"outlined"}
          type={"normal"}
          onClick={handleCancel}
          className={"mx-2 w-[100px]"}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default PopupAnotherPin;
