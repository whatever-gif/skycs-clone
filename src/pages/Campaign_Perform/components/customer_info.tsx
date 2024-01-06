import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration, useNetworkNavigate } from "@/packages/hooks";

import PermissionContainer from "@/components/PermissionContainer";
import { showErrorAtom } from "@/packages/store";
import { FlagActiveEnum, Mst_Customer } from "@/packages/types";
import { Icon } from "@/packages/ui/icons";
import { ColumnOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Form, LoadPanel } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import { forwardRef, useState } from "react";
import "../styles.scss";

export const Cpn_CustomerInfo = forwardRef(
  ({ cpnCustomerData }: { cpnCustomerData: any }, ref: any) => {
    const { auth } = useAuth();
    const { t } = useI18n("Cpn_CampaignPerformPage");
    const api = useClientgateApi();

    const showError = useSetAtom(showErrorAtom);
    const config = useConfiguration();
    const navigate = useNetworkNavigate();
    const [data, setData] = useState<Mst_Customer | null>(cpnCustomerData);
    const [isExpand, setExpand] = useState(true);
    // const refetchData = async () => {
    //   if (cpnCustomerData.CustomerCodeSys) {
    //     const response = await api.Mst_Customer_GetByCustomerCode([
    //       cpnCustomerData.CustomerCodeSys,
    //     ]);
    //     if (
    //       response.isSuccess &&
    //       response.Data &&
    //       response.Data.Lst_Mst_Customer &&
    //       response.Data.Lst_Mst_Customer.length > 0
    //     ) {
    //       setData(response.Data.Lst_Mst_Customer[0]);
    //     } else {
    //       showError({
    //         message: (response.errorCode),
    //         debugInfo: response.debugInfo,
    //         errorInfo: response.errorInfo,
    //       });
    //     }
    //   }
    // };

    // const refetchSearch = async () => {
    //   if (cpnCustomerData.CustomerCodeSys) {
    //     const response = await api.Mst_Customer_Search({
    //       FlagActive: FlagActiveEnum.Active,
    //       Ft_PageSize: config.MAX_PAGE_ITEMS,
    //       Ft_PageIndex: 0,
    //     });
    //     if (response.isSuccess && response.DataList) {
    //       console.log("response ", response);
    //       setListCompany(response.DataList ?? []);
    //     } else {
    //       showError({
    //         message: (response.errorCode),
    //         debugInfo: response.debugInfo,
    //         errorInfo: response.errorInfo,
    //       });
    //     }
    //   }
    // };

    const { data: dataListCompany, isLoading: isLoadingListCompany } = useQuery(
      {
        queryKey: ["Mst_Customer_Search"],
        queryFn: async () => {
          const response = await api.Mst_Customer_Search({
            FlagActive: FlagActiveEnum.Active,
            Ft_PageSize: config.MAX_PAGE_ITEMS,
            Ft_PageIndex: 0,
            CustomerType: "TOCHUC",
          });
          if (response.isSuccess) {
            return response.DataList;
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
      }
    );

    const { data: checked, isLoading: isLoadingCheck } = useQuery({
      queryKey: ["Mst_Customer_Search_Check", JSON.stringify(cpnCustomerData)],
      queryFn: async () => {
        if (cpnCustomerData.CustomerCodeSys) {
          const param = {
            FlagActive: FlagActiveEnum.Active,
            Ft_PageSize: config.MAX_PAGE_ITEMS,
            Ft_PageIndex: 0,
            CustomerCodeSys: cpnCustomerData.CustomerCodeSys,
          };
          const response = await api.Mst_Customer_Search(param);
          if (response.isSuccess) {
            return response.DataList;
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
        } else {
          return [];
        }
      },
    });

    const listField: ColumnOptions[] = [
      {
        dataField: "CustomerName",
        editorType: "dxTextBox",
        label: {
          text: t("CustomerName"),
        },
        editorOptions: {
          height: "30px",
        },
      },
      {
        dataField: "CustomerEmail",
        editorType: "dxTextBox",
        label: {
          text: t("CustomerEmail"),
        },
        editorOptions: {
          height: "30px",
        },
      },
      {
        dataField: "CustomerAddress",
        editorType: "dxTextBox",
        label: {
          text: t("CustomerAddress"),
        },
        editorOptions: {
          height: "30px",
        },
      },
      {
        dataField: "RepresentPosition",
        editorType: "dxTextBox",
        label: {
          text: t("RepresentPosition"),
        },
        editorOptions: {
          height: "30px",
        },
      },
      {
        dataField: "CustomerCodeSysERP",
        editorType: "dxSelectBox",
        label: {
          text: t("CustomerCodeSysERP"),
        },
        editorOptions: {
          dataSource: dataListCompany ?? [],
          height: "30px",
          displayExpr: "CustomerName",
          valueExpr: "CustomerCodeSys",
          searchExpr: ["CustomerName", "CustomerCodeSys"],
          searchEnabled: true,
        },
      },
    ];

    if (isLoadingListCompany || isLoadingCheck) {
      return <LoadPanel />;
    }

    const handleNavigation = () => {
      const formValue = [
        "CustomerName",
        "CustomerEmail",
        "CustomerAddress",
        "RepresentPosition",
        "CustomerCodeSysERP",
      ];

      const getValue: any = formValue.reduce((total, item) => {
        return {
          ...total,
          [item]: ref.current.instance.option("formData")[item] ?? "",
        };
      }, {});
      const str = `${getValue?.CustomerName}/${getValue?.CustomerEmail}/${getValue?.CustomerAddress}/${getValue?.RepresentPosition}/${getValue?.CustomerCodeSysERP}`;
      navigate(`/customer/add/${str}`);
    };

    const ButtonComponent = () => {
      if (isLoadingCheck || isLoadingListCompany) {
        return <></>;
      } else {
        if (checked?.length) {
          return (
            <PermissionContainer
              permission={"BTN_CAMPAIGN_CAMPAIGN_PERFORM_EDITCUSTOM"}
            >
              <button
                className="mr-1"
                onClick={() => {
                  navigate(`/customer/edit/${checked[0].CustomerCodeSys}`);
                }}
              >
                <Icon name="edit" />
              </button>
            </PermissionContainer>
          );
        } else {
          return (
            <button
              className="mr-1"
              onClick={() => {
                // navigate("/customer/add");
                handleNavigation();
              }}
            >
              <Icon name="add" />
            </button>
          );
        }
      }
    };

    return (
      <>
        {!!data && (
          <>
            <div className="group-head w-full pl-1 pr-1">
              <span>{t("Detail's Infomation")}</span>
              <div className="float-right">
                {ButtonComponent()}
                {isExpand && (
                  <button
                    onClick={() => {
                      setExpand(false);
                    }}
                  >
                    <Icon name="expandCampaign"></Icon>
                  </button>
                )}
                {!isExpand && (
                  <button
                    onClick={() => {
                      setExpand(true);
                    }}
                  >
                    <Icon
                      style={{ transform: "rotate(180deg)" }}
                      name="expandCampaign"
                    ></Icon>
                  </button>
                )}
              </div>
            </div>
            <div className="w-ful p-2">
              {isExpand && (
                <Form
                  validationGroup={"Form_Customer_Info"}
                  formData={data}
                  ref={ref}
                >
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
