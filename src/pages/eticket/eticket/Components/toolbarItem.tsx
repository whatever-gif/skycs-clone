import { compareDates, getDateNow } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { useNetworkNavigate } from "@/packages/hooks";
import { permissionAtom } from "@/packages/store";
import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { Button } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useAtomValue } from "jotai";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import {
  FilterItem,
  HeaderFilterPost,
} from "../../../../packages/ui/headerFilter/HeaderFilter";
import { statusToolbarAtom } from "./store";

interface PropsToolBar {
  data: any[];
  onClose: (data: ETICKET_REPONSE[]) => void;
  onDelete: (data: ETICKET_REPONSE[]) => void;
  onSetStatus: (title: string, ref: any) => void;
  onShowPopUp: (title: string, data: ETICKET_REPONSE[]) => void;
  dataUser: any;
  onExportExcel: any;
}

interface DropDownInferface {
  title: string;
  onclick: any;
  permision: string;
}

export const useToolbar = ({
  data,
  onClose,
  onDelete,
  onSetStatus,
  onExportExcel,
  onShowPopUp,
  dataUser,
}: PropsToolBar): GridCustomerToolBarItem[] => {
  const { t } = useI18n("Eticket_Manager_toolbar");
  const navigate = useNetworkNavigate();
  const permissionStore = useAtomValue(permissionAtom);
  const statusToolbar = useAtomValue(statusToolbarAtom);
  const [formData, setFormData] = useState({
    sortByField: [],
  });
  const checkPermision = (permission: string) => {
    return permissionStore.buttons?.includes(permission) ?? false;
  };

  const getValue = useMemo(() => {
    let obj = {
      NEW: 0,
      OPEN: 0,
      PROCESSING: 0,
      ONHOLD: 0,
      WATINGONCUSTOMER: 0,
      WAITINGONTHIRDPARTY: 0,
      SOLVED: 0,
      CLOSED: 0,
      OutOfDate: 0,
      Responsibility: 0,
    };

    obj.OPEN = data.filter((item) => item.TicketStatus === "OPEN").length;
    obj.PROCESSING = data.filter(
      (item) => item.TicketStatus === "PROCESS"
    ).length;
    obj.NEW = data.filter((item) => item.TicketStatus === "NEW").length;
    obj.ONHOLD = data.filter((item) => item.TicketStatus === "ON-HOLD").length;
    obj.WATINGONCUSTOMER = data.filter(
      (item) => item.TicketStatus === "WATING ON CUSTOMER"
    ).length;
    obj.WAITINGONTHIRDPARTY = data.filter(
      (item) => item.TicketStatus === "WAITING ON THIRD PARTY"
    ).length;
    obj.SOLVED = data.filter((item) => item.TicketStatus === "SOLVED").length;
    obj.CLOSED = data.filter((item) => item.TicketStatus === "CLOSED").length;
    obj.ONHOLD = data.filter((item) => !item.AgentCode).length;
    obj.OutOfDate = data.filter((item) => {
      return (
        compareDates(getDateNow(), item.TicketDeadline) &&
        item.TicketStatus !== "OPEN"
      );
    }).length;
    obj.Responsibility = data.filter((item) => {
      if (dataUser && item.AgentCode) {
        return item.AgentCode === dataUser.UserCode.toUpperCase()! ?? "";
      }
      return false;
    }).length;
    return obj;
  }, [data]);

  const listCheckOne: DropDownInferface[] = [
    {
      permision: "BTN_ETICKET_LIST_MORE_DETACHED",
      title: t("Split"),
      onclick: (data: ETICKET_REPONSE[]): any => onShowPopUp("Split", data),
    },
    {
      permision: "BTN_ETICKET_LIST_MORE_CHUYEN_PHU_TRACH",
      title: t("UpdateAgentCode"),
      onclick: (data: ETICKET_REPONSE[]): any =>
        onShowPopUp("UpdateAgentCode", data),
    },
    {
      permision: "BTN_ETICKET_LIST_MORE_CHUYEN_KHACH_HANG",
      title: t("UpdateCustomer"),
      onclick: (data: ETICKET_REPONSE[]): any =>
        onShowPopUp("UpdateCustomer", data),
    },
    // {
    //   permision: "BTN_ETICKET_LIST_MORE_WORKFLOW",
    //   title: t("Workflow"),
    //   onclick: (data: ETICKET_REPONSE[]): any => {},
    // },
    // {
    //   permision: "BTN_ETICKET_LIST_MORE_DANH_GIA",
    //   title: t("Rating"),
    //   onclick: (data: ETICKET_REPONSE[]): any => {},
    // },
  ];

  const listCheckMulti: DropDownInferface[] = [
    {
      permision: "BTN_ETICKET_LIST_MORE_CLOSE",
      title: t("Closed"),
      onclick: onClose,
    },
  ];

  const listButtonMoreWhenCheck = (ref: any) => {
    const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
    const count = ref.instance.getSelectedRowsData().length;
    let arr: DropDownInferface[] = [];
    if (count === 1) {
      arr = [...listCheckOne, ...listCheckMulti];
    }
    if (count > 1) {
      arr = [...listCheckMulti].filter((item) => item.title !== "Closed");
    }

    arr.filter((item: DropDownInferface) => {
      return checkPermision(item.permision);
    });

    return (
      <DropDownButton
        showArrowIcon={false}
        keyExpr={"id"}
        className="menu-items"
        displayExpr={"text"}
        wrapItemText={false}
        dropDownOptions={{
          width: 150,
          wrapperAttr: {
            class: "headerform__menuitems",
          },
        }}
        icon="/images/icons/more.svg"
      >
        {arr.map((item: DropDownInferface) => {
          return (
            <DropDownButtonItem
              key={nanoid()}
              // onClick={item.onclick(listData)}
              // text={`$`}
              render={(itemRe: any) => {
                return (
                  <Button onClick={() => item.onclick(listData)}>
                    {t(`${item.title}`)}
                  </Button>
                );
              }}
            />
          );
        })}
      </DropDownButton>
    );
  };
  const arrayFilter: FilterItem[] = [
    {
      active: true, // thời gian cập nhật
      nameField: "LogLUDTimeUTC",
    },
    {
      active: false, // thời gian tạo
      nameField: "CreateDTimeUTC",
    },
    {
      active: false, // DeadLine
      nameField: "TicketDeadline",
    },
    {
      active: false, // trạng thái
      nameField: "AgentTicketStatusName",
    },
    {
      active: false, // mức ưu tiên
      nameField: "AgentTicketPriorityName",
    },
  ];

  // Phản hồi, Ghi chú nội bộ 1
  // Tách 1
  // Chuyển phụ trách 1
  // Đóng m
  // Workflow 1
  // Đánh giá 1
  // Export Excel

  const tF = (a: number) => {
    return ` (${a})`;
  };

  return [
    {
      text: "",
      onClick: () => {},
      shouldShow: (ref: any) => {
        return true;
      },
      widget: "customize",
      customize: (ref: any) => (
        <div className="px-1">
          <FilterDropdown
            buttonTemplate={<img src="/images/icons/filterHeader.png" />}
            genFilterFunction={
              <HeaderFilterPost ref={ref} t={t} listFilter={arrayFilter} />
            }
          />
        </div>
      ),
    },
    {
      // text: t(`Responsibility`) + `(${getValue.Responsibility})`,
      text: t(`Responsibility`),
      customerText: (ref: any) => {
        const total = ref?.props?.dataSource.filter((itemData: any) => {
          return itemData.AgentCode === dataUser?.UserCode.toUpperCase();
        }).length;

        return t(`Responsibility`) + tF(total);
      },
      // text: t(`Responsibility`),
      onClick: (e: any, ref: any) => {
        onSetStatus("Responsibility", ref);
      },
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length < 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      // text: t(`Open`) + `(${getValue.OPEN})`,
      text: t(`Open`) + " " + "(" + statusToolbar.OPEN + ")",
      customerText: (ref: any) => {
        const total = ref?.props?.dataSource.filter((itemData: any) => {
          return itemData.TicketStatus === "OPEN";
        }).length;

        return t(`Open`) + tF(total);
      },
      // text: t(`Open`),
      onClick: (e: any, ref: any) => {
        onSetStatus("Open", ref);
      },
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length < 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    // {
    //   // text: t(`OutOfDate`) + `(${getValue.OutOfDate})`,
    //   text: t(`Quá hạn`),
    //   onClick: (e: any, ref: any) => onSetStatus("OutOfDate", ref),
    //   shouldShow: (ref: any) => {
    //     let check = false;
    //     if (ref) {
    //       if (ref.instance.getSelectedRowsData().length < 1) {
    //         check = true;
    //       }
    //       return check;
    //     } else {
    //       return false;
    //     }
    //   },
    // },
    // {
    //   // text: t(`Follower`) + `(${getValue.Responsibility})`,
    //   text: t(`Follower`),
    //   onClick: (e: any, ref: any) => onSetStatus("Follower", ref),
    //   shouldShow: (ref: any) => {
    //     let check = false;
    //     if (ref) {
    //       if (ref.instance.getSelectedRowsData().length < 1) {
    //         check = true;
    //       }
    //       return check;
    //     } else {
    //       return false;
    //     }
    //   },
    // },
    {
      text: t(`All`),
      onClick: (e: any, ref: any) => onSetStatus("All", ref),
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length < 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`response`),
      permissionCode: "BTN_ETICKET_LIST_REPLY",
      onClick: (e: any, ref: any) => {
        const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
        onShowPopUp("response", listData);
      },
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length === 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Update`),
      permissionCode: "BTN_ETICKET_LIST_EDIT",
      onClick: (e: any, ref: any) => {
        const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
        navigate(`/eticket/edit/${listData[0].TicketID}`);
      },
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length === 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Merge`),
      permissionCode: "BTN_ETICKET_LIST_MERGE",
      onClick: (e: any, ref: any) => {
        const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
        onShowPopUp("Merge", listData);
      },
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length > 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Delete`),
      permissionCode: "BTN_ETICKET_LIST_DELETE",
      onClick: (e: any, ref: any) => {
        const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
        onDelete(listData);
      },
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length > 0) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: t(`Close`),
      customerText: (ref: any) => {
        const total = ref?.props?.dataSource.filter((itemData: any) => {
          return (
            itemData.TicketStatus === "CLOSED" ||
            itemData.TicketStatus === "RESOLVED"
          );
        }).length;

        return t(`Close`) + tF(total);
      },
      permissionCode: "BTN_ETICKET_LIST_CLOSE",
      onClick: (e: any, ref: any) => {
        const listData: ETICKET_REPONSE[] = ref.instance.getSelectedRowsData();
        onClose(listData);
      },
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length > 1) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
    {
      text: "",
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length === 0) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
      widget: "customize",
      customize: (ref: any) => (
        <DropDownButton
          showArrowIcon={false}
          keyExpr={"id"}
          className="menu-items"
          displayExpr={"text"}
          wrapItemText={false}
          dropDownOptions={{
            width: 150,
            wrapperAttr: {
              class: "headerform__menuitems",
            },
          }}
          icon="/images/icons/more.svg"
        >
          <DropDownButtonItem
            render={(item: any) => {
              const total = ref?.props?.dataSource.filter(function (
                itemData: any
              ) {
                const create = itemData.CreateBy ?? "";
                return (
                  create.toLowerCase() === dataUser?.UserCode.toLowerCase()
                );
              }).length;
              return (
                <Button onClick={() => onSetStatus("ONHOLD", ref)}>
                  {t(`ONHOLD`) + tF(total)}
                </Button>
              );
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              const total = ref?.props?.dataSource.filter(function (
                itemData: any
              ) {
                const text = itemData?.ListFollowerAgentCode ?? "";
                const arr = text.split(",").map((i: string) => i.toLowerCase());
                return arr.includes(dataUser?.UserCode.toLowerCase());
              }).length;
              return (
                <Button onClick={() => onSetStatus("Follower", ref)}>
                  {/* {t(`Follower`) + `(${getValue.Responsibility})`} */}
                  {t(`Follower`) + tF(total)}
                </Button>
              );
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              const total = ref?.props?.dataSource.filter(function (
                itemData: any
              ) {
                return (
                  compareDates(getDateNow(), itemData.TicketDeadline) &&
                  itemData.TicketStatus !== "CLOSED"
                );
              }).length;
              return (
                <Button onClick={() => onSetStatus("OutOfDate", ref)}>
                  {/* {t(`OutOfDate`) + `(${getValue.OutOfDate})`} */}
                  {t(`OutOfDate`) + tF(total)}
                </Button>
              );
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              const total = ref?.props?.dataSource.filter(function (
                itemData: any
              ) {
                return (
                  itemData.TicketStatus === "CLOSED" ||
                  itemData.TicketStatus === "RESOLVED"
                );
              }).length;
              return (
                <Button onClick={() => onSetStatus("Closed", ref)}>
                  {/* {t(`Solved`) + `(${getValue.CLOSED})`} */}
                  {t(`Solved`) + tF(total)}
                </Button>
              );
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              // đang xử lý
              const total = ref?.props?.dataSource.filter(function (
                itemData: any
              ) {
                return itemData.TicketStatus === "PROCESSING";
              }).length;
              return (
                <Button onClick={() => onSetStatus("Process", ref)}>
                  {/* {t(`Process`) + `(${getValue.PROCESSING})`} */}
                  {t(`Process`) + tF(total)}
                </Button>
              );
            }}
          />
        </DropDownButton>
      ),
    },
    {
      text: "",
      onClick: () => {},
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (
            ref.instance.getSelectedRowsData().length > 0 &&
            ref.instance.getSelectedRowsData().length < 2
          ) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
      widget: "customize",
      customize: (ref: any) => listButtonMoreWhenCheck(ref),
    },
  ];
};
