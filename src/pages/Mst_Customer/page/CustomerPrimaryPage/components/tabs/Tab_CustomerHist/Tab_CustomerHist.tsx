import { useClientgateApi } from "@/packages/api";
import { BaseGridView } from "@/packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useMst_CustomerHist_Column } from "./use-columns";
import { PopupViewComponent } from "./use-popup-view";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";

const Tab_CustomerHist = () => {
  const { CustomerCodeSys } = useParams();

  const api = useClientgateApi();

  let gridRef: any = useRef(null);

  const { data, isLoading } = useQuery(["CustomerHist", CustomerCodeSys], () =>
    api.Mst_CustomerHist_Search({
      CustomerCodeSys: CustomerCodeSys,
    })
  );

  const columns: any = useMst_CustomerHist_Column({
    data: data?.DataList || [],
  });

  return (
    <div className="w-full">
      <GridViewCustomize
        isLoading={isLoading}
        dataSource={data?.isSuccess ? data.DataList ?? [] : []}
        columns={columns}
        keyExpr={"LUDTimeUTC"}
        popupSettings={{}}
        formSettings={{}}
        onReady={(ref) => (gridRef = ref)}
        allowSelection={false}
        onSelectionChanged={() => {}}
        onSaveRow={() => {}}
        onEditorPreparing={() => {}}
        onEditRowChanges={() => {}}
        onDeleteRows={() => {}}
        storeKey={"Mst_CustomerHist-columns"}
        isHiddenCheckBox={true}
      />
      <PopupViewComponent />
    </div>
  );
};

export default Tab_CustomerHist;
