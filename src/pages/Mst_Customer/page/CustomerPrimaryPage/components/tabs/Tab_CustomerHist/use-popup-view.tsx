import { useI18n } from "@/i18n/useI18n";
import { BaseGridView } from "@/packages/ui/base-gridview";
import { Popup, ScrollView } from "devextreme-react";
import { useAtom } from "jotai";
import { useRef } from "react";
import { viewingDataAtom } from "./store";
import { GridViewStandard } from "@/packages/ui/base-gridview/gridview-standard";

export const PopupViewComponent = () => {
  const { t } = useI18n("Common");
  const [viewingItem, setViewingItem] = useAtom(viewingDataAtom);

  const handleCancel = () => {
    setViewingItem(undefined);
  };

  let gridRef: any = useRef();

  const data = JSON.parse(viewingItem?.item?.JsonCustomerInfoHist || "[]");

  console.log("data ", data);

  const columns = [
    {
      dataField: "ColCaption", // Mã ngân hàng
      caption: "Tên trường",
    },
    {
      dataField: "ColValuePrevious", // Mã ngân hàng
      caption: "Giá trị trước khi cập nhật",
    },
    {
      dataField: "ColValueCurr", // Mã ngân hàng
      caption: "Giá trị hiện tại",
    },
  ];

  return (
    <Popup
      visible={!!viewingItem.item}
      title="Chi tiết thay đổi"
      showCloseButton={true}
      onHiding={handleCancel}
      contentRender={() => (
        <>
          <ScrollView showScrollbar="always" height="100%">
            <GridViewStandard
              isLoading={false}
              dataSource={data}
              columns={columns}
              isHiddenCheckBox={true}
              isHidenHeaderFilter={true}
              defaultPageSize={9999999999}
              id={"Tab_CustomerHist_Popup"}
              keyExpr={"ColCodeSys"}
              popupSettings={{}}
              formSettings={{}}
              onReady={(ref) => (gridRef = ref)}
              allowSelection={false}
              onSelectionChanged={() => {}}
              onSaveRow={() => {}}
              onEditorPreparing={() => {}}
              onEditRowChanges={() => {}}
              onDeleteRows={() => {}}
              storeKey={"Mst_CustomerHist-Detail-columns"}
            />
          </ScrollView>
        </>
      )}
    />
  );
};
