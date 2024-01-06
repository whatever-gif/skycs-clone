import { ET_TicketMessage } from "@/packages/types";
import { Button, Popup, ScrollView } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import React from "react";
import { PartMessageItem } from "../part-message-item";
import { IconName } from "@/packages/ui/icons";
import "./style.scss";

interface Props {
  onClose: () => void;
  data: ET_TicketMessage[];
}

const PopupAnotherPin = ({ onClose, data }: Props) => {
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
        {data.map((item: any, idx: number) => {
          let flag: IconName | "eventlog" = "remark";
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
                flag = "email";
              }
              break;
            }
            case "4": {
              if (item?.ChannelId === "2") {
                flag = "call";
              }
              break;
            }
            case "8":
            case "10": {
              if (item?.ChannelId === "6") {
                flag = "zalo";
              }
              break;
            }

            default: {
              flag = "remark";
              break;
            }
          }

          return (
            <PartMessageItem
              isHidenButton={true}
              data={item}
              flag={flag}
              key={`part-message-item-${idx}`}
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
