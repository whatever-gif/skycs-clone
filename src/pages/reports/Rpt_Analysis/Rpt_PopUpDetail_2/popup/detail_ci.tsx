import { useI18n } from "@/i18n/useI18n";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useAtomValue } from "jotai";
import React from "react";
import { showVisibleCIAtom } from "./store";
import './style.scss'

interface Props {
  handleClose: () => void;
}

const Detail_Ci = ({ handleClose }: Props) => {
  const { t } = useI18n("Rpt_PopUpDetail_2_Detail_Ci");
  const visible = useAtomValue(showVisibleCIAtom);

  const fakeData = [
    {
      "Kính ngữ": "Vâng",
      "Tiêu chuân": 1,
      "Ràng buộc": "Bắc Buộc",
      "Số lần xuất hiện": 6,
    },
    {
      "Kính ngữ": "dạ",
      "Tiêu chuân": 1,
      "Ràng buộc": "Bắc Buộc",
      "Số lần xuất hiện": 0,
    },
    {
      "Kính ngữ": "cảm ơn",
      "Tiêu chuân": 2,
      "Ràng buộc": "Khuyến khích",
      "Số lần xuất hiện": 3,
    },
    {
      "Kính ngữ": "ạ",
      "Tiêu chuân": 2,
      "Ràng buộc": "Khuyến khích",
      "Số lần xuất hiện": 1,
    },
  ];

  const columns = [
    "Kính ngữ",
    "Tiêu chuân",
    "Ràng buộc",
    "Số lần xuất hiện",
  ].map((item: any) => {
    return {
      dataField: item,
      editorOptions: {
        readOnly: true,
      },
      caption: t(`${item}`),
      columnIndex: 1,
      visible: true,
    };
  });

  return (
    <Popup
      visible={visible}
      onHiding={handleClose}
      hideOnOutsideClick={false}
      showCloseButton={true}
      position="center"
      title={t("Rpt_PopUpDetail_2_Detail_Ci")}
      width={700}
      height={500}
    >
      <div className="popup-content">
        <div className="popup-content__title">
          <p>{t("Mã cuộc gọi:")}: CallID</p>
          <p>Danh sách từ ngữ không phù hợp trong cuộc gọi (5)</p>
        </div>
        <div className="popup-content__body">
          <GridViewCustomize
            isSingleSelection={false}
            isLoading={false}
            // fetchData={refetchData}
            dataSource={fakeData ? fakeData ?? [] : []}
            columns={columns}
            keyExpr={["Agent"]}
            onReady={(ref: any) => {}}
            allowSelection={true}
            onSelectionChanged={() => {}}
            hidenTick={true}
            onSaveRow={() => {}}
            onEditorPreparing={() => {}}
            onEditRowChanges={() => {}}
            onDeleteRows={() => {}}
            storeKey={"Rpt_PopUpDetail_2"}
            toolbarItems={[]}
          />
        </div>
      </div>

      <ToolbarItem
        widget="dxButton"
        location="after"
        toolbar="bottom"
        options={handleClose}
      />
    </Popup>
  );
};

export default Detail_Ci;
