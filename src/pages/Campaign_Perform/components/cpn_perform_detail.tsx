import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { showErrorAtom } from "@/packages/store";
import {
  Cpn_CampaignCustomerData,
  DynamicField_Campaign,
} from "@/packages/types";
import { ColumnOptions } from "@/types";
import { mapEditorOption, mapEditorType } from "@/utils/customer-common";
import { Button, Form, ScrollView, SelectBox } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { forwardRef, useEffect, useRef, useState } from "react";
import { match } from "ts-pattern";
import "../styles.scss";
import HistoryCallTable from "./history-call-table";
import { changeCallApiAtom } from "./store";
import {
  RequiredField,
  requiredType,
} from "@/packages/common/Validation_Rules";

export const Cpn_CampaignPerformDetail = forwardRef(
  (
    {
      cpnCustomerData,
      normalRef,
    }: { cpnCustomerData: Cpn_CampaignCustomerData; normalRef: any },
    ref: any
  ) => {
    useEffect(() => {
      if (cpnCustomerData.JsonCustomerInfo) {
        const formJson = JSON.parse(cpnCustomerData.JsonCustomerInfo);
        setFormData(formJson);
      }
      setFormNormal(cpnCustomerData);
    }, [cpnCustomerData]);

    const windowSize = useWindowSize();
    const { t } = useI18n("Cpn_CampaignPerformPage");
    const showError = useSetAtom(showErrorAtom);
    const { auth } = useAuth();
    const changeCallApi = useAtomValue(changeCallApiAtom);
    const api = useClientgateApi();
    const [formData, setFormData] = useState({});
    const [isloading, setIsLoading] = useState(true);
    const [formNormal, setFormNormal] = useState({});
    const [listFeedBack, setListFeedback] = useState<any[]>([]);
    const [listCallHist, setListCallHist] = useState<any[]>([]);
    const [dynamicFields, setDynamicFields] = useState<any[]>([]);

    const refetchDynamicFields = async () => {
      if (cpnCustomerData.CampaignTypeCode && !!auth.orgData) {
        const response = await api.Mst_CampaignType_GetByCode(
          cpnCustomerData.CampaignTypeCode,
          auth.orgData?.Id ?? ""
        );

        if (
          response.isSuccess &&
          response.Data &&
          response.Data.Lst_Mst_CustomColumnCampaignType
        ) {
          setListFeedback(response.Data?.Lst_Mst_CustomerFeedBack ?? []);
          const Lst_Mst_CustomColumnCampaignType: DynamicField_Campaign[] =
            response?.Data?.Lst_Mst_CustomColumnCampaignType ?? [];
          const getMasterData: string[] =
            Lst_Mst_CustomColumnCampaignType.filter(
              (item: DynamicField_Campaign) => {
                return (
                  item.CampaignColCfgDataType === "MASTERDATASELECTMULTIPLE" ||
                  item.CampaignColCfgDataType === "MASTERDATA"
                );
              }
            ).map((item) => {
              return item.CampaignColCfgCodeSys ?? "";
            });

          const responseDynamicField =
            await api.Mst_CampaignColumnConfig_GetListOption(
              getMasterData ?? []
            );

          if (responseDynamicField.isSuccess) {
            if (
              responseDynamicField.DataList &&
              Array.isArray(responseDynamicField.DataList) &&
              responseDynamicField.DataList.length
            ) {
              const buildList = Lst_Mst_CustomColumnCampaignType.map((item) => {
                const check = responseDynamicField?.DataList.find(
                  (itemFieldDataMaster: any) => {
                    return (
                      itemFieldDataMaster.CampaignColCfgCodeSys ===
                      item.CampaignColCfgCodeSys
                    );
                  }
                );

                if (check) {
                  const checkValue = {
                    ...item,
                    dataSource: check.Lst_MD_OptionValue,
                    ColDataType: item.CampaignColCfgDataType,
                    ColCodeSys: item.CampaignColCfgCodeSys,
                    caption: item.CampaignColCfgName,
                    dataField: item.CampaignColCfgCodeSys,
                    visible: true,
                  };

                  return checkValue;
                } else {
                  return {
                    ...item,
                    ColDataType: item.CampaignColCfgDataType,
                    ColCodeSys: item.CampaignColCfgCodeSys,
                    caption: item.CampaignColCfgName,
                    dataField: item.CampaignColCfgCodeSys,
                  };
                }
              }).map((item) => {
                const dynamic =
                  responseDynamicField.DataList.reduce(
                    (acc: any, item: any) => {
                      return {
                        ...acc,
                        [`${item.CampaignColCfgCodeSys}`]:
                          item.Lst_MD_OptionValue,
                      };
                    },
                    {}
                  ) ?? [];
                return {
                  ...item,
                  editorType: mapEditorType(item.ColDataType),
                  editorOptions: {
                    ...mapEditorOption({
                      field: item,
                      listDynamic: dynamic,
                      keyWord: "JsonListOption",
                    }),
                    placeholder: "",
                  },
                  visible: true,
                };
              });

              setDynamicFields(buildList);
            }
          } else {
            showError({
              message: responseDynamicField._strErrCode,
              _strErrCode: responseDynamicField._strErrCode,
              _strTId: responseDynamicField._strTId,
              _strAppTId: responseDynamicField._strAppTId,
              _objTTime: responseDynamicField._objTTime,
              _strType: responseDynamicField._strType,
              _dicDebug: responseDynamicField._dicDebug,
              _dicExcs: responseDynamicField._dicExcs,
            });
          }
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

    const refetchCallHist = async () => {
      if (cpnCustomerData.CampaignTypeCode && !!auth.orgData) {
        let phoneNo = "";
        if (cpnCustomerData.CustomerPhoneNo) {
          phoneNo = cpnCustomerData.CustomerPhoneNo;
        }
        if (cpnCustomerData.CustomerPhoneNo1) {
          phoneNo = phoneNo + " " + cpnCustomerData.CustomerPhoneNo1;
        }
        if (cpnCustomerData.CustomerPhoneNo2) {
          phoneNo = phoneNo + " " + cpnCustomerData.CustomerPhoneNo2;
        }

        const obj = {
          CampaignCode: cpnCustomerData.CampaignCode,
          CustomerPhoneNo: phoneNo.trim().split(" ").join(","),
        };

        const response = await api.Cpn_CampaignCustomer_GetCallHist(obj);
        // if (response.isSuccess && response.Data) {
        //   setListCallHist(response.Data);
        // }
        if (response.isSuccess) {
          setListCallHist(response.Data);
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
    const render = async () => {
      setIsLoading(true);
      await refetchCallHist();
      await refetchDynamicFields();
      setIsLoading(false);
    };
    useEffect(() => {
      render();
    }, [changeCallApi]);

    const CustomizeCampaign = ({ code }: { code: string }) => {
      let icon = "";
      let color = "#CFB929";
      match(code)
        .with("PENDING", () => {
          icon = "";
          color = "#CFB929";
        })
        .with("DONE", () => {
          icon = "ic-status-done";
          color = "#0FBC2B";
        })
        .with("FAILED", () => {
          icon = "ic-status-failed";
          color = "#D62D2D";
        })
        .with("NOANSWER", () => {
          icon = "ic-status-noanswer";
          color = "#00BEA7";
        })
        .with("CALLAGAIN", () => {
          icon = "ic-status-callagain";
          color = "#8C62D1";
        })
        .with("NOANSWERRETRY", () => {
          icon = "ic-status-noanswerretry";
          color = "#E48203";
        })
        .with("DONOTCALL", () => {
          icon = "ic-status-donotcall";
          color = "#777";
        })
        .with("FAILEDRETRY", () => {
          icon = "ic-status-failedretry";
          color = "#298EF2";
        })
        .otherwise(() => {});

      return (
        <span
          style={{
            color: color,
          }}
        >
          <i className={`${icon}`} />{" "}
          {code === "" || !code ? t("PENDING") : t(code)}
        </span>
      );
    };

    const arrayNormal: ColumnOptions[] = [
      {
        dataField: "CustomerFeedBack",
        editorType: "dxSelectBox",
        label: {
          text: t("CustomerFeedBack"),
        },
        colSpan: 2,
        editorOptions: {
          dataSource: listFeedBack,
          displayExpr: "CusFBName",
          valueExpr: "CusFBCode",
        },
        render: (param: any) => {
          const { component: formComponent, dataField } = param;
          return (
            <div className="flex align-items-center">
              <SelectBox
                dataSource={listFeedBack}
                defaultValue={formNormal?.CustomerFeedBack ?? ""}
                displayExpr="CusFBName"
                valueExpr="CusFBCode"
                onValueChanged={(data: any) => {
                  formComponent.updateData(dataField, data.value);
                }}
              ></SelectBox>
              <span
                style={{
                  color: "#E48203",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
                className="pl-5"
              >
                <CustomizeCampaign
                  code={formNormal?.CampaignCustomerStatus ?? ""}
                />
                {/* {formNormal?.CampaignCustomerStatus ?? ""} */}
              </span>
            </div>
          );
        },
      },
      {
        dataField: "Remark",
        editorType: "dxTextBox",
        label: {
          text: t("Remark"),
        },
        editorOptions: {},
        colSpan: 2,
      },
    ];

    return (
      <ScrollView style={{ height: windowSize.height - 150 }}>
        <div className="from-group p-2">
          <Form
            ref={normalRef}
            formData={formNormal}
            labelLocation="left"
            colCount={2}
          >
            {arrayNormal.map((item: any, index: number) => {
              if (item.dataField === "CustomerFeedBack") {
                return <SimpleItem {...item} key={`normal-${index}`} />;
              }
              return <SimpleItem {...item} key={`normal-${index}`} />;
            })}
          </Form>
        </div>
        <Form
          ref={ref}
          formData={formData}
          labelLocation="left"
          showRequiredMark={true}
          validationGroup="Perform-Campaign"
        >
          <GroupItem caption={`${t("Info's Detail")}`} cssClass="pl-2 pr-2">
            {dynamicFields.map((item: any, index: any) => {
              console.log("item ", item);

              let validate: any = [];
              if (item.FlagRequired === "1") {
                validate = [RequiredField(`${item.ColCodeSys} is Required!`)];
              }

              return (
                <SimpleItem
                  cssClass=""
                  dataField={item.ColCodeSys}
                  label={{
                    text: t(`${item.CampaignColCfgName}`),
                  }}
                  {...item}
                  validationRules={[...validate]}
                  key={index}
                />
              );
            })}
          </GroupItem>
        </Form>
        <HistoryCallTable
          listCallHist={listCallHist}
          dynamicFields={dynamicFields}
          dataDynamic={formData}
          isLoading={isloading}
        />
      </ScrollView>
    );
  }
);
