import { useI18n } from "@/i18n/useI18n";
import { BaseGridView } from "@/packages/ui/base-gridview";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { ColumnOptions } from "@/types";
import { LoadPanel } from "devextreme-react";
import React, { useMemo, useRef } from "react";

interface Props {
  listCallHist: any[];
  dynamicFields: any[];
  dataDynamic: any;
  isLoading: boolean;
}

const HistoryCallTable = ({
  listCallHist = [],
  dynamicFields,
  dataDynamic,
  isLoading,
}: Props) => {
  const { t } = useI18n("Cpn_CampaignPerformPage_Grid");
  const handleNavigate = (url: string) => {
    window.location.href = url;
  };

  let gridRef = useRef();

  const getValueList = () => {
    return listCallHist.map((item: any, idx: number) => {
      if (idx === 0) {
        return {
          ...item,
          ...dataDynamic,
        };
      } else {
        return item;
      }
    });
  };

  const columns = (): ColumnOptions[] => {
    const staticField = [
      {
        dataField: "CallOutDTimeUTC",
        caption: t("CallOutDTimeUTC"),
        width: 150,
        visible: true,
      },
      {
        dataField: "AgentCode",
        caption: t("AgentCode"),
        width: 150,
        visible: true,
      },
      {
        dataField: "RecordFilePath",
        caption: t("RecordFilePath"),
        width: 150,
        visible: true,
        cellRender: (param: any) => {
          return (
            <div
              className="cursor-pointer"
              onClick={() => handleNavigate(param.displayValue)}
            >
              {param.displayValue}
            </div>
          );
        },
      },
      {
        dataField: "CallTime",
        caption: t("CallTime"),
        width: 150,
        visible: true,
      },
      {
        dataField: "CampaignCustomerCallStatus",
        caption: t("CampaignCustomerCallStatus"),
        width: 150,
        visible: true,
      },
    ];

    return [
      ...staticField,
      ...dynamicFields.map((item) => {
        return {
          ...item,
          visible: false,
        };
      }),
    ];
  };

  return (
    <div className="height">
      <LoadPanel visible={isLoading} />
      {!isLoading && (
        <BaseGridView
          isLoading={false}
          keyExpr={""}
          height={"auto"}
          onReady={(ref: any) => (gridRef.current = ref)}
          dataSource={getValueList()}
          columns={columns()}
          allowSelection={true}
          widthPopUp={550}
          onSelectionChanged={() => {}}
          onSaveRow={() => {}}
          onEditorPreparing={() => {}}
          editable={false}
          // isHiddenCheckBox={true}
          onEditRowChanges={() => {}}
          onDeleteRows={() => {}}
          storeKey="HistoryCallTable"
          showCheck={"none"}
        />
      )}
    </div>
  );
};

export default HistoryCallTable;
