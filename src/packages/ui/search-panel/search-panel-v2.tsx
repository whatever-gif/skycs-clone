import { useI18n } from "@/i18n/useI18n";
import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import { useVisibilityControl } from "@packages/hooks";
import { useWindowSize } from "@packages/hooks/useWindowSize";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { useSavedState } from "@packages/ui/base-gridview/components/use-saved-state";
import { Button, LoadPanel } from "devextreme-react";
import Form, { IItemProps, Item } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Header } from "./header";

import PermissionContainer from "@/components/PermissionContainer";
import { useAtomValue } from "jotai";
import { useSavedStateForm } from "../base-gridview/components/use-saved-state-form";
import FieldToggler from "../field-toggler/field-toggler";
import "./search-panel-v2.scss";

interface ItemProps extends IItemProps {
  order?: number;
}

interface SearchPanelProps {
  conditionFields: ItemProps[];
  data?: any;
  onSearch?: (data: any) => void;
  storeKey: string;
  colCount?: number;
  enableColumnToggler?: boolean;
  permission?: string;
  height?: number;
  allowCache?: boolean;
}

export const SearchPanelV2 = ({
  conditionFields = [],
  data,
  onSearch,
  storeKey,
  colCount = 1,
  enableColumnToggler = true,
  permission = "",
  height,
  allowCache = false,
}: SearchPanelProps) => {
  const { t } = useI18n("Common");
  const { loadState, saveState } = useSavedState<ColumnOptions[]>({
    storeKey: `search-panel-settings-${storeKey}`,
  });
  const { saveStateForm } = useSavedStateForm<any>({
    storeKey: `search-panel-settings-${storeKey}`,
  });
  const searchPanelVisible = useAtomValue(searchPanelVisibleAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [realColumns, setRealColumns] = useReducer(
    (state: any, changes: any) => {
      // save changes into localStorage
      saveState(changes);
      return changes;
    },
    conditionFields
  );

  useEffect(() => {
    setIsLoading(true);
    const savedState = loadState();
    if (savedState) {
      // savedState is an array of ColumnOptions objects
      // we need merge this array with `columns` array.
      // which column exists in savedState will be set to be visible
      // otherwise will be hide
      const outputColumns = savedState.map((column: ColumnOptions) => {
        const filterResult = conditionFields.filter(
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
      if (allowCache) {
        saveStateForm?.(data);
      }
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

  const htmlFormRef = useRef(null);

  const handleChange = (e: any) => {};

  const windowSize = useWindowSize();

  return (
    <div
      className={`${
        searchPanelVisible ? "search-panel-visible" : "search-panel-hidden"
      } h-full w-full flex flex-col`}
      id={"search-panel"}
    >
      <Header
        enableColumnToggler={enableColumnToggler}
        onCollapse={onClose}
        onToggleSettings={onToggleSettings}
      />
      <LoadPanel visible={isLoading} />
      {!isLoading && (
        <form
          ref={htmlFormRef}
          className={"form-panel relative h-full flex flex-col flex-1"}
          onSubmit={handleSearch}
        >
          <Form
            onFieldDataChanged={handleChange}
            ref={(r) => (formRef.current = r)}
            formData={data}
            labelLocation={"top"}
            colCount={colCount}
            height={height ?? windowSize.height - 210}
            className={"p-2 h-full form-overwrite"}
            scrollingEnabled
            showRequiredMark={true}
            validationGroup="Search-Panel-Ver2"
            // showValidationSummary={true}
          >
            {items.map((item: any, idx: any) => {
              return <Item key={idx} {...item} />;
            })}
            <Item cssClass="h-[50px]"> </Item>
          </Form>
          <div
            className={`bottom-[0] bg-red-400 flex items-end button-search-panel`}
            style={{ background: "white" }}
          >
            <PermissionContainer permission={permission}>
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
      {enableColumnToggler && (
        <FieldToggler
          title={t("SearchPanelSettings")}
          applyText={t("Apply")}
          cancelText={t("Cancel")}
          selectAllText={t("SelectAll")}
          container={"body"}
          button={"#toggle-search-settings"}
          onHiding={handleCloseSearchSettings}
          onApply={handleApplySettings}
          visible={settingPopupVisible.visible}
          columns={conditionFields}
          actualColumns={realColumns}
          position={"left"}
          storeKey={storeKey}
        />
      )}
    </div>
  );
};
