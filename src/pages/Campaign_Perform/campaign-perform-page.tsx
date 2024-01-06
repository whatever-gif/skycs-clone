import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";
import { usePhone } from "@/packages/hooks/usePhone";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { showErrorAtom } from "@/packages/store";
import {
  CcCall,
  Cpn_CampaignCustomerData,
  FlagActiveEnum,
} from "@/packages/types";
import { Icon } from "@/packages/ui/icons";
import { ColumnOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Form,
  LoadPanel,
  ScrollView,
  SelectBox,
  TagBox,
} from "devextreme-react";
import { SimpleItem } from "devextreme-react/form";
import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Avatar } from "../eticket/components/avatar";
import { Cpn_CampaignInfo } from "./components/campaign_info";
import { Cpn_CampaignPerformDetail } from "./components/cpn_perform_detail";
import { Cpn_CustomerInfo } from "./components/customer_info";
import { changeCallApiAtom } from "./components/store";
import "./styles.scss";

export const Cpn_CampaignPerformPage = () => {
  let objRef: any = useRef(undefined);
  const windowSize = useWindowSize();
  const [currentCpnCustomer, setCurrentCpnCustomer] =
    useState<Cpn_CampaignCustomerData | null>(null);
  const onItemSelected = (item: Cpn_CampaignCustomerData) => {
    setCurrentCpnCustomer(item);
  };

  const { t } = useI18n("Cpn_CampaignPerformPage");
  const formSearchRef = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const { auth } = useAuth();
  // const [campaignListData, setCampaignListData] = useState<
  //   (Cpn_Campaign | undefined)[]
  // >([]);

  const [formData, setFormData] = useState({
    Status: ["NOANSWER", "CALLAGAIN", "FAILED", "PENDING"],
  });

  const [selectedCp, setSelectedCp] = useState<any>(null);
  const customerRef: any = useRef(null);
  const formDynamicRef: any = useRef(null);
  const normalRef: any = useRef(null);
  const api = useClientgateApi();
  const phone = usePhone();
  const setChangeCallApi = useSetAtom(changeCallApiAtom);

  const [campaignSearchConditions] = useState<any>({
    FlagActive: FlagActiveEnum.Active,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    CampaignTypeName: "",
    CampaignTypeDesc: "",
    CampaignStatus: "STARTED,CONTINUED",
  });

  const {
    data: campaignListData,
    isLoading: isLoadingCampaignList,
    refetch: refetchCampaign,
  } = useQuery({
    queryKey: [
      "Cpn_CampaignPerformPage",
      JSON.stringify(campaignSearchConditions),
    ],
    queryFn: async () => {
      const response = await api.Cpn_Campaign_Search(campaignSearchConditions);
      if (response.isSuccess) {
        if (response.DataList) {
          return response.DataList ?? [];
        }
        return [];
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
        return [];
      }
    },
  });

  // const refetchCampaignList = async () => {
  //   const response = await api.Cpn_Campaign_Search(campaignSearchConditions);
  //   if (response.isSuccess) {
  //     if (response.DataList) setCampaignListData(response.DataList);
  //   } else {
  //     showError({
  //       message: (response.errorCode),
  //       debugInfo: response.debugInfo,
  //       errorInfo: response.errorInfo,
  //     });
  //   }
  // };

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

  useEffect(() => {
    refetchCampaign();
  }, []);

  const [campaignCustomerData, setCampaignCustomerData] = useState<
    (Cpn_CampaignCustomerData | undefined)[]
  >([]);

  const [renderCustomer, setrenderCustomer] = useState<
    (Cpn_CampaignCustomerData | undefined)[]
  >([]);
  const refetchCampaignCustomer = async () => {
    if (!!selectedCp && selectedCp !== "") {
      const response = await api.Cpn_CampaignCustomer_Get({
        CampaignCode: selectedCp,
      });
      if (response.isSuccess && !!response.Data) {
        const list = response.Data ?? [];
        if (list.length && currentCpnCustomer) {
          const findItem = list.find(
            (item: any) =>
              item.CampaignCode === currentCpnCustomer?.CampaignCode
          );
          setCurrentCpnCustomer(findItem);
        } else {
          if (currentCpnCustomer === null) {
          } else {
            setCurrentCpnCustomer(null);
          }
        }

        setCampaignCustomerData(list);
        setrenderCustomer(
          list.filter((item: any) =>
            formData.Status.includes(item.CampaignCustomerStatus)
          )
        );
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

  useEffect(() => {
    refetchCampaignCustomer();
  }, [selectedCp]);

  const doCall = (phoneNo: any) => {
    // objCpn_CampaignCustomerData.CallID = undefined;
    phone.call(phoneNo, (call: CcCall) => {
      objRef.current = call.Id;
    });
  };

  const handleSave = async (text: string) => {
    if (selectedCp) {
      let value: any = {
        customer: {},
        dynamic: {},
        normal: {},
      };
      if (
        customerRef?.current &&
        formDynamicRef?.current &&
        normalRef?.current
      ) {
        if (formDynamicRef.current) {
          const { isValid } = formDynamicRef.current._instance.validate();
          if (isValid) {
            value.customer = customerRef?.current.instance.option("formData");
            value.dynamic = formDynamicRef?.current.instance.option("formData");
            value.normal = normalRef?.current.instance.option("formData");
            const obj = {
              CpnCustomerSaveType: text,
              CampaignCode: currentCpnCustomer?.CampaignCode,
              OrgID: value.customer?.OrgID,
              Idx: currentCpnCustomer?.Idx ?? "",
              AgentCode: currentCpnCustomer?.AgentCode,
              CustomerName: value.customer?.CustomerName,
              CustomerEmail: value.customer?.CustomerEmail,
              CustomerAddress: value.customer?.CustomerAddress,
              CustomerCompany: currentCpnCustomer?.CustomerCompany ?? "",
              JsonCustomerInfo: JSON.stringify(value.dynamic),
              CustomerFeedBack: value.normal?.CustomerFeedBack,
              Remark: value.normal?.Remark ?? "",
              CallID: objRef.current,
            };
            if (objRef.current !== "" && objRef.current) {
              const response = await api.Cpn_CampaignCustomer_Save(obj);
              if (response.isSuccess) {
                toast.success(t(`${text} Success`));
                objRef.current = undefined;
                setChangeCallApi(nanoid());
                refetchCampaignCustomer();
                setTimeout(() => {
                  hanldleClickSearch();
                }, 1000);
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
              toast.error("Không thể thêm dữ liệu");
            }
          } else {
            toast.error(t("Please"));
          }
        }
      }
    } else {
      toast.error(t("Please Input Campaign"));
    }
  };

  console.log("renderCustomer ", renderCustomer);

  const CustomerItem = ({ item }: { item: Cpn_CampaignCustomerData }) => {
    const phoneNo = useMemo(() => {
      let r = item.CustomerPhoneNo1;
      if (!r || r == "") r = item.CustomerPhoneNo2;
      if (!r || r == "") r = item.CustomerPhoneNo;

      return r;
    }, [item]);
    return (
      <div className={`customer-item`}>
        <div
          className="flex  cursor-pointer"
          onClick={() => onItemSelected(item)}
        >
          <div>
            <div className="flex align-items-center">
              <Avatar
                img={item.CustomerAvatarPath}
                name={item.CustomerName}
                className={"mr-2 ml-1"}
              />
              <span className="customer-name">{item.CustomerName}</span>
            </div>
            <p className="customer-phone">{phoneNo}</p>
          </div>
        </div>
        {!!phoneNo && (
          <Button
            className="btn-call"
            onClick={() => {
              onItemSelected(item);
              doCall(phoneNo);
            }}
          >
            <Icon name="phone"></Icon>
          </Button>
        )}
      </div>
    );
  };

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

  const hanldleClickSearch = () => {
    if (formSearchRef.current) {
      const formSearch = formSearchRef?.current?.instance.option("formData");
      const list = [...campaignCustomerData] ?? [];
      console.log("formSearch ", formSearch);

      debugger;
      const value = list.filter((item: any) => {
        if (!isNullOrEmpty(formSearch.Keyword) && formSearch.Status.length) {
          return (
            (returnValue(item.CustomerCode).includes(formSearch.Keyword) ||
              returnValue(item.CustomerName).includes(formSearch.Keyword) ||
              returnValue(item.CustomerEmail).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo1).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo2).includes(
                formSearch.Keyword
              )) &&
            formSearch.Status.includes(returnValue(item.CampaignStatus))
          );
        } else {
          if (!isNullOrEmpty(formSearch.Keyword)) {
            return (
              returnValue(item.CustomerCode).includes(formSearch.Keyword) ||
              returnValue(item.CustomerName).includes(formSearch.Keyword) ||
              returnValue(item.CustomerEmail).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo1).includes(formSearch.Keyword) ||
              returnValue(item.CustomerPhoneNo2).includes(formSearch.Keyword)
            );
          } else if (formSearch.Status.length) {
            if (formSearch.Status.includes("")) {
              return true;
            } else {
              return formSearch.Status.includes(
                returnValue(item.CampaignCustomerStatus)
              );
            }
          } else {
            return true;
          }
        }
      });
      setrenderCustomer(value);
      return;
    }
    setrenderCustomer([...campaignCustomerData]);
    return;
  };

  const arrayField: ColumnOptions[] = [
    {
      dataField: "Status",
      editorType: "dxTagBox",
      label: {
        text: t("Status"),
      },
      editorOptions: {
        dataSource: campaignCustomerStatuses,
        displayExpr: "Title",
        valueExpr: "Code",
      },
      render: (param: any) => {
        const { dataField, component: formComponent } = param;
        return (
          <TagBox
            className="mb-2"
            defaultValue={formData.Status}
            height={30}
            onValueChange={(data) => {
              formComponent.updateData(dataField, data);
            }}
            dataSource={campaignCustomerStatuses}
            searchEnabled={true}
            displayExpr="Title"
            valueExpr={"Code"}
            itemRender={(item) => (
              <span
                className={`p-1 status-${item.Code.toLowerCase()}`}
                style={{ color: item.color }}
              >
                <i className={`${item.icon} mr-2`} />
                {item.Title}
              </span>
            )}
          />
        );
      },
    },
    {
      dataField: "Keyword",
      label: {
        text: t("Keyword"),
      },
      editorType: "dxTextBox",
      editorOptions: {
        height: 30,
      },
    },
  ];

  return (
    <AdminContentLayout className={"Cpn_CampaignPerformPage"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="font-bold font-header dx-font-m">
              {t("Campaign_Perform")}
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot name={"After"}>
            <PermissionContainer
              permission={"BTN_CAMPAIGN_CAMPAIGN_PERFORM_SAVE"}
            >
              <Button
                className="mr-1"
                stylingMode={"contained"}
                type="default"
                text={"Lưu"}
                onClick={() => handleSave("SAVE")}
              />
            </PermissionContainer>

            <PermissionContainer
              permission={"BTN_CAMPAIGN_CAMPAIGN_PERFORM_CALLBACK"}
            >
              <Button
                className="mr-1"
                stylingMode={"contained"}
                type="default"
                text={"Hẹn gọi lại"}
                onClick={() => handleSave("CALLAGAIN")}
              />
            </PermissionContainer>

            <PermissionContainer permission="BTN_CAMPAIGN_CAMPAIGN_PERFORM_NOANSWER">
              <Button
                className="mr-1"
                stylingMode={"contained"}
                type="default"
                text={"Không liên hệ"}
                onClick={() => handleSave("DONOTCALL")}
              />
            </PermissionContainer>
          </PageHeaderNoSearchLayout.Slot>
        </PageHeaderNoSearchLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div
          className="w-full"
          style={{ background: "#f9f9f9", height: windowSize.height - 120 }}
        >
          <LoadPanel visible={isLoadingCampaignList} />
          <ResponsiveBox className={"w-full campaign-perform-page-content"}>
            <Row></Row>
            <Col ratio={2}></Col>
            <Col ratio={5}></Col>
            <Col ratio={2}></Col>
            <Item>
              <Location row={0} col={0} />
              <LoadPanel visible={isLoadingCampaignList} />
              {!isLoadingCampaignList && (
                <div className="w-full pr-1 pl-1" style={{ overflow: "auto" }}>
                  <div
                    className="w-full"
                    style={{
                      background: "#fff",
                      height: windowSize.height - 120,
                    }}
                  >
                    <div className="w-full p-2 header-perform">
                      <span
                        className="block"
                        style={{
                          marginBottom: "6px",
                          fontSize: "14px",
                          color: "#5f7d95",
                        }}
                      >
                        Chiến dịch
                      </span>
                      <SelectBox
                        className="mb-2"
                        onSelectionChanged={(ddata) => {
                          setSelectedCp(ddata.selectedItem.CampaignCode);
                        }}
                        onValueChange={() => {
                          setCurrentCpnCustomer(null);
                        }}
                        value={selectedCp}
                        dataSource={campaignListData}
                        searchEnabled={true}
                        valueExpr="CampaignCode"
                        displayExpr="CampaignName"
                      />
                      <Form
                        className="campaign-perform"
                        formData={formData}
                        ref={formSearchRef}
                      >
                        {arrayField.map((item: any, index: number) => {
                          return <SimpleItem {...item} key={index} />;
                        })}
                      </Form>

                      <PermissionContainer permission="BTN_CAMPAIGN_CAMPAIGN_PERFORM_SEARCH">
                        <Button
                          style={{ marginTop: "14px" }}
                          className="mr-2"
                          width={"100%"}
                          stylingMode={"contained"}
                          type="default"
                          text={t("Search")}
                          onClick={(event: any) => {
                            hanldleClickSearch();
                          }}
                        />
                      </PermissionContainer>

                      {!!campaignCustomerData &&
                        campaignCustomerData.length > 0 && (
                          <div className="h-full">
                            <div className="w-full pt-3 pb-2">
                              <strong className="float-left">
                                Danh sách khách hàng
                              </strong>
                              <span className="text-grey float-right">
                                {t("totle")} {renderCustomer.length}
                              </span>
                            </div>

                            <ScrollView className="pt-1">
                              <div className="w-full">
                                {renderCustomer.map(
                                  (
                                    item: Cpn_CampaignCustomerData | undefined
                                  ) => {
                                    return item ? (
                                      <CustomerItem
                                        key={nanoid()}
                                        item={item}
                                      />
                                    ) : (
                                      <></>
                                    );
                                  }
                                )}
                              </div>
                            </ScrollView>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </Item>
            <Item>
              <Location row={0} col={1} />

              <div className="w-full pr-1">
                <div
                  className="w-full"
                  style={{
                    background: "#fff",
                    height: windowSize.height - 120,
                  }}
                >
                  {currentCpnCustomer != null && (
                    <Cpn_CampaignPerformDetail
                      ref={formDynamicRef}
                      normalRef={normalRef}
                      cpnCustomerData={currentCpnCustomer}
                    />
                  )}
                </div>
              </div>
            </Item>

            <Item>
              <Location row={0} col={2} />
              <div
                className="w-full"
                style={{ background: "#fff", height: windowSize.height - 120 }}
              >
                <ScrollView style={{ height: windowSize.height - 120 }}>
                  <div className="w-full">
                    {currentCpnCustomer != null && (
                      <Cpn_CustomerInfo
                        ref={customerRef}
                        cpnCustomerData={currentCpnCustomer}
                      />
                    )}

                    {currentCpnCustomer != null &&
                      campaignListData != null &&
                      campaignListData.length > 0 &&
                      selectedCp && (
                        <Cpn_CampaignInfo
                          cpnCampainData={campaignListData.find(
                            (c) => c?.CampaignCode == selectedCp
                          )}
                          cpnCustomerData={currentCpnCustomer}
                        />
                      )}
                  </div>
                </ScrollView>
              </div>
            </Item>
          </ResponsiveBox>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
