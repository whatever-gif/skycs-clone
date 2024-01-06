import { useI18n } from "@/i18n/useI18n";
import { Button, Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useAtomValue } from "jotai";
import React from "react";
import {
  dataImportAtom,
  visiblePropsUpErorValueAtom,
  visiblePropsUpValueAtom,
} from "./store";
import { ColumnOptions } from "@/types";
import { GridViewStandard } from "@/packages/ui/base-gridview/gridview-standard";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { LinkCell } from "@/packages/ui/link-cell";

const PopupError = ({ onClose }: any) => {
  const { t } = useI18n("PopupDetailContent");
  const visiblePropsUpValue = useAtomValue(visiblePropsUpErorValueAtom);
  const data = useAtomValue(dataImportAtom);
  const handleCopy = async (data: any) => {
    await navigator.clipboard.writeText(data.displayValue);
  };

  const columns: ColumnOptions[] = [
    {
      dataField: "CustomerCodeSys",
      caption: t("CustomerCodeSys"),
    },
    {
      dataField: "ErrorCode",
      caption: t("ErrorCode"),
      width: 200,
    },
    {
      dataField: "ErrorDetail",
      caption: t("ErrorDetail"),
      width: 200,
      cellRender: (data: any) => {
        return (
          <LinkCell
            onClick={() => handleCopy(data)}
            value={data.displayValue}
          ></LinkCell>
        );
      },
    },
    {
      dataField: "ErrorCodeSolution",
      caption: t("ErrorCodeSolution"),
      width: 200,
    },
    {
      dataField: "ErrorDetailSolution",
      caption: t("ErrorDetailSolution"),
      width: 200,
    },
  ];

  return (
    <Popup
      className="popup-customer"
      position={"center"}
      showCloseButton={true}
      onHiding={onClose}
      title={t(`Select Customers`)}
      visible={visiblePropsUpValue}
      height={600}
      width={900}
    >
      <div className="popup-customer-container">
        <GridViewCustomize
          isLoading={false}
          id={"Customer-popup-container"}
          onSelectionChanged={() => {}}
          // customizeClass={customizeClass}
          keyExpr={["CustomerCodeSys"]}
          columns={columns ?? []}
          dataSource={data.DataTable}
          allowSelection={false}
          storeKey="Popup-customer"
          onReady={(refValue: any) => {}}
          // fetchData={data}
          toolbarItems={
            [
              //  button search và action của nó
            ]
          }
        ></GridViewCustomize>
      </div>

      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Cancel")}
          stylingMode={"contained"}
          onClick={onClose}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default PopupError;
