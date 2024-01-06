import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { usePermissions } from "@/packages/contexts/permission";
import { showErrorAtom } from "@/packages/store";
import { GridViewRaw } from "@/packages/ui/base-gridview/GridViewRaw";
import { SearchCustomerPopup } from "@/pages/admin/Cpn_Campaign/components/search-customer-popup/search-customer-popup";
import "@skycs-pages/Campaign_Perform/styles.scss";
import { useQuery } from "@tanstack/react-query";
import { Button, TagBox } from "devextreme-react";
import DataGrid from "devextreme-react/data-grid";
import { useAtomValue, useSetAtom } from "jotai";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CampaignTypeAtom,
  flagSelectorAtom,
  listCampaignAgentAtom,
  listCampaignAtom,
  visiblePopupAtom,
  visiblePopupImportAtom,
} from "../../store";
import DistrictBution_Agent from "./../PopUp/Distribution_Agent";
import History_Call from "./../PopUp/historycall";
import { UploadDialog } from "./../PopUp/upload-dialog";
import { visiblePopUpAtom, visiblePopUpDistributorAtom } from "./store";
import "./style.scss";
import { UseCustomerGridColumnsProps, useColumn } from "./use_Column";
interface Props {
  ref: any;
}

export const ListCustomerContent = forwardRef(
  (
    {
      setCurrentCode,
      handleSavingRow,
      listCampaign,
      isLoadingDynamicField,
      listDynamicField,
      defaultFieldDynamic,
      handleShowSelectCustomer,
      handleShowPopUpDistributionAgent,
      handleImport,
      handleRemoveCampaign,
      listCampaignAgent,
    }: any,
    ref
  ) => {
    const { t } = useI18n("Cpn_Campaign_List_Customer");
    const { hasButtonPermission } = usePermissions();
    const setVisiblePopup = useSetAtom(visiblePopupAtom);
    const param = useParams();
    const handleShowPopup = (paramValue: any) => {
      setVisiblePopup(true);
      setCurrentCode(
        <History_Call
          onCancel={() => {
            setCurrentCode(<></>);
            setVisiblePopup(false);
          }}
          listDynamicField={listDynamicField}
          param={paramValue}
        />
      );
    };

    const columns = useColumn({
      dataField: listDynamicField ?? {
        dataSource: [],
        dynamicField: [],
      },
      customeField: defaultFieldDynamic ?? {
        t: "",
      },
      onClick: handleShowPopup,
    } as UseCustomerGridColumnsProps);
    const handleStartEditing = (e: any) => {
      if (e.column.dataField === "AgentName") {
        e.column.editorOptions = {
          displayExpr: "UserName",
          valueExpr: "UserCode",
          dataSource: listCampaignAgent,
        };
        e.column.setCellValue = (newData: any, value: any) => {
          const item = listCampaignAgent.find(
            (item: any) => !!item && item.UserCode === value
          );
          if (item) {
            newData.AgentName = item.UserName;
            newData.AgentCode = value;
          }
        };
      }
    };
    const handleEditRowChanges = (
      e: { key: string; type: string }[] | undefined
    ) => {
      if (e) {
        // remove each item in e from listCampaign
        // console.log("remove each item in e from listCampaign", e);
        for (const item of e) {
          if (item.type === "remove") {
            handleRemoveCampaign(item.key);
          }
        }
      }
    };

    const toolbar = () => {
      if (param) {
        if (param?.flag !== "detail") {
          return [
            {
              location: "before",
              render: () => {
                return (
                  <Button
                    visible={hasButtonPermission(
                      "BTN_CAMPAIGN_CAMPAIGNMANAGER_CREATE_SELECTCUSTOM"
                    )}
                    stylingMode={"contained"}
                    type={"default"}
                    text={t("Select")}
                    onClick={() => {
                      handleShowSelectCustomer();
                    }}
                  />
                );
              },
            },
            {
              location: "before",
              render: () => {
                return (
                  <Button
                    type={"default"}
                    visible={hasButtonPermission(
                      "BTN_CAMPAIGN_CAMPAIGNMANAGER_CREATE_IMPORTEXCEL"
                    )}
                    stylingMode={"contained"}
                    text={t("Import Excel")}
                    onClick={handleImport}
                  />
                );
              },
            },
            {
              location: "before",
              render: () => {
                return (
                  <Button
                    visible={hasButtonPermission(
                      "BTN_CAMPAIGN_CAMPAIGNMANAGER_CREATE_DISTRIBUTION_AGENT"
                    )}
                    stylingMode={"contained"}
                    type={"default"}
                    onClick={handleShowPopUpDistributionAgent}
                    text={t("Distribution Agent")}
                  />
                );
              },
            },
          ];
        } else {
          return [];
        }
      } else {
        return [
          {
            location: "before",
            render: () => {
              return (
                <Button
                  stylingMode={"contained"}
                  type={"default"}
                  text={"Select"}
                  onClick={() => {
                    handleShowSelectCustomer();
                  }}
                />
              );
            },
          },
          {
            location: "before",
            render: () => {
              return (
                <Button
                  type={"default"}
                  stylingMode={"contained"}
                  text={"Import Excel"}
                  onClick={handleImport}
                />
              );
            },
          },
          {
            location: "before",
            render: () => {
              return (
                <Button
                  stylingMode={"contained"}
                  type={"default"}
                  onClick={handleShowPopUpDistributionAgent}
                  text={"Distribution Agent"}
                />
              );
            },
          },
        ];
      }
    };

    const gridContent = useMemo(() => {
      return (
        <GridViewRaw
          storeKey="Mst_CustomerCampaign"
          keyExpr={"CustomerCodeSys"}
          isLoading={isLoadingDynamicField}
          ref={ref}
          onReady={(r) => {}}
          dataSource={listCampaign}
          columns={columns}
          defaultPageSize={99999999}
          allowSelection={true}
          isHidenPaging={true}
          onSelectionChanged={() => {}}
          onSaveRow={handleSavingRow}
          inlineEditMode="row"
          onCustomerEditing={handleStartEditing}
          onEditRowChanges={handleEditRowChanges}
          toolbarItems={[...toolbar()]}
          showButton={!(param?.flag === "detail")}
        ></GridViewRaw>
      );
    }, [columns, listCampaignAgent]);
    return gridContent;
  }
);
const Cpn_Campaign_List_Customer = forwardRef(
  ({ commonRef, dynamicRef }: any, ref: ForwardedRef<DataGrid>) => {
    const { t } = useI18n("Cpn_Campaign_List_Customer");
    const { auth } = useAuth();
    const api = useClientgateApi();
    const showError = useSetAtom(showErrorAtom);
    const CampaignType = useAtomValue(CampaignTypeAtom);
    const setVisiblePopup = useSetAtom(visiblePopUpAtom);
    const setVisibleDistributionPopup = useSetAtom(visiblePopUpDistributorAtom);
    const flagSelector = useAtomValue(flagSelectorAtom);
    const param = useParams();
    console.log("param ", param);

    const [currentCode, setCurrentCode] = useState(<></>);
    const listCampaignAtomValue = useAtomValue(listCampaignAtom);
    const [listCampaign, setListCampaign] = useState<any[]>([]);
    // const [selectCampaign, setSelectCampaign] = useState<any[]>([]);
    const setVisiblePopUpImportPopup = useSetAtom(visiblePopupImportAtom);

    useEffect(() => {
      setListCampaign(listCampaignAtomValue);
    }, [listCampaignAtomValue]);
    const { data: listDynamicField, isLoading: isLoadingDynamicField } =
      useQuery({
        queryKey: ["listDynamicField", CampaignType],
        queryFn: async () => {
          if (CampaignType !== "") {
            const response = await api.Mst_CampaignType_GetByCode(
              CampaignType,
              auth.orgData?.Id ?? ""
            );
            if (response.isSuccess) {
              if (response.Data?.Lst_Mst_CustomColumnCampaignType) {
                const arr =
                  response.Data?.Lst_Mst_CustomColumnCampaignType ?? [];
                const getCodeSys = arr.map((item: any) => {
                  return item.CampaignColCfgCodeSys;
                });
                const getDynamicField = arr
                  .filter((item) => {
                    return (
                      item.CampaignColCfgDataType === "MASTERDATA" ||
                      item.CampaignColCfgDataType === "MASTERDATASELECTMULTIPLE"
                    );
                  })
                  .map((item) => item.CampaignColCfgCodeSys);
                const result = {
                  dataSource: {},
                  dynamicField: response.Data?.Lst_Mst_CustomColumnCampaignType,
                };

                if (getDynamicField.length) {
                  const responseDateSource =
                    await api.Mst_CampaignColumnConfig_GetListOption(
                      getDynamicField
                    );

                  if (responseDateSource.isSuccess) {
                    const data: any = responseDateSource.DataList ?? [];
                    const obj = data?.reduce((result: any, item: any) => {
                      result[item.CampaignColCfgCodeSys] =
                        item.Lst_MD_OptionValue;
                      return result;
                    }, {} as { [key: string]: any[] });
                    const result = {
                      dataSource: {
                        ...obj,
                      },
                      dynamicField:
                        response.Data?.Lst_Mst_CustomColumnCampaignType,
                    };
                    return result;
                  } else {
                    showError({
                      message: responseDateSource._strErrCode,
                      _strErrCode: responseDateSource._strErrCode,
                      _strTId: responseDateSource._strTId,
                      _strAppTId: responseDateSource._strAppTId,
                      _objTTime: responseDateSource._objTTime,
                      _strType: responseDateSource._strType,
                      _dicDebug: responseDateSource._dicDebug,
                      _dicExcs: responseDateSource._dicExcs,
                    });
                  }
                }
                return result;
              }

              return response.Data?.Lst_Mst_CustomColumnCampaignType ?? {};
            } else {
              return {};
            }
          } else {
            return {};
          }
        },
      });

    useImperativeHandle(
      dynamicRef,
      () => {
        return {
          dynamicFields: listDynamicField,
        };
      },
      [listDynamicField]
    );

    console.log("commonRef ", commonRef);

    const getCustomerData = async (param: string[]) => {
      const response = await api.Mst_Customer_GetByCustomerCode(param);
      if (response.isSuccess) {
        // toast.success(t("Call Success"));
        const newArr = response.Data;
        const newCustomer = newArr?.Lst_Mst_Customer ?? [];
        const newEmail = newArr?.Lst_Mst_CustomerEmail ?? [];
        const newPhone = newArr?.Lst_Mst_CustomerPhone ?? [];
        const getArr = newCustomer.map((item) => {
          const getEmail = newEmail.filter((itemEmail) => {
            return itemEmail.CustomerCodeSys === item.CustomerCodeSys;
          });
          const getDefaultEmail = getEmail.find((itemEmail) => {
            return itemEmail.FlagDefault === "1";
          });

          const getPhone = newPhone.filter((itemPhone) => {
            return itemPhone.CustomerCodeSys === item.CustomerCodeSys;
          });

          const getCurrentPhone = getPhone.find(
            (itemPhone) => itemPhone.FlagDefault === "0"
          );

          const getDefaultPhone = getPhone.find((itemPhone) => {
            return itemPhone.FlagDefault === "1";
          });

          let obj = {
            CustomerPhoneNo1: "",
            CustomerPhoneNo2: "",
            CustomerEmail: "",
            AgentCode: "",
            AgentName: "",
          };

          if (getDefaultPhone) {
            obj.CustomerPhoneNo1 = getDefaultPhone.CtmPhoneNo;
          }

          if (getCurrentPhone) {
            obj.CustomerPhoneNo2 = getCurrentPhone.CtmPhoneNo;
          } else {
            if (getDefaultPhone) {
              obj.CustomerPhoneNo2 = getDefaultPhone.CtmPhoneNo;
            }
          }

          if (getDefaultEmail) {
            obj.CustomerEmail = getDefaultEmail.CtmEmail;
          }

          return {
            ...item,
            ...obj,
          };
        });
        const arr = [...listCampaign, ...getArr];
        setListCampaign(arr);
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
    };

    const { data: getMapping, isLoading: isLoadingMapping } = useQuery({
      queryKey: ["CpnCampaign/MappingColumn"],
      queryFn: async () => {
        const response = await api.Cpn_Campaign_MappingColumn();
        if (response.isSuccess) {
          return response.Data;
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

    const defaultFieldDynamic = {};

    const handleImportExcel = async (file: File[]) => {
      if (CampaignType !== "" && CampaignType) {
        const response = await api.Cpn_Campaign_Import(file, CampaignType);
        if (response.isSuccess) {
          toast.success(t("Import Success"));
          // console.log("response __ ", response.Data);
          let obj = response.Data ?? [];
          setListCampaign([...obj]);
          setVisiblePopUpImportPopup(false);
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
          setVisiblePopUpImportPopup(false);
        }
      } else {
        toast.error(t("Please Input Campaign Type"));
      }
    };

    const exportTemplateExcel = async () => {
      if (CampaignType !== "" && CampaignType) {
        const response = await api.Cpn_Campaign_ExportTemplate(CampaignType);
        if (response.Data) {
          toast.success(t("Export template Success"));
          if (response.Data && typeof response.Data === "string") {
            window.open(response.Data, "_blank");
            setVisiblePopUpImportPopup(false);
          } else {
            toast.error(t("Dont have Url Excel"));
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
      } else {
        toast.error(t("Please Input Campaign Type"));
      }
    };

    const handleSave = async (data: any[]) => {
      if (listCampaign.length) {
        const fil = listCampaign.some((item) => {
          return data.find((itemFil) => {
            return itemFil.CustomerCodeSys === item.CustomerCodeSys;
          });
        });
        if (fil) {
          toast.error(
            t("The customer is exist so please select different customer!")
          );
        } else {
          const param = data.map((item) => {
            return item.CustomerCodeSys;
          });
          await getCustomerData(param);
          setVisiblePopup(false);
        }
      } else {
        if (data.length) {
          const param = data.map((item) => {
            return item.CustomerCodeSys;
          });
          await getCustomerData(param);
          setVisiblePopup(false);
        } else {
          setVisiblePopup(false);
        }
      }
    };

    const handleShowSelectCustomer = () => {
      setVisiblePopup(true);
    };

    const handleImport = () => {
      setVisiblePopUpImportPopup(true);
    };

    const handleSavingRow = useCallback(
      (e: any) => {
        e.cancel = false;
      },
      [listCampaign]
    );

    const handleSaveDistrictButionAgent = (data: any): void => {
      setListCampaign(data);
      toast.success(t("district bution success"));
    };

    const handleShowPopUpDistributionAgent = () => {
      if (listCampaignAgentValue.length) {
        setVisibleDistributionPopup(true);
      } else {
        toast.error(t("Please choose atleast one agent to districtbute"));
      }
    };

    const listCampaignAgentValue = useAtomValue(listCampaignAgentAtom);

    const handleRemoveCampaign = (key: string) => {
      const newArr = [...listCampaign].filter((item) => {
        return item.CustomerCodeSys !== key;
      });
      setListCampaign(newArr);
    };

    const campaignCustomerStatuses = useMemo(() => {
      return [
        { Code: "", Title: "Tất cả", icon: "", color: "" },
        {
          Code: "PENDING",
          Title: "Chưa thực hiện",
          icon: "ic-status-pending",
          color: "#CFB929",
        },
        {
          Code: "DONE",
          Title: "Thành công",
          icon: "ic-status-done",
          color: "#0FBC2B",
        },
        {
          Code: "FAILED",
          Title: "Thực hiện cuộc gọi lỗi",
          icon: "ic-status-failed",
          color: "#D62D2D",
        },
        {
          Code: "NOANSWER",
          Title: "Đã gọi nhưng không nghe máy",
          icon: "ic-status-noanswer",
          color: "#00BEA7",
        },
        {
          Code: "CALLAGAIN",
          Title: "Hẹn gọi lại",
          icon: "ic-status-callagain",
          color: "#8C62D1",
        },
        {
          Code: "NOANSWERRETRY",
          Title: "Đã gọi hết số lượt nhưng không nghe máy",
          icon: "ic-status-noanswerretry",
          color: "#E48203",
        },
        {
          Code: "DONOTCALL",
          Title: "Không liên hệ",
          icon: "ic-status-donotcall",
          color: "#777",
        },
        {
          Code: "FAILEDRETRY",
          Title: " Đã gọi hết số lượt nhưng cuộc gọi vẫn lỗi",
          icon: "ic-status-failedretry",
          color: "#298EF2",
        },
      ];
    }, []);

    const isNullOrEmpty = function (_value: any) {
      if (
        _value !== undefined &&
        _value !== null &&
        _value.toString().trim().length > 0
      ) {
        return false;
      }
      return true;
    };

    const returnValue = function (_data: any) {
      var value = "";
      if (!isNullOrEmpty(_data)) {
        value = _data.toString().trim();
      }
      return value;
    };

    const handleSearch = (value: string[]) => {
      if (ref?.current) {
        ref?.current?.instance.filter(function (itemData: any) {
          if (value.length && !value.includes("")) {
            return value.includes(returnValue(itemData.CampaignCustomerStatus));
          }
          return true;
        });
      }
    };
    return (
      <>
        {param?.flag && param?.flag === "detail" && (
          <div className="w-[400px] box-status">
            <p className="mr-2">{t("Status")}</p>
            <TagBox
              className=""
              dataSource={campaignCustomerStatuses}
              valueExpr="Code"
              displayExpr="Title"
              onValueChanged={({ value }) => {
                handleSearch(value);
              }}
              itemRender={(item) => {
                // console.log("icon ", item.icon);
                return (
                  <span style={{ color: item.color }} className="p-1">
                    <i className={`${item.icon} mr-2`} />
                    {item.Title}
                  </span>
                );
              }}
            ></TagBox>
          </div>
        )}
        <ListCustomerContent
          ref={ref}
          setCurrentCode={setCurrentCode}
          handleSavingRow={handleSavingRow}
          listCampaign={listCampaign}
          isLoadingDynamicField={isLoadingDynamicField}
          listDynamicField={listDynamicField}
          defaultFieldDynamic={getMapping ?? defaultFieldDynamic}
          handleShowSelectCustomer={handleShowSelectCustomer}
          handleShowPopUpDistributionAgent={handleShowPopUpDistributionAgent}
          handleImport={handleImport}
          handleRemoveCampaign={handleRemoveCampaign}
          listCampaignAgent={listCampaignAgentValue}
        />
        <SearchCustomerPopup
          onSave={handleSave}
          onCancel={() => {
            setVisiblePopup(false);
          }}
        />
        <DistrictBution_Agent
          ref={ref}
          onSave={handleSaveDistrictButionAgent}
          listCustomer={listCampaign}
          onCancel={() => {
            setVisibleDistributionPopup(false);
          }}
        />

        <UploadDialog
          onUpload={handleImportExcel}
          onDownloadTemplate={exportTemplateExcel}
          onCancel={() => {
            setVisiblePopUpImportPopup(false);
          }}
        />
        {currentCode}
      </>
    );
  }
);

export default Cpn_Campaign_List_Customer;