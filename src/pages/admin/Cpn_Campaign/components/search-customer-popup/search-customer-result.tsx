import { SearchDataGrid } from "@/pages/admin/Cpn_Campaign/components/search-grid/search-grid";
import { forwardRef, useState } from "react";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { useSetAtom } from "jotai";
import { SearchPanelV2 } from "@packages/ui/search-panel";
import { useColumnsSearch } from "@/pages/admin/Cpn_Campaign/components/Components/PopUp/Mst_Customer_Clone/components/use-columns-search";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { useColumn } from "@/pages/Mst_Customer/components/use-columns";
import { WithSearchPanelLayout } from "@/packages/layouts/content-searchpanel-layout/layout-with-search-panel";
import { GridViewStandard } from "@/packages/ui/base-gridview/gridview-standard";
import SearchCondition from "@/pages/Mst_Customer/components/searchCondition";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";

interface SearchCustomerResultProps {
  searchCondition: any;
  customizeClass: string;
  listColumn: any;
  listGroup: any[];
  data: any;
  onSelectionChanged?: (e: any) => void;
  onSearch?: (data: any) => void;
  dataApi: any;
}

export const SearchCustomerResult = forwardRef(
  (
    {
      searchCondition,
      customizeClass,
      listColumn,
      listGroup,
      data,
      onSelectionChanged,
      onSearch,
      dataApi,
    }: SearchCustomerResultProps,
    ref: any
  ) => {
    const columns = useColumn({
      data: [],
      dataField: listColumn ?? {
        dataField: [],
        listMaster: [],
      },
      dataGroup: listGroup ?? [],
    });

    const handleSelectionChanged = (e: any) => {
      onSelectionChanged?.(e);
    };

    const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom); // state lưu trữ trạng thái đóng mở của nav search

    const handleToggleSearchPanel = () => {
      // console.log("come in");
      setSearchPanelVisibility((visible: boolean) => !visible);
    };

    const [storeData, setStoreData] = useState({});
    const handleSearch = async (data: any) => {
      setStoreData(data);
      onSearch?.(data);
    };

    return (
      <WithSearchPanelLayout>
        <WithSearchPanelLayout.Slot name={"SearchPanel"}>
          {/* // cái component này dùng chung cho cả bên chi tiết chiến dịch nên
          đừng có sửa linh tinh mà sửa thì sửa cả hai chỗ */}
          <SearchCondition
            listColumn={
              listColumn ?? {
                dataField: [],
                listMaster: [],
              }
            }
            data={dataApi}
            formData={searchCondition.current}
            onSearch={handleSearch}
          />
        </WithSearchPanelLayout.Slot>
        <WithSearchPanelLayout.Slot name={"ContentPanel"}>
          <div className="popup-height-full">
            <GridViewStandard
              isLoading={false}
              autoFetchData={true}
              id={"Customer-popup-campaign"}
              // customizeClass={customizeClass}
              keyExpr={["CustomerCodeSys"]}
              widthPopUp={550}
              columns={columns ?? []}
              dataSource={[]}
              allowSelection={false}
              storeKey="Popup-customer"
              onReady={(refValue: any) => {
                ref.current = refValue;
              }}
              onSelectionChanged={handleSelectionChanged}
              fetchData={data}
              toolbarItems={[
                //  button search và action của nó
                {
                  location: "before",
                  widget: "dxButton",
                  options: {
                    icon: "search",
                    onClick: handleToggleSearchPanel,
                  },
                },
              ]}
            ></GridViewStandard>
          </div>
        </WithSearchPanelLayout.Slot>
      </WithSearchPanelLayout>
    );
  }
);
