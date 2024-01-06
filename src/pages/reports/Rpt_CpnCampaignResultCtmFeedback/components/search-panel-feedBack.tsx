import { useI18n } from "@/i18n/useI18n";
import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import { useConfiguration, useVisibilityControl } from "@packages/hooks";
import { useWindowSize } from "@packages/hooks/useWindowSize";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { useSavedState } from "@packages/ui/base-gridview/components/use-saved-state";
import CustomColumnChooser from "@packages/ui/column-toggler/custom-column-chooser";
import {
  Button,
  DateRangeBox,
  LoadPanel
} from "devextreme-react";
import Form, { IItemProps, Item } from "devextreme-react/form";
import { useAtom, useSetAtom } from "jotai";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { useAtomValue } from "jotai";

import PermissionContainer from "@/components/PermissionContainer";
import { useClientgateApi } from "@/packages/api";
import { FlagActiveEnum } from "@/packages/types";
import { Header } from "@/packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { dataCampainAtom } from "./store";

interface ItemProps extends IItemProps {
  order?: number;
}

interface SearchPanelProps {
  data?: any;
  onSearch?: (data: any) => void;
  storeKey: string;
  colCount?: number;
  enableColumnToggler?: boolean;
}

export const SearchPanelFeedBack = ({
  data,
  onSearch,
  storeKey,
  colCount = 1,
  enableColumnToggler = true,
}: SearchPanelProps) => {
  const { t } = useI18n("RptCpnCampaignResultCtmFeedback-search");
  const { loadState, saveState } = useSavedState<ColumnOptions[]>({
    storeKey: `search-panel-settings-${storeKey}`,
  });
  const api = useClientgateApi();
  const config = useConfiguration();
  const [searchConditionListType, setSearchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    CampaignTypeName: "",
    CampaignTypeDesc: "",
  });
  const { data: listMst_CampaignType } = useQuery(
    ["listMst_CampaignType"],
    () =>
      api.Mst_CampaignType_Search({
        ...searchConditionListType,
      })
  );
  const now = new Date();
  const endDate = new Date(now.getTime());
  // Lấy năm hiện tại
  var currentYear = now.getFullYear();

  // Tạo một đối tượng Date mới với ngày đầu tiên của năm
  var firstDayOfYear = new Date(currentYear, 0, 1);
  const [dataCampain, setDataCampain] = useAtom(dataCampainAtom);
  const formItems = [
    {
      dataField: "MonthReport",
      visible: true,
      caption: t("MonthReport"),
      label: {
        text: t("Time create"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {
        type: "date",
        displayFormat: "yyyy-MM-dd",
      },
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <DateRangeBox
            displayFormat=" yyyy-MM-dd"
            defaultStartDate={
              data?.MonthReport[0] || format(firstDayOfYear, "yyyy-MM-dd")
            }
            defaultEndDate={data?.MonthReport[1] || endDate}
            showClearButton={true}
            useMaskBehavior={true}
            openOnFieldClick={true}
            labelMode="hidden"
            onValueChanged={(e: any) => {
              formRef.instance().updateData("MonthReport", e.value);
            }}
          />
        );
      },
    },
    {
      caption: t("CampaignTypeCode"),
      dataField: "CampaignTypeCode",
      label: {
        text: t("CampaignType"),
      },
      visible: true,
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: listMst_CampaignType?.DataList ?? [],
        displayExpr: "CampaignTypeName",
        valueExpr: "CampaignTypeCode",
        placeholder: t("Input"),
        searchEnabled: true,
        onValueChanged: async (e: any) => {
          const resp = await api.CpnCampaign_GetByCode(e.value);
          if (resp.isSuccess) {
            setDataCampain(resp.Data);
          }
        },
      },
    },
    {
      caption: t("CampaignCodeConditionList"),
      dataField: "CampaignCodeConditionList",
      label: {
        text: t("Campaign"),
      },
      visible: true,
      editorType: "dxTagBox",
      editorOptions: {},
      // render: () => {
      //   return (
      //     <TagBox
      //       dataSource={dataCampain?.length}
      //       valueExpr={"CampaignCode"}
      //       displayExpr={"CampaignName"}
      //     />
      //   );
      // },
    },
  ];

  const searchPanelVisible = useAtomValue(searchPanelVisibleAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [realColumns, setRealColumns] = useReducer(
    (state: any, changes: any) => {
      // save changes into localStorage
      saveState(changes);
      return changes;
    },
    formItems
  );

  useEffect(() => {
    setIsLoading(true);
    const savedState = loadState();
    if (savedState) {
      // savedState is an array of ColumnOptions objects
      // we need merge this array with `columns` array.
      // which column exists in savedState will be set to be visible
      // otherwise will be hide
      const outputColumns = formItems.map((column: ColumnOptions) => {
        const filterResult = savedState.filter(
          (c: ColumnOptions) => c.dataField === column.dataField && c.visible
        );
        column.visible = filterResult.length > 0;
        return column;
      });
      setRealColumns(outputColumns);
    }
    setIsLoading(false);
  }, []);

  const setSearchPanelVisible = useSetAtom(searchPanelVisibleAtom);
  const onToggleSettings = () => {
    settingPopupVisible.toggle();
  };
  const onClose = () => {
    setSearchPanelVisible(false);
  };
  const formRef: any = useRef<Form | null>(null);
  const settingPopupVisible = useVisibilityControl({ defaultVisible: false });
  const handleSearch = (e: any) => {
    const { isValid } = formRef.current?.instance.validate();
    if (isValid) {
      const data = formRef.current?.instance?.option("formData");
      onSearch?.(data);
    } else {
      // toast.error(t("Please Input Required Fields"));
    }
    e.preventDefault();
  };
  const items = useMemo(() => {
    return realColumns.map((c: any) => ({
      ...c,
      visible: true,
    }));
  }, [realColumns]);

  const handleApplySettings = useCallback((items: ItemProps[]) => {
    setRealColumns(items);
    settingPopupVisible.close();
  }, []);

  const handleCloseSearchSettings = useCallback(() => {
    settingPopupVisible.close();
  }, []);
  const windowSize = useWindowSize();
  const htmlFormRef = useRef(null);

  const handleChange = (e: any) => {
    // console.log("e ", e);
  };
  const customizeItem = useCallback(
    (e: any) => {
      if (e.dataField === "CampaignCodeConditionList") {
        e.editorOptions.dataSource = dataCampain;
        e.editorOptions.displayExpr = "CampaignName";
        e.editorOptions.valueExpr = "CampaignCode";
      }
    },
    [dataCampain]
  );

  return (
    <div
      className={`${
        searchPanelVisible ? "search-panel-visible" : "search-panel-hidden"
      } w-full`}
      id={"search-panel"}
    >
      <Header
        enableColumnToggler={enableColumnToggler}
        onCollapse={onClose}
        onToggleSettings={onToggleSettings}
      />
      <div>
        <LoadPanel visible={isLoading} />
        {!isLoading && (
          <form ref={htmlFormRef} className={""} onSubmit={handleSearch}>
            <Form
              onFieldDataChanged={handleChange}
              ref={(r) => (formRef.current = r)}
              formData={data}
              labelLocation={"top"}
              colCount={colCount}
              height={windowSize.height - 200}
              className={"p-2 h-full"}
              scrollingEnabled
              validationGroup="Search-Panel-Ver2"
              customizeItem={customizeItem}
              // showValidationSummary={true}
            >
              {items.map((item: any, idx: any) => {
                return <Item key={idx} {...item} />;
              })}
              <Item cssClass="h-[50px]"> </Item>
            </Form>
            <div
              className={`absolute bottom-[0] bg-red-400 flex items-end button-search-panel`}
              style={{ background: "white" }}
            >
              <PermissionContainer permission={"MNU_RPT_CPNCAMPAIGN_RESULT_CTM_FEEDBACK_SEARCH"}>
              <Button
                text={t("Search")}
                width={"100%"}
                type={"default"}
                useSubmitBehavior={true}
              ></Button>
              </PermissionContainer>

            </div>
          </form>
        )}
      </div>
      {enableColumnToggler && (
        <CustomColumnChooser
          title={t("SearchPanelSettings")}
          applyText={t("Apply")}
          cancelText={t("Cancel")}
          selectAllText={t("SelectAll")}
          container={"body"}
          button={"#toggle-search-settings"}
          onHiding={handleCloseSearchSettings}
          onApply={handleApplySettings}
          visible={settingPopupVisible.visible}
          columns={formItems}
          actualColumns={realColumns}
          position={"left"}
          storeKey={storeKey}
        />
      )}
    </div>
  );
};
