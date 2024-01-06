import { useI18n } from "@/i18n/useI18n";
import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { Button } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useMemo } from "react";

import { checkPermision } from "@/components/PermissionContainer";
import { useNetworkNavigate } from "@/packages/hooks";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import {
  FilterItem,
  HeaderFilterPost,
} from "@/packages/ui/headerFilter/HeaderFilter";

interface PropsToolBar {
  data: any[];
  onSetStatus: (title: string, ref: any) => void;
  onDelete: (data: any) => void;
}

export const useToolbar = ({
  data,
  onSetStatus,
  onDelete,
}: PropsToolBar): GridCustomerToolBarItem[] => {
  const windowSize = useWindowSize();
  const nav = useNetworkNavigate();
  // console.log("Post_ManagerSize", windowSize.width);
  const { t } = useI18n("Post_Manager");
  const getValue = useMemo(() => {
    let obj = {
      PUBLISHED: 0,
      DRAFT: 0,
    };

    obj.DRAFT = data.filter((item) => item.PostStatus === "DRAFT").length;
    obj.PUBLISHED = data.filter(
      (item) => item.PostStatus === "PUBLISHED"
    ).length;
    return obj;
  }, [data]);

  const arrayFilter: FilterItem[] = [
    {
      active: true,
      nameField: "LogLUDTimeUTC",
    },
    {
      active: false, // thời gian tạo
      nameField: "CreateDTimeUTC",
    },
  ];

  const listButtonMoreWhenCheck = (ref: any) => {
    const listData = ref?.props?.dataSource;
    const totalPUBLISHED = listData?.filter((itemData: any) => {
      return itemData.PostStatus === "PUBLISHED";
    }).length;
    const totalDRAFT = listData?.filter((itemData: any) => {
      return itemData.PostStatus === "DRAFT";
    }).length;

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
        <DropDownButtonItem
          render={(item: any) => {
            return (
              <Button onClick={() => onSetStatus("All", ref)}>
                {t(`All`)}({listData?.length})
              </Button>
            );
          }}
        />
        <DropDownButtonItem
          render={(item: any) => {
            return (
              <Button onClick={() => onSetStatus("PUBLISHED", ref)}>
                {t(`Published`)}({totalPUBLISHED})
              </Button>
            );
          }}
        />
        <DropDownButtonItem
          render={(item: any) => {
            return (
              <Button onClick={() => onSetStatus("DRAFT", ref)}>
                {t(`Darft`) + `(${totalDRAFT})`}
              </Button>
            );
          }}
        />
      </DropDownButton>
    );
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
      text: " ",
      customerText: (ref: any) => {
        const total = ref?.props?.dataSource.length;
        return t(`All`) + `(${total})`;
      },

      onClick: (e: any, ref: any) => onSetStatus("All", ref),
      shouldShow: (ref: any) => {
        const checkHiden = ref.instance.getSelectedRowsData().length === 1;

        return (windowSize.width > 1100 ?? true) || (checkHiden ?? false);
      },
    },
    {
      text: " ",
      customerText: (ref: any) => {
        const total = ref?.props?.dataSource.filter((itemData: any) => {
          return itemData.PostStatus === "PUBLISHED";
        }).length;

        return t(`Published`) + `(${total})`;
      },

      onClick: (e: any, ref: any) => onSetStatus("PUBLISHED", ref),
      shouldShow: (ref: any) => {
        const checkHiden = ref.instance.getSelectedRowsData().length === 1;

        return (windowSize.width > 1100 ?? true) || (checkHiden ?? false);
      },
    },
    {
      text: " ",
      customerText: (ref: any) => {
        const total = ref?.props?.dataSource.filter((itemData: any) => {
          return itemData.PostStatus === "DRAFT";
        }).length;

        return t(`Darft`) + `(${total})`;
      },

      onClick: (e: any, ref: any) => onSetStatus("DRAFT", ref),
      shouldShow: (ref: any) => {
        const checkHiden = ref.instance.getSelectedRowsData().length === 1;

        return (windowSize.width > 1100 ?? true) || (checkHiden ?? false);
      },
    },

    {
      text: t(`Delete`),
      onClick: (e: any, ref: any) => {
        const listData = ref.instance.getSelectedRowsData();
        onDelete(listData);
      },
      shouldShow: (ref: any) => {
        if (!checkPermision("BTN_ADMIN_CAMPAIGN_POSTMANAGER_DELETE")) {
          return false;
        }

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
      text: t(`Update`),
      onClick: (e: any, ref: any) => {
        const listData = ref.instance.getSelectedRowsData();
        nav(`/admin/Post_Edit/${listData[0].PostCode}`);
      },
      shouldShow: (ref: any) => {
        if (!checkPermision("BTN_ADMIN_CAMPAIGN_POSTMANAGER_UPADTE")) {
          return false;
        }

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
      text: "",
      onClick: () => {},
      shouldShow: (ref: any) => {
        return windowSize.width < 1100 ?? true;
      },
      widget: "customize",
      customize: (ref: any) => listButtonMoreWhenCheck(ref),
    },
  ];
};
