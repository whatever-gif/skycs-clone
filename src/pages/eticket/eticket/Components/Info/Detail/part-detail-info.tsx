import { defaultAvatar } from "@/components/fields/AvatarField";
import { splitString } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { showErrorAtom } from "@/packages/store";
import { EticketT } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DateBox, ScrollView, Tabs } from "devextreme-react";
import { useSetAtom } from "jotai";
import { ReactNode, memo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import "./style.scss";
export const PartDetailInfo = memo(
  ({ data, dataDynamicField }: { data: EticketT; dataDynamicField: any[] }) => {
    const windowSize = useWindowSize();
    const showError = useSetAtom(showErrorAtom);
    const scrollHeight = windowSize.height - 100;
    const { t } = useI18n("PartDetailInfo");
    const { auth } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const {
      Lst_ET_Ticket,
      Lst_ET_TicketAttachFile,
      Lst_ET_TicketCustomer,
      Lst_ET_TicketFollower,
      Lst_ET_TicketMessage,
      Lst_ET_TicketHO,
    }: any = data;

    const dataRender = [
      ...Lst_ET_TicketCustomer,
      ...Lst_ET_Ticket,
      {
        Follower: [...Lst_ET_TicketFollower],
      },
    ];

    const dataRenderHO = [
      ...Lst_ET_Ticket,
      ...(Array.isArray(Lst_ET_TicketHO) ? Lst_ET_TicketHO : []),
      {
        Follower: [...Lst_ET_TicketFollower],
      },
    ];

    const flatArr = dataRender.reduce((acc, item) => {
      return {
        ...acc,
        ...item,
      };
    }, {});

    const flatArrHO = dataRenderHO.reduce((acc, item) => {
      return {
        ...acc,
        ...item,
      };
    }, {});

    const listField = [
      "AgentName", // Agent phụ trách
      "TicketDeadline", // Deadline
      "AgentTicketPriorityName", // Mức ưu tiên
      "TicketJsonInfo", // Thông tin động của eTicket
      "NNTFullName", // Chi nhánh/ đại lý phụ trách
      "DepartmentName", // Phòng ban
      "AgentTicketCustomTypeName", // Phân loại tùy chọn
      "AgentTicketSourceName", // Nguồn
      "ReceptionDTimeUTC", // thời điểm tiếp nhận
      "AgentReceptionChannelName", // Kênh tiếp nhận
      "SLALevel", // SLA
      "Tags", // Tags
      "Follower", // Người theo dõi
      "CreateBy", // Người tạo
      "CreateDTimeUTC", //Thời gian tạo
      "LogLUBy", // Người cập nhật cuối cùng
      "LogLUDTimeUTC", // Thời gian cập nhật cuối cùng
      "RemindWork", // Nhắc việc
      "RemindDTimeUTC", // Vào lúc
    ];

    const newValue = listField.map((item) => {
      if (`${item}` === "TicketJsonInfo") {
        if (flatArr[item]) {
          const parsed: any = JSON.parse(flatArr[item] ?? "[]");
          if (Array.isArray(parsed)) {
            const result = parsed
              ?.filter((c: any) => Object.keys(c).length > 0)
              ?.map((item: any) => {
                const key = Object.keys(item)?.[0];
                const value = Object.values(item)?.[0];

                const find = dataDynamicField?.find(
                  (_: any) => _.TicketColCfgCodeSys == key
                );

                if (find) {
                  return {
                    TicketColCfgName: find?.TicketColCfgName,
                    type: find?.TicketColCfgDataType,
                    value: value,
                  };
                }

                return item;
              });

            return { TicketJsonInfo: result };
          } else {
            const resultArray = [];

            for (const key in parsed) {
              if (parsed.hasOwnProperty(key)) {
                const obj = {
                  [key]: parsed[key],
                };
                resultArray.push(obj);
              }
            }

            const result = resultArray
              ?.filter((c: any) => Object.keys(c).length > 0)
              ?.map((item: any) => {
                const key = Object.keys(item)?.[0];
                const value = Object.values(item)?.[0];

                const find = dataDynamicField?.find(
                  (_: any) => _.TicketColCfgCodeSys == key
                );

                if (find) {
                  return {
                    TicketColCfgName: find?.TicketColCfgName,
                    type: find?.TicketColCfgDataType,
                    value: value,
                  };
                }

                return item;
              });

            return { TicketJsonInfo: result };
          }
        }
      }
      return {
        [`${item}`]: flatArr[item],
      };
    });

    const customizeFunction = (data: any) => {
      const customizeValue = data.reduce((acc: any[], item: any) => {
        if (
          Object.keys(item)[0] === "TicketJsonInfo" &&
          Object.values(item)[0]
        ) {
          return [...acc, ...item.TicketJsonInfo];
        }
        return [...acc, item];
      }, []);

      return customizeValue;
    };

    const newValueHO = listField.map((item) => {
      if (`${item}` === "TicketJsonInfo") {
        if (flatArrHO[item]) {
          const parsed: any = JSON.parse(flatArrHO[item] ?? "[]");
          if (Array.isArray(parsed)) {
            const result = parsed
              ?.filter((c: any) => Object.keys(c).length > 0)
              ?.map((item: any) => {
                const key = Object.keys(item)?.[0];
                const value = Object.values(item)?.[0];

                const find = dataDynamicField?.find(
                  (_: any) => _.TicketColCfgCodeSys == key
                );

                if (find) {
                  return {
                    TicketColCfgName: find?.TicketColCfgName,
                    type: find?.TicketColCfgDataType,
                    value: value,
                  };
                }

                return item;
              });

            return { TicketJsonInfo: result };
          } else {
            const resultArray = [];

            for (const key in parsed) {
              if (parsed.hasOwnProperty(key)) {
                const obj = {
                  [key]: parsed[key],
                };
                resultArray.push(obj);
              }
            }

            const result = resultArray
              ?.filter((c: any) => Object.keys(c).length > 0)
              ?.map((item: any) => {
                const key = Object.keys(item)?.[0];
                const value = Object.values(item)?.[0];

                const find = dataDynamicField?.find(
                  (_: any) => _.TicketColCfgCodeSys == key
                );

                if (find) {
                  return {
                    TicketColCfgName: find?.TicketColCfgName,
                    type: find?.TicketColCfgDataType,
                    value: value,
                  };
                }

                return item;
              });

            return { TicketJsonInfo: result };
          }
        }
      }
      return {
        [`${item}`]: flatArrHO[item],
      };
    });

    const TagList = (tags: string) => {
      var list = tags.split(",");
      if (!list) list = [];
      if (list.length > 3) {
        list = [...[...list].splice(0, 3), `+${list.length - 3}`];
      }
      return (
        <div className="flex tag-list">
          {list.map((item, idx) => {
            return (
              <span key={idx} className={`tag ml-1`}>
                {item}
              </span>
            );
          })}
        </div>
      );
    };

    const Items = [
      {
        id: 0,
        text: "Đơn vị xử lý",
        component: (
          <ScrollView style={{ maxHeight: scrollHeight - 10, height: "100%" }}>
            <div className="w-full">
              <Content_Component
                ticket={Lst_ET_Ticket}
                data={customizeFunction(newValue)}
                TagList={TagList}
              />
            </div>
          </ScrollView>
        ),
      },
      {
        id: 1,
        text: "HO",
        component: (
          <ScrollView style={{ maxHeight: scrollHeight - 10, height: "100%" }}>
            <div className="w-full">
              <Content_Component
                ticket={Lst_ET_Ticket}
                data={customizeFunction(newValueHO)}
                TagList={TagList}
              />
            </div>
          </ScrollView>
        ),
      },
    ].filter((item) => {
      if (Lst_ET_TicketHO?.length === 0) {
        return item.id === 0;
      } else {
        return item;
      }
    });

    const currentComponent = Items.find(
      (item: any) => item.id === currentIndex
    )?.component;

    return (
      <>
        <div
          className={
            "w-full pt-0 sep-bottom-1 tab-ctn-1 bg-white eticket-nav-right shadow-md"
          }
        >
          <Tabs
            className={`show-${Items.length}`}
            selectedIndex={currentIndex}
            dataSource={Items}
            onItemClick={(value: any) => {
              setCurrentIndex(value.itemIndex);
            }}
          />

          {currentComponent}
        </div>
      </>
    );
  }
);

interface Props {
  ticket: any;
  data: any;
  TagList: (t: string) => ReactNode;
}

export const Content_Component = memo(({ ticket, data, TagList }: Props) => {
  const { t } = useI18n("PartDetailInfo");

  const { t: common } = useI18n("Common");

  const { t: e } = useI18n("ErrorMessage");

  const showError = useSetAtom(showErrorAtom);

  const api = useClientgateApi();

  const { data: listTag } = useQuery(["listTags"], async () => {
    const resp: any = await api.Mst_Tag_GetAllActive();

    return resp?.Data?.Lst_Mst_Tag ?? [];
  });

  const { data: followList } = useQuery(["followList"], async () => {
    const resp: any = await api.Sys_User_GetAllActive();

    const data =
      resp?.DataList?.map((item: any) => {
        return {
          ...item,
          UserCode: item?.UserCode?.toUpperCase(),
        };
      }) ?? [];

    return data;
  });

  const handleUpdateTicketDeadline = async (item: any, value: any) => {
    const resp: any = await api.ETTicket_UpdateDeadline({
      TicketID: item?.[0].TicketID,
      TicketDeadline: format(value, "yyyy-MM-dd HH:mm:ss").toString(),
    });

    if (resp?.isSuccess) {
      toast.success(common("Update time successfully!"));
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
    <div className="flex flex-column eticket-nav-right">
      {data.map((item: any, index: number) => {
        const text: any = Object.values(data[index])[0] ?? "";
        const field = Object.keys(data[index])[0];
        const textType = [
          "TEXT",
          "TEXTAREA",
          "URL",
          "NUMBER",
          "DATE",
          "DATETIME",
          "DECIMAL",
          "PASSWORD",
          "PERCENT",
          "INT",
          "MASTERDATASELECTMULTIPLE",
          "MASTERDATA",
          "SELECTONERADIO",
        ];

        if (item?.type) {
          // các trường động
          if (textType.includes(item.type)) {
            const longTextCss = match(item.type)
              .with("TEXT", () => "w-[200px]")
              .with("TEXTAREA", () => "w-[200px]")
              .with("URL", () => "w-[200px]")

              .otherwise(() => "");

            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left ">
                  {t(item.TicketColCfgName)}
                </span>
                <span
                  className={`float-right part-detail-info-value ${longTextCss}`}
                >
                  {String(item.value) ?? "--"}
                </span>
              </div>
            );
          }
          if (item.type == "SELECTMULTIPLEDROPDOWN") {
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left ">
                  {t(item.TicketColCfgName)}
                </span>
                <span className="float-right part-detail-info-value ">
                  {item?.value && item?.value?.length > 0
                    ? String(item?.value)
                    : "--"}
                </span>
              </div>
            );
          }
          if (item.type == "SELECTMULTIPLESELECTBOX") {
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left">
                  {t(item.TicketColCfgName)}
                </span>
                <span className="float-right part-detail-info-value">
                  {item?.value && item?.value?.length > 0
                    ? String(
                        item.value
                          ?.filter((c: any) => c?.IsSelected)
                          ?.map((c: any) => c?.Value)
                      )
                    : "--"}
                </span>
              </div>
            );
          }
          if (item.type === "URL") {
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left ">
                  {t(item.TicketColCfgName)}
                </span>
                <Link to={item.value ?? ""} className="float-right w-[200px]">
                  {splitString(item.value, 50)}
                </Link>
              </div>
            );
          }

          return (
            <div
              className="w-full p-1 pl-3 pr-3 flex justify-space-between"
              key={index}
            >
              <span className="eticket-nav-right__text-left text-gray float-left ">
                {t(item.TicketColCfgName)}
              </span>
              <span className="float-right part-detail-info-value ">
                {item.value ? item.value.toString() : "--"}
              </span>
            </div>
          );
        } else {
          if (typeof text === "string" || typeof text === "number") {
            if (field === "Tags" && typeof text === "string") {
              const tags = text.split(",");

              // const result = tags.map((item: any) => {
              //   return (
              //     listTag?.find((c: any) => c?.TagID == item)?.TagName ?? ""
              //   );
              // });

              return (
                <div
                  className="w-full p-1 pl-3 pr-3 flex justify-space-between"
                  key={index}
                >
                  <span className="eticket-nav-right__text-left text-gray">
                    {t(field)}
                  </span>
                  <span className="flex tag-list gap-1 flex-wrap w-[250px] justify-end">
                    {text && tags?.length > 0
                      ? tags.map((item: any, idx: any) => {
                          return (
                            <span key={idx} className={`tag`}>
                              {item}
                            </span>
                          );
                        })
                      : "--"}
                  </span>
                </div>
              );
            }

            if (!item.caption) {
              // các trường tĩnh

              const result = Object.keys(item);

              if (result?.[0] == "TicketDeadline") {
                const result = text ? new Date(text) : new Date();

                return (
                  <div
                    className="w-full p-1 pl-3 pr-3 flex justify-between"
                    key={index}
                  >
                    <span className="eticket-nav-right__text-left text-gray float-left">
                      {t(field)}
                    </span>
                    <span className="flex justify-end text-[#0e223d] font-semibold w-[180px] text-right break-words">
                      <DateBox
                        width={200}
                        displayFormat="yyyy-MM-dd HH:mm:ss"
                        defaultValue={result}
                        type="datetime"
                        onValueChanged={(e: any) => {
                          console.log("e.value ", e.value, "text ", text);
                          if (e.value !== text) {
                            handleUpdateTicketDeadline(ticket, e.value);
                          }
                        }}
                      />
                    </span>
                  </div>
                );
              }

              return (
                <div
                  className="w-full p-1 pl-3 pr-3 flex justify-between"
                  key={index}
                >
                  <span className="eticket-nav-right__text-left text-gray float-left">
                    {t(field)}
                  </span>
                  <span className="flex justify-end text-[#0e223d] font-semibold w-[180px] text-right break-words">
                    {text ? `${splitString(text.toString(), 100)}` : "--"}
                  </span>
                </div>
              );
            }
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left">
                  {t(item.caption)}
                </span>
                <span className="float-right part-detail-info-value">
                  {item.value ? item.value : "--"}
                </span>
              </div>
            );
          } else {
            if (!text) {
              return (
                <div
                  className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                  key={index}
                >
                  <span className="eticket-nav-right__text-left text-gray float-left">
                    {t(field)}
                  </span>
                  <span className="float-right part-detail-info-value">--</span>
                </div>
              );
            }
            if (field === "Follower") {
              return (
                <div
                  className="w-full p-1 pl-3 pr-3 flex justify-between"
                  key={index}
                >
                  <span className="eticket-nav-right__text-left text-gray float-left">
                    {t(field)}
                  </span>
                  <div className="w-[200px] flex flex-wrap justify-end gap-1">
                    {text.map((itemFollower: any, index: number) => {
                      const result = followList?.find(
                        (c: any) => c?.UserCode == itemFollower?.AgentCode
                      );

                      return (
                        <div
                          key={`box-follower-${index}`}
                          className="bg-[#EAF9F2] flex items-center gap-1 p-[5px] rounded-[5px]"
                        >
                          <img
                            src={
                              result?.Avatar ? result?.Avatar : defaultAvatar
                            }
                            className="w-[24px] h-[24px] rounded-[50%] shadow-md "
                          />
                          <div className="text-[#0e223d] font-semibold">
                            {result?.UserName}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return (
              <div
                className="w-full p-1 pl-3 pr-3 flex justify-space-between flex-wrap"
                key={index}
              >
                <span className="eticket-nav-right__text-left text-gray float-left">
                  {t(field)}
                </span>
                <span className="float-right part-detail-info-value">--</span>
              </div>
            );
          }
        }
      })}
    </div>
  );
});
