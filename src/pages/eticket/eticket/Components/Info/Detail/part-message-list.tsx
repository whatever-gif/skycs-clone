import { EticketT } from "@/packages/types";
import { IconName } from "@/packages/ui/icons";
import { memo } from "react";
import { PartMessageItem } from "./part-message-item";

export const PartMessageList = memo(
  ({
    data,
    value,
    onGim,
    refetch,
  }: {
    data: EticketT;
    value: any[];
    onGim: any;
    refetch: () => void;
  }) => {
    return (
      <div className={"w-full pt-3 pb-3 pl-3 pr-3 message-list"}>
        {value?.map((item: any, idx: number) => {
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
            <PartMessageItem
              onGim={onGim}
              key={`part-message-item-${idx}`}
              data={item}
              flag={flag}
              refetch={refetch}
            />
          );
        })}
      </div>
    );
  }
);
