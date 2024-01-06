import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { showErrorAtom } from "@/packages/store";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import ContentFile from "@/pages/eticket/eticket/Components/Info/Detail/CustomizeJson/contentFIle";
import { ColumnOptions } from "@/types";
import {
  FileUploadCustom,
  mapEditorOption,
  mapEditorType,
} from "@/utils/customer-common";
import { useQuery } from "@tanstack/react-query";
import { Button, Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useAtomValue, useSetAtom } from "jotai";
import { memo, useCallback, useMemo, useRef } from "react";
import { visiblePopupAtom } from "../../../store";
import "./style.scss";
interface Props {
  param: any;
  listDynamicField: any;
  onCancel: () => void;
}
//listCampaign
const History_Call = ({ onCancel, listDynamicField, param }: Props) => {
  const popupVisible = useAtomValue(visiblePopupAtom);
  const showError = useSetAtom(showErrorAtom);
  const { t } = useI18n("Campaign_History_Call");
  const api = useClientgateApi();
  let gridRef: any = useRef<any>(null);
  const windowSize = useWindowSize();
  const { data, isLoading } = useQuery({
    queryKey: ["Cpn_CampaignCustomer_GetCallHist", param.data],
    queryFn: async () => {
      const dataParam = param.data;
      const phoneNo = dataParam?.CustomerPhoneNo ?? "";
      const phoneNo1 = dataParam?.CustomerPhoneNo1 ?? "";
      const phoneNo2 = dataParam?.CustomerPhoneNo2 ?? "";
      const getPhone = () => {
        let str = "";
        if (phoneNo !== "") {
          str = str + phoneNo;
        }
        if (phoneNo1 !== "") {
          str = str + "," + phoneNo1;
        }
        if (phoneNo2 !== "") {
          str = str + "," + phoneNo2;
        }

        return str;
      };

      const response = await api.Cpn_CampaignCustomer_GetCallHist({
        CampaignCode: dataParam?.CampaignCode ?? "",
        CustomerPhoneNo: getPhone(),
      });

      if (response.isSuccess) {
        const dataJSON = param.data.JsonCustomerInfo;
        if (dataJSON) {
          const isJsonString = (str: string) => {
            try {
              JSON.parse(str);
            } catch (e) {
              return false;
            }
            return true;
          };
          if (isJsonString(dataJSON)) {
            const customizeResponse = {
              ...response,
              Data: response?.Data?.map((item: any, idx: number) => {
                if (idx === 0) {
                  return {
                    ...item,
                    ...JSON.parse(param.data.JsonCustomerInfo),
                  };
                }

                return {
                  ...item,
                };
              }),
            };
            return customizeResponse;
          } else {
            return response;
          }
        }
        return response;
      } else {
        showError({
          message: response._strErrCode,
          _strErrCode: response._strErrCode,
          _strTId: response._strTId,
          _strAppTId: response._strAppTId,
          _objTTime: response._objTTime,
          _strType: response._strType,
          _dicDebug: response._dicDebug,
          _dicExcs: response._dicExcs,
        });
      }
    },
  });

  const handleNavigate = useCallback((path: string) => {
    if (path) {
      window.location.href = path;
    }
  }, []);

  const dataMap = listDynamicField.dynamicField ?? [];
  const columns = useMemo(() => {
    const newColumn = dataMap
      .map((item: any) => {
        return {
          ...item,
          ColDataType: item.CampaignColCfgDataType,
          ColCodeSys: item.CampaignColCfgCodeSys,
          caption: item.CampaignColCfgName,
          dataField: item.CampaignColCfgCodeSys,
          visible: true,
        };
      })
      .map((item: any) => {
        return {
          ...item,
          editorType: mapEditorType(item.ColDataType),
          editorOptions: {
            ...mapEditorOption({
              field: item,
              listDynamic: listDynamicField.dataSource,
            }),
            // readOnly: true,
            placeholder: "",
            readOnly: param?.flag === "detail",
            disabled: param?.flag === "detail",
          },
          visible: true,
        };
      })
      .map((item: any) => {
        if (item.ColDataType === "FILE") {
          return {
            ...item,
            width: 300,
            cellRender: (param: any) => {
              return <ContentFile item={param.displayValue} />;
            },
            editCellComponent: FileUploadCustom,
          };
        } else {
          return item;
        }
      });

    const staticFielđ = [
      {
        dataField: "CallOutDTimeUTC",
        caption: t("CallOutDTimeUTC"), // thời điểm gọi ra
      },
      {
        dataField: "AgentCode", // agent phụ trách
        caption: t("AgentCode"),
      },
      {
        dataField: "CustomerPhoneNo", // số điện thoại gọi ra
        caption: t("CustomerPhoneNo"),
      },
      {
        dataField: "RecordFilePath", // file ghi âm
        caption: t("RecordFilePath"),
        cellRender: (param: any) => {
          return (
            <div
              className="cursor-pointer hover-color-green"
              onClick={() => handleNavigate(param.displayValue)}
            >
              {param.displayValue ?? ""}
            </div>
          );
        },
      },
      {
        dataField: "CallTime", // thời gian gọi
        caption: t("CallTime"),
      },
      {
        dataField: "CampaignCustomerCallStatus", // trạng thái
        caption: t("CampaignCustomerCallStatus"),
      },
      {
        dataField: "CustomerFeedBack", // Khách hàng phản hồi
        caption: t("CustomerFeedBack"),
      },
      {
        dataField: "Remark", // ghi chú
        caption: t("Remark"),
      },
    ] as ColumnOptions[];

    return [...staticFielđ, ...newColumn];
  }, [isLoading]);

  return (
    <Popup
      className="popup-history"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={`${param.data.CustomerName} - ${param.data.AgentName}`}
      width={900}
      height={600}
      visible={popupVisible}
    >
      <p className="popup-history-title">{t("History Call")}</p>
      {/* <ScrollView className="popup-customer-content" width={"100%"}> */}
      <div className="grid-history">
        <GridViewCustomize
          isLoading={isLoading}
          id={"Grid-popup-history"}
          dataSource={data?.isSuccess ? data.Data : []}
          columns={columns}
          keyExpr={["CampaignCode", "AgentCode"]}
          widthPopUp={550}
          onReady={(ref: any) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={() => {}}
          onSaveRow={() => {}}
          onEditorPreparing={() => {}}
          customerHeight={windowSize.height - (windowSize.height - 470)}
          onEditRowChanges={() => {}}
          onDeleteRows={() => {}}
          isHiddenCheckBox={true}
          onEditRow={() => {}}
          storeKey={"Grid-popup-history"}
          isSingleSelection
          toolbarItems={[]}
        />
      </div>
      {/* </ScrollView> */}

      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Close")}
          stylingMode={"contained"}
          onClick={onCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default memo(History_Call);
