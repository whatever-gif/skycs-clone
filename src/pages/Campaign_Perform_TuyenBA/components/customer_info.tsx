import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";

import { showErrorAtom } from "@/packages/store";
import {
  Cpn_CampaignCustomerData,
  FlagActiveEnum,
  Mst_Customer,
} from "@/packages/types";
import { ColumnOptions } from "@/types";
import { Form } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import { forwardRef, useEffect, useState } from "react";
import "../styles.scss";

export const Cpn_CustomerInfo = forwardRef(
  (
    { cpnCustomerData }: { cpnCustomerData: Cpn_CampaignCustomerData },
    ref: any
  ) => {
    const { auth } = useAuth();
    const { t } = useI18n("Cpn_CampaignPerformPage");
    const api = useClientgateApi();

    const showError = useSetAtom(showErrorAtom);
    const config = useConfiguration();
    const [data, setData] = useState<Mst_Customer | null>(null);
    const [isExpand, setExpand] = useState(true);
    const [listCompany, setListCompany] = useState<any[]>([]);
    const refetchData = async () => {
      if (cpnCustomerData.CustomerCodeSys) {
        const response = await api.Mst_Customer_GetByCustomerCode([
          cpnCustomerData.CustomerCodeSys,
        ]);
        if (
          response.isSuccess &&
          response.Data &&
          response.Data.Lst_Mst_Customer &&
          response.Data.Lst_Mst_Customer.length > 0
        ) {
          setData(response.Data.Lst_Mst_Customer[0]);
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
      }
    };

    const refetchSearch = async () => {
      if (cpnCustomerData.CustomerCodeSys) {
        const response = await api.Mst_Customer_Search({
          FlagActive: FlagActiveEnum.Active,
          Ft_PageSize: config.MAX_PAGE_ITEMS,
          Ft_PageIndex: 0,
        });
        if (response.isSuccess && response.DataList) {
          console.log("response ", response);
          setListCompany(response.DataList ?? []);
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
      }
    };

    const listField: ColumnOptions[] = [
      {
        dataField: "CustomerName",
        editorType: "dxTextBox",
        label: {
          text: t("CustomerName"),
        },
      },
      {
        dataField: "CustomerEmail",
        editorType: "dxTextBox",
        label: {
          text: t("CustomerEmail"),
        },
      },
      {
        dataField: "CustomerAddress",
        editorType: "dxTextBox",
        label: {
          text: t("CustomerAddress"),
        },
      },
      {
        dataField: "RepresentPosition",
        editorType: "dxTextBox",
        label: {
          text: t("RepresentPosition"),
        },
      },
      {
        dataField: "CustomerCodeSys",
        editorType: "dxSelectBox",
        editorOptions: {
          dataSource: listCompany,
          displayExpr: "CustomerName",
          valueExpr: "CustomerCodeSys",
          searchExpr: ["CustomerName", "CustomerCodeSys"],
          searchEnabled: true,
        },
      },
    ];

    useEffect(() => {
      refetchData();
      refetchSearch();
    }, []);

    return (
      <>
        {!!data && (
          <>
            <div className="group-head w-full pl-1 pr-1">
              <span>Thông tin khách hàng</span>
              <div className="float-right">
                <button className="mr-1">
                  <i className="dx-icon-add" />{" "}
                </button>
                {isExpand && (
                  <button
                    onClick={() => {
                      setExpand(false);
                    }}
                  >
                    <i className="dx-icon-collapse" />{" "}
                  </button>
                )}
                {!isExpand && (
                  <button
                    onClick={() => {
                      setExpand(true);
                    }}
                  >
                    <i className="dx-icon-expand" />
                  </button>
                )}
              </div>
            </div>
            <div className="w-ful p-2">
              {isExpand && (
                <Form formData={data} ref={ref}>
                  <GroupItem>
                    {listField.map((item: any, index: number) => {
                      return <SimpleItem {...item} key={index} />;
                    })}
                  </GroupItem>
                </Form>
              )}
            </div>
          </>
        )}
      </>
    );
  }
);
