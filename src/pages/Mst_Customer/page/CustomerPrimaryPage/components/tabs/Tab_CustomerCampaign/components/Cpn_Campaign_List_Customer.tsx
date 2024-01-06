import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import { BaseGridView } from "@/packages/ui/base-gridview";
import { UploadDialog } from "@/packages/ui/upload-dialog/upload-dialog";
import {
  UseCustomerGridColumnsProps,
  useColumn,
} from "@/pages/admin/Cpn_Campaign/components/Components/Cpn_Campaign_List_Customer/use_Column";
import DistrictBution_Agent from "@/pages/admin/Cpn_Campaign/components/Components/PopUp/Distribution_Agent";
import History_Call from "@/pages/admin/Cpn_Campaign/components/Components/PopUp/historycall";
import { SearchCustomerPopup } from "@/pages/admin/Cpn_Campaign/components/search-customer-popup/search-customer-popup";
import {
  CampaignTypeAtom,
  flagSelectorAtom,
  listCampaignAgentAtom,
  listCampaignAtom,
  visiblePopupAtom,
} from "@/pages/admin/Cpn_Campaign/components/store";
import "@skycs-pages/Campaign_Perform/styles.scss";
import { useQuery } from "@tanstack/react-query";
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
import "./style.scss";
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
    const setVisiblePopup = useSetAtom(visiblePopupAtom);
    const param = useParams();
    const handleShowPopup = (param: any) => {
      setVisiblePopup(true);
      setCurrentCode(
        <History_Call
          onCancel={() => {
            setCurrentCode(<></>);
            setVisiblePopup(false);
          }}
          param={param}
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
      return [];
    };

    const gridContent = useMemo(() => {
      return (
        <div className="h-full w-full">
          <BaseGridView
            storeKey="Mst_CustomerCampaign"
            keyExpr={"CustomerCodeSys"}
            isLoading={isLoadingDynamicField}
            ref={ref}
            onReady={(r) => {}}
            dataSource={listCampaign}
            columns={columns}
            allowSelection={true}
            onSelectionChanged={() => {}}
            onSaveRow={handleSavingRow}
            inlineEditMode="row"
            onCustomerEditing={handleStartEditing}
            onEditRowChanges={handleEditRowChanges}
            toolbarItems={[...toolbar()]}
            showCheck={false}
            editable={false}
          ></BaseGridView>
        </div>
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
    const setVisiblePopup = useSetAtom(visiblePopupAtom);
    const [listCampaign, setListCampaign] = useState<any[]>([]);
    const flagSelector = useAtomValue(flagSelectorAtom);
    const [currentCode, setCurrentCode] = useState(<></>);
    const listCampaignAtomValue = useAtomValue(listCampaignAtom);
    // const [selectCampaign, setSelectCampaign] = useState<any[]>([]);
    useEffect(() => {
      const newArr = listCampaignAtomValue
        .map((item) => {
          return {
            ...item,
            UserCode: item.AgentCode,
          };
        })
        .map((item) => {
          delete item.AgentCode;
          return item;
        });

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
                console.log("arr ", arr);
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

    const getCustomerData = async (param: string[]) => {
      const response = await api.Mst_Customer_GetByCustomerCode(param);
      if (response.isSuccess) {
        toast.success(t("Get Customer Success"));
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

    const onClosePopup = () => {
      setVisiblePopup(false);
      setCurrentCode(<></>);
    };

    const handleImportExcel = async (file: File[]) => {
      if (CampaignType !== "" && CampaignType) {
        const response = await api.Cpn_Campaign_Import(file, CampaignType);
        if (response.isSuccess) {
          toast.success(t("Import Success"));
          const obj = response.Data;
          setListCampaign([...obj]);
          setCurrentCode(<></>);
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
          setCurrentCode(<></>);
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
            setCurrentCode(<></>);
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
        const fil = listCampaign.every((item) => {
          return data.find(
            (itemFil) => itemFil.CustomerCodeSys === item.CustomerCodeSys
          );
        });
        if (fil) {
          toast.error(
            "The customer is exist so please select different customer!"
          );
        } else {
          const param = data.map((item) => {
            return item.CustomerCodeSys;
          });
          await getCustomerData(param);
          onClosePopup();
        }
      } else {
        if (data.length) {
          const param = data.map((item) => {
            return item.CustomerCodeSys;
          });
          await getCustomerData(param);
          onClosePopup();
        } else {
          onClosePopup();
        }
      }
    };

    const handleShowSelectCustomer = () => {
      setVisiblePopup(true);
      setCurrentCode(
        <SearchCustomerPopup
          onSave={handleSave}
          onCancel={() => {
            setCurrentCode(<></>);
          }}
        />
      );
    };

    const handleImport = () => {
      setCurrentCode(
        <UploadDialog
          visible={true}
          onUpload={handleImportExcel}
          onDownloadTemplate={exportTemplateExcel}
          onCancel={() => {
            setCurrentCode(<></>);
          }}
        />
      );
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
      setVisiblePopup(true);
      setCurrentCode(
        <DistrictBution_Agent
          onSave={handleSaveDistrictButionAgent}
          listCustomer={listCampaign}
          onCancel={() => {
            setCurrentCode(<></>);
          }}
        />
      );
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
          if (value.length) {
            return value.includes(returnValue(itemData.CampaignStatus));
          }
          return true;
        });
      }
    };
    return (
      <>
        {/* {flagSelector !== "add" && (
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
                console.log("icon ", item.icon);
                return (
                  <span style={{ color: item.color }} className="p-1">
                    <i className={`${item.icon} mr-2`} />
                    {item.Title}
                  </span>
                );
              }}
            ></TagBox>
          </div>
        )} */}
        <div className="h-full">
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
        </div>

        {currentCode}
      </>
    );
  }
);

export default Cpn_Campaign_List_Customer;
