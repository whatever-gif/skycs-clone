import { useI18n } from "@/i18n/useI18n";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useAtomValue } from "jotai";
import React from "react";
import { showVisibleDiAtom } from "./store";

interface Props {
  handleClose: () => void;
}

const Detail_Di = ({ handleClose }: Props) => {
  const { t } = useI18n("Rpt_PopUpDetail_2_Detail_Di");
  const visible = useAtomValue(showVisibleDiAtom);

  const fakeData = [
    {
      "Từ ngữ không phù hợp": "Tôi",
      "Giới hạn tiêu chuẩn": 0,
      "Số lần xuất hiện": "6",
    },
    {
      "Từ ngữ không phù hợp": "Không được",
      "Giới hạn tiêu chuẩn": 0,
      "Số lần xuất hiện": "6",
    },
    {
      "Từ ngữ không phù hợp": "Phải",
      "Giới hạn tiêu chuẩn": 0,
      "Số lần xuất hiện": "6",
    },
    {
      "Từ ngữ không phù hợp": "Tao",
      "Giới hạn tiêu chuẩn": 0,
      "Số lần xuất hiện": "6",
    },
    {
      "Từ ngữ không phù hợp": "Mày",
      "Giới hạn tiêu chuẩn": 0,
      "Số lần xuất hiện": "6",
    },
  ];

  const columns = [
    "Từ ngữ không phù hợp",
    "Giới hạn tiêu chuẩn",
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
      title={t("Rpt_PopUpDetail_2_Detail_Di")}
      width={700}
      height={500}
    >
      <div className="popup-content">
        <div className="popup-content__title">
          <p>{t("Mã cuộc gọi:")}: CallID</p>
          <p>Danh sách kính ngữ đã được sử dụng trong cuộc gọi (4)</p>
        </div>
        <div className="popup-content__body">
          <GridViewCustomize
            isSingleSelection={false}
            isLoading={false}
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

export default Detail_Di;
