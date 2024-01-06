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
  Cpn_Campaign,
  Cpn_CampaignCustomerData,
  FlagActiveEnum,
} from "@/packages/types";
import { Button, ScrollView, SelectBox, TextBox } from "devextreme-react";
import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "../eticket/components/avatar";
import { Cpn_CampaignInfo } from "./components/campaign_info";
import { Cpn_CampaignPerformDetail } from "./components/cpn_perform_detail";
import { Cpn_CustomerInfo } from "./components/customer_info";
import "./styles.scss";

export const Cpn_CampaignPerformPageTuyenBA = () => {
  const windowSize = useWindowSize();
  const [currentCpnCustomer, setCurrentCpnCustomer] =
    useState<Cpn_CampaignCustomerData | null>(null);
  const onItemSelected = (item: Cpn_CampaignCustomerData) => {
    setCurrentCpnCustomer(item);
  };

  const { t } = useI18n("Cpn_CampaignPerformPageTuyenBA");
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const { auth } = useAuth();
  const [campaignListData, setCampaignListData] = useState<
    (Cpn_Campaign | undefined)[]
  >([]);
  const [selectedCp, setSelectedCp] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<any>("");
  const customerRef: any = useRef(null);
  const formDynamicRef: any = useRef(null);
  const api = useClientgateApi();
  const phone = usePhone();

  console.log("phone", phone);

  const [campaignSearchConditions] = useState<any>({
    FlagActive: FlagActiveEnum.Active,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    CampaignTypeName: "",
    CampaignTypeDesc: "",
  });

  const refetchCampaignList = async () => {
    const response = await api.Cpn_Campaign_Search(campaignSearchConditions);

    if (response.isSuccess) {
      if (response.DataList) setCampaignListData(response.DataList);
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
    refetchCampaignList();
  }, []);

  const [cpCustomerSearchConditions, setCpCustomerSearchConditions] =
    useState<any>({
      CampaignCode: null,
      CampaignCustomerStatus: null,
      CustomerCodeSys: null,
    });

  const [campaignCustomerData, setCampaignCustomerData] = useState<
    (Cpn_CampaignCustomerData | undefined)[]
  >([]);

  const refetchCampaignCustomer = async () => {
    if (!!selectedCp && selectedCp !== "") {
      const response = await api.Cpn_CampaignCustomer_Get({
        CampaignCode: selectedCp,
        CampaignCustomerStatus: selectedStatus,
        //CustomerCodeSys: null
      });

      if (response.isSuccess && !!response.Data) {
        setCampaignCustomerData(response.Data);
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
    phoneNo = "0983712383";
    phone.call(phoneNo, (ret: CcCall) => {
      console.log("new call", ret);
    });
  };

  const handleSave = () => {
    let value = {
      customer: {},
      dynamic: {},
    };
    if (customerRef?.current) {
      value.customer = customerRef?.current.instance.option("formData");
    }
    if (formDynamicRef?.current) {
      value.dynamic = formDynamicRef?.current.instance.option("formData");
    }
  };

  const CustomerItem = ({ item }: { item: Cpn_CampaignCustomerData }) => {
    const phoneNo = useMemo(() => {
      let r = item.CustomerPhoneNo1;
      if (!r || r == "") r = item.CustomerPhoneNo2;
      if (!r || r == "") r = item.CustomerPhoneNo;

      return r;
    }, [item]);
    return (
      <div className="customer-item">
        <div
          className="flex  cursor-pointer"
          onClick={() => onItemSelected(item)}
        >
          <Avatar
            img={item.CustomerAvatarPath}
            name={item.CustomerName}
            className={"mr-2"}
          />
          <div>
            <span>{item.CustomerName}</span>
            <br />
            <span>{phoneNo}</span>
          </div>
        </div>
        {!!phoneNo && (
          <Button
            icon="tel"
            className="btn-call"
            onClick={() => {
              doCall(phoneNo);
            }}
          ></Button>
        )}
      </div>
    );
  };

  return (
    <AdminContentLayout className={"Cpn_CampaignPerformPage"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="text-header font-bold dx-font-m">
              Thực hiện chiến dịch
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot name={"After"}>
            <Button
              className="mr-2"
              stylingMode={"contained"}
              type="default"
              text={"Lưu"}
              onClick={handleSave}
            />
            <Button
              className="mr-2"
              stylingMode={"contained"}
              type="default"
              text={"Hẹn gọi lại"}
            />
            <Button
              className="mr-2"
              stylingMode={"contained"}
              type="default"
              text={"Không liên hệ"}
            />
          </PageHeaderNoSearchLayout.Slot>
        </PageHeaderNoSearchLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div
          className="w-full"
          style={{ background: "#f9f9f9", height: windowSize.height - 120 }}
        >
          <ResponsiveBox className={"w-full"}>
            <Row></Row>
            <Col ratio={2}></Col>
            <Col ratio={5}></Col>
            <Col ratio={2}></Col>
            <Item>
              <Location row={0} col={0} />
              {campaignListData.length > 0 && (
                <div className="w-full pr-1 pl-1">
                  <div
                    className="w-full"
                    style={{
                      background: "#fff",
                      height: windowSize.height - 120,
                    }}
                  >
                    <div className="w-full p-2">
                      <span className="text-gray">Chiến dịch</span>
                      <SelectBox
                        className="mb-2"
                        onSelectionChanged={(ddata) => {
                          setSelectedCp(ddata.selectedItem.CampaignCode);
                        }}
                        value={selectedCp}
                        dataSource={campaignListData}
                        searchEnabled={true}
                        valueExpr="CampaignCode"
                        displayExpr="CampaignName"
                      />

                      <span className="text-gray">Trạng thái thực hiện</span>
                      <SelectBox
                        className="mb-2"
                        // onValueChange={(data) => {
                        //   console.log("dataChange");
                        // }}
                        onSelectionChanged={(data) => {
                          setSelectedStatus(data.selectedItem.Code);
                        }}
                        dataSource={campaignCustomerStatuses}
                        searchEnabled={true}
                        displayExpr="Title"
                        value={selectedStatus}
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
                      <span className="text-gray">Khách hàng</span>
                      <TextBox placeholder="Nhập để tìm kiếm..."></TextBox>

                      {!!campaignCustomerData &&
                        campaignCustomerData.length > 0 && (
                          <>
                            <div className="w-full pt-3 pb-2">
                              <strong className="float-left">
                                Danh sách khách hàng
                              </strong>
                              <span className="text-grey float-right">
                                tổng: {campaignCustomerData.length}
                              </span>
                            </div>

                            <ScrollView
                              style={{ height: windowSize.height - 350 }}
                              className="pt-1"
                            >
                              <div className="w-full">
                                {campaignCustomerData.map(
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
                          </>
                        )}
                    </div>
                  </div>
                </div>
              )}
              {/* 
                        <ScrollView style={{ maxHeight: scrollHeight }}>

                            <div className="w-full" style={{ background: "#F5F7F9" }}>
                                <PartReply></PartReply>
                                <PartMessageList data={data} />
                            </div>
                        </ScrollView> */}
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
                      cpnCustomerData={currentCpnCustomer}
                    />
                  )}
                </div>
              </div>
            </Item>

            <Item>
              <Location row={0} col={2} />
              {/* <PartDetailInfo data={data} /> */}
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
