import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { showErrorAtom } from "@/packages/store";
import { Cpn_CampaignCustomerData, FlagActiveEnum } from "@/packages/types";
import { Avatar } from "@/pages/eticket/components/avatar";
import { useQuery } from "@tanstack/react-query";
import { Button, ScrollView, SelectBox, TextBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
export const CpnCustomerList = ({
  onItemSelected,
  onCallBtnClick,
}: {
  onItemSelected: any;
  onCallBtnClick: any;
}) => {
  const windowSize = useWindowSize();

  const { t } = useI18n("Cpn_CampaignPerformPage");
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const { auth } = useAuth();

  const api = useClientgateApi();

  const [campaignSearchConditions] = useState<any>({
    FlagActive: FlagActiveEnum.Active,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    CampaignTypeName: "",
    CampaignTypeDesc: "",
  });

  const {
    data: campaignListData,
    isLoading: isLoadingCampaignList,
    refetch: refetchCampaignList,
  } = useQuery(
    ["Cpn_CampaignPerformPage", JSON.stringify(campaignSearchConditions)],
    async () => {
      const response = await api.Cpn_Campaign_Search(campaignSearchConditions);
      if (response.isSuccess) {
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
    }
  );

  const campaignCustomerStatuses = useMemo(() => {
    return [
      { Code: "", Title: "Tất cả", icon: "", color: "" },
      {
        Code: "PENDING",
        Title: "Chưa thực hiện",
        icon: "dx-icon-tel",
        color: "red",
      },
      { Code: "DONE", Title: "Thành công", icon: "dx-icon-tel", color: "red" },
      {
        Code: "FAILED",
        Title: "Thực hiện cuộc gọi lỗi",
        icon: "dx-icon-tel",
        color: "red",
      },
      {
        Code: "NOANSWER",
        Title: "Đã gọi nhưng không nghe máy",
        icon: "dx-icon-tel",
        color: "red",
      },
      {
        Code: "CALLAGAIN",
        Title: "Hẹn gọi lại",
        icon: "dx-icon-tel",
        color: "red",
      },
      {
        Code: "NOANSWERRETRY",
        Title: "Đã gọi hết số lượt nhưng không nghe máy",
        icon: "dx-icon-tel",
        color: "red",
      },
      {
        Code: "DONOTCALL",
        Title: "Không liên hệ",
        icon: "dx-icon-tel",
        color: "red",
      },
      {
        Code: "FAILEDRETRY",
        Title: " Đã gọi hết số lượt nhưng cuộc gọi vẫn lỗi",
        icon: "dx-icon-tel",
        color: "red",
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

  const {
    data: campaignCustomerData,
    isLoading: isLoadingCampaignCustomer,
    refetch: refetchCampaignCustomer,
  } = useQuery(
    ["Cpn_CampaignPerformPage", JSON.stringify(cpCustomerSearchConditions)],
    async () => {
      if (!!cpCustomerSearchConditions.CampaignCode) {
        const response = await api.Cpn_CampaignCustomer_Get(
          cpCustomerSearchConditions
        );
        if (response.isSuccess) {
          console.log(response);
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
      } else return { Data: [] };
    }
  );

  useEffect(() => {
    if (!!cpCustomerSearchConditions.CampaignCode) refetchCampaignCustomer();
  }, [cpCustomerSearchConditions]);

  const [selectedCp, setSelectedCp] = useState<any>("");
  const [selectedStatus, setSelectedStatus] = useState<any>("");

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
          onClick={() => {
            onItemSelected(item);
          }}
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
              onCallBtnClick(phoneNo);
              return false;
            }}
          ></Button>
        )}
      </div>
    );
  };
  return (
    <div className="w-full p-2">
      <span className="text-gray">Chiến dịch</span>
      <SelectBox
        className="mb-2"
        onSelectionChanged={(data) => {
          setCpCustomerSearchConditions((old: any) => {
            var o = { ...old };
            o.CampaignCode = data.selectedItem.CampaignCode;
            console.log(o);
            return o;
          });

          setSelectedCp(data.selectedItem.CampaignCode);
        }}
        value={selectedCp}
        dataSource={campaignListData?.DataList}
        searchEnabled={true}
        valueExpr="CampaignCode"
        displayExpr="CampaignName"
      />

      <span className="text-gray">Trạng thái thực hiện</span>
      <SelectBox
        className="mb-2"
        onSelectionChanged={(data) => {
          setCpCustomerSearchConditions((old: any) => {
            var o = { ...old };
            o.CampaignCustomerStatus = data.selectedItem.Code;
            console.log(o);
            return o;
          });
          setSelectedStatus(data.selectedItem.Code);
        }}
        dataSource={campaignCustomerStatuses}
        searchEnabled={true}
        displayExpr="Title"
        validationError={selectedStatus}
        valueExpr={"Code"}
        itemRender={(item) => (
          <span style={{ color: item.color }} className="p-1">
            <i className={`${item.icon} mr-2`} />
            {item.Title}
          </span>
        )}
      />
      <span className="text-gray">Khách hàng</span>
      <TextBox placeholder="Nhập để tìm kiếm..."></TextBox>

      <ScrollView style={{ height: windowSize.height - 300 }} className="pt-1">
        <div className="w-full">
          {!!campaignCustomerData && !!campaignCustomerData.Data && (
            <>
              {campaignCustomerData?.Data.map(
                (item: Cpn_CampaignCustomerData) => {
                  return (
                    <CustomerItem key={item.CustomerCodeSys} item={item} />
                  );
                }
              )}
            </>
          )}
        </div>
      </ScrollView>
    </div>
  );
};
