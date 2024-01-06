import { checkPermision } from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { Icon } from "@/packages/ui/icons";
import { LinkCell } from "@/packages/ui/link-cell";

import { listCampaignAgentAtom } from "@/pages/admin/Cpn_Campaign/components/store";
import ContentFile from "@/pages/eticket/eticket/Components/Info/Detail/CustomizeJson/contentFIle";
import { ColumnOptions } from "@/types";
import {
  FileUploadCustom,
  mapEditorOption,
  mapEditorType,
} from "@/utils/customer-common";
import { Button } from "devextreme-react";
import { useAtomValue } from "jotai";
import { useParams } from "react-router-dom";
interface Props {
  dataSource: any;
  dynamicField: any[];
}

// export const FileUploadCustom = (props: any) => {
//   const { data } = props;
//   const { headers, baseURL } = useApiHeaders();
//   const [isUploading, setIsUploading] = useState(false);

//   const api = useClientgateApi();
//   const handleUploadFile = async (file: File, callback: any) => {
//     const resp = await api.File_UploadFile(file);
//     if (resp.isSuccess) {
//       const obj = {
//         FileSize: resp.Data?.FileSize ?? "",
//         FileType: resp.Data?.FileType ?? "",
//         FileUrlFS: resp.Data?.FileUrlFS ?? "",
//         FileFullName: resp.Data?.FileFullName ?? "",
//         FileUrlLocal: resp.Data?.FileUrlLocal ?? "",
//       };
//       data.setValue(obj);
//     }
//   };

//   return (
//     <FileUploader
//       ref={null}
//       selectButtonText="Select FILE"
//       labelText=""
//       uploadMode={"instantly"}
//       multiple={false}
//       name={"file"}
//       uploadHeaders={{
//         ...headers,
//         "Content-Type": "multipart/form-data",
//       }}
//       uploadUrl={`${baseURL}/File/UploadFile`}
//       disabled={isUploading}
//       uploadFile={handleUploadFile}
//     />
//   );
// };

export interface UseCustomerGridColumnsProps {
  dataField: Props;
  customeField: any;
  onClick: (param: any) => void;
}
export const useColumn = ({
  dataField,
  customeField,
  onClick,
}: UseCustomerGridColumnsProps) => {
  const { t } = useI18n("Cpn_Campaign_List_Customer_Column");
  const param = useParams();
  const handleNavigate = (code: any) => {
    if (code) {
      window.open(`${code}`, "_blank");
    }
  };

  let columnsDetail: ColumnOptions[] = [
    {
      dataField: "CustomerName", // tên khách hàng
      caption: t("CustomerName"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "CustomerPhoneNo1", // Số điện thoại 1
      caption: t("CustomerPhoneNo1"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "CustomerPhoneNo2", // Số điện thoại 2
      caption: t("CustomerPhoneNo2"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "CallOutDTimeUTC", // Thời gian gọi ra
      caption: t("CallOutDTimeUTC"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "CallTime", // Thời lượng
      caption: t("CallTime"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "RecordFilePath", // File ghi âm
      caption: t("RecordFilePath"),
      editorOptions: {
        readOnly: true,
      },
      width: 200,
      cellRender: (param: any) => {
        return (
          <LinkCell
            value={param.displayValue}
            onClick={() => handleNavigate(param.displayValue)}
          ></LinkCell>
        );
      },
    },
    {
      dataField: "CampaignCustomerStatus", // Trạng thái thực hiện
      caption: t("CampaignCustomerStatus"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "CustomerFeedBack", // Khách hàng phản hổi
      caption: t("CustomerFeedBack"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "QtyCall", // Số lần gọi
      caption: t("QtyCall"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "AgentName", // Khách hàng phản hổi
      caption: t("AgentName"),
      editorOptions: {
        readOnly: true,
      },
    },
    {
      dataField: "Remark", // Ghi chú
      caption: t("Remark"),
      editorOptions: {
        readOnly: true,
      },
    },
  ];

  const dataMap = dataField.dynamicField ?? [];
  const fieldCustomer = Object.keys(customeField)
    .map((item: string, index: number) => {
      return {
        [`${item}`]: Object.values(customeField)[index],
      };
    })
    .map((item, index) => {
      return {
        ColDataType: "dxTextBox",
        ColCodeSys: Object.values(item)[0],
        dataField: Object.values(item)[0],
        caption: t(Object.keys(item)[0]),
        visible: true,
      };
    });

  const newColumn = dataMap
    .map((item) => {
      return {
        ...item,
        ColDataType: item.CampaignColCfgDataType,
        ColCodeSys: item.CampaignColCfgCodeSys,
        caption: item.CampaignColCfgName,
        dataField: item.CampaignColCfgCodeSys,
        visible: true,
      };
    })
    .map((item) => {
      // console.log("_____item_____ ", item);
      return {
        ...item,
        editorType: mapEditorType(item.ColDataType),
        editorOptions: {
          ...mapEditorOption({
            field: item,
            listDynamic: dataField.dataSource,
            keyWord: "JsonListOption",
          }),
          // readOnly: true,
          placeholder: "",
          readOnly: param?.flag === "detail",
          disabled: param?.flag === "detail",
        },
        visible: true,
      };
    })
    .map((item) => {
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

  const obj = {
    AgentCode: "",
    AgentName: "",
    CustomerName: "",
    CustomerPhoneNo1: "",
    CustomerPhoneNo2: "",
    CustomerEmail: "",
  };
  const listCampaignAgentValue = useAtomValue(listCampaignAgentAtom);
  const columns = Object.keys(obj).map((item) => {
    if (item === "AgentCode") {
      return {
        dataField: "AgentCode",
        caption: t(item),
        editorType: "dxSelectBox",
        setCellValue: (newData: any, value: any) => {
          const item = listCampaignAgentValue.find(
            (item) => !!item && item.UserCode === value
          );
          if (item) {
            newData.AgentName = item.UserName;
            newData.AgentCode = value;
          }
        },
        visible: false,
        editorOptions: {
          dataSource: listCampaignAgentValue,
          placeholder: t("Input"),
          displayExpr: "UserName",
          readOnly: param?.flag === "detail",
          disabled: param?.flag === "detail",
          valueExpr: "UserCode",
        },
      };
    }
    if (item === "AgentName") {
      return {
        dataField: "AgentName",
        caption: t(item),
        editorType: "dxSelectBox",
        setCellValue: (newData: any, value: any) => {
          const item = listCampaignAgentValue.find(
            (item) => !!item && item.UserCode === value
          );
          if (item) {
            newData.AgentName = item.UserName;
            newData.AgentCode = value;
          }
        },
        editorOptions: {
          dataSource: listCampaignAgentValue,
          placeholder: t("Input"),
          displayExpr: "UserName",
          valueExpr: "UserCode",
          // readOnly: param?.flag === "detail",
          // disabled: param?.flag === "detail",
        },
        visible: true,
      };
    } else {
      return {
        dataField: item, // Tên chiến dịch
        caption: t(item),
        editorType: "dxTextBox",
        editorOptions: {
          readOnly: true,
        },
        visible: true,
      };
    }
  });

  const buttonShowWhenDetail: ColumnOptions[] = [
    {
      dataField: "Button", // tên khách hàng
      caption: t(""),
      fixed: true,
      width: 80,
      alignment: "center",
      fixedPosition: "right",
      cssClass: "mx-1 cursor-pointer",
      visible: checkPermision("BTN_CAMPAIGN_CAMPAIGNMANAGER_DETAIL_HISTORY"),
      cellRender: (param) => {
        return (
          <Button onClick={() => onClick(param)}>
            <Icon name="clock"></Icon>
          </Button>
        );
      },
    },
  ];

  // console.log("newColumn", newColumn);

  if (param?.flag === "detail") {
    const result = [...columnsDetail, ...newColumn, ...buttonShowWhenDetail];
    return [...columnsDetail, ...newColumn, ...buttonShowWhenDetail];
  }
  const response = [...columns, ...fieldCustomer, ...newColumn];
  return response;
};
