import { useI18n } from "@/i18n/useI18n";
import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import { useVisibilityControl } from "@packages/hooks";
import { useWindowSize } from "@packages/hooks/useWindowSize";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { Button, LoadPanel } from "devextreme-react";
import Form, { IItemProps, Item } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Header } from "../../../packages/ui/search-panel/header";

import { useAtomValue } from "jotai";
import FieldTogglerCustomize from "./field-toggler/field-toggler";
import "./search-panel-v2.scss";
import { useSavedStateCustomize } from "./use-saved-state-Customize";

interface ItemProps extends IItemProps {
  order?: number;
}

interface SearchPanelProps {
  conditionFields: ItemProps[];
  data?: any;
  loading?: boolean;
  onSearch?: (data: any) => void;
  storeKey?: string;
  colCount?: number;
  enableColumnToggler?: boolean;
  customizeItem?: (e: any) => void;
}

export const SearchPaneCustomize = forwardRef(
  (
    {
      conditionFields = [],
      data,
      onSearch,
      loading,
      storeKey = "",
      colCount = 1,
      enableColumnToggler = true,
      customizeItem = (e: any): void => {},
    }: SearchPanelProps,
    ref: any
  ) => {
    const { t } = useI18n("Common");
    const { loadState, saveState } = useSavedStateCustomize<ColumnOptions[]>({
      storeKey: `search-panel-settings-${storeKey}`,
    });
    const searchPanelVisible = useAtomValue(searchPanelVisibleAtom);
    const [isLoading, setIsLoading] = useState(loading ?? true);
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
    }, [conditionFields]);

    const setSearchPanelVisible = useSetAtom(searchPanelVisibleAtom);
    const onToggleSettings = () => {
      settingPopupVisible.toggle();
    };
    const onClose = () => {
      setSearchPanelVisible(false);
    };
    // const ref: any = useRef<Form | null>(null);
    const settingPopupVisible = useVisibilityControl({ defaultVisible: false });
    const handleSearch = (e: any) => {
      const { isValid } = ref.current?.instance.validate();
      if (isValid) {
        const data = ref.current?.instance?.option("formData");
        onSearch?.(data);
      } else {
        // toast.error(t("Please Input Required Fields"));
      }
      e.preventDefault();
    };
    const items = useMemo(() => {
      return realColumns.map((c: any) => ({
        ...c,
        visible: !!c?.visible,
      }));
    }, [realColumns]);

    const handleApplySettings = useCallback((items: ItemProps[]) => {
      setRealColumns(items);
      settingPopupVisible.close();
    }, []);

    const handleCloseSearchSettings = useCallback(() => {
      settingPopupVisible.close();
    }, []);

    const htmlref = useRef(null);

    const handleChange = (e: any) => {};

    const windowSize = useWindowSize();
    return (
      <div
        className={`${
          searchPanelVisible ? "search-panel-visible" : "search-panel-hidden"
        } w-full h-full`}
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
            <form ref={htmlref} className={"static"} onSubmit={handleSearch}>
              <Form
                onFieldDataChanged={handleChange}
                ref={(r) => (ref.current = r)}
                formData={data}
                labelLocation={"top"}
                colCount={colCount}
                height={windowSize.height - 220}
                className={"p-2 h-full pb-4 search-panel-customize"}
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
                className={`absolute flex items-end w-full pr-3`}
                // style={{ background: "white", minWidth: "300px" }}
              >
                <Button
                  text={t("Search")}
                  width={"100%"}
                  type={"default"}
                  useSubmitBehavior={true}
                ></Button>
              </div>
            </form>
          )}
        </div>
        {enableColumnToggler && (
          <FieldTogglerCustomize
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
  }
);
