import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useConfiguration } from "@/packages/hooks";
import { showErrorAtom } from "@/packages/store";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { PopupViewComponent } from "../Tab_CustomerHist/use-popup-view";
import { visiblePopup } from "./store";
import { useMst_CustomerContact_Column } from "./use-columns";
import usePopupCustomerContract from "./use-popup";

const Tab_CustomerContract = () => {
  const { CustomerCodeSys: customerCodeSys }: any = useParams();
  const setVisiblePopup = useSetAtom(visiblePopup);
  const api = useClientgateApi();
  const { t } = useI18n("Tab_CustomerContract");

  let gridRef: any = useRef(null);
  const showError = useSetAtom(showErrorAtom);

  const config = useConfiguration();

  const { data, isLoading, refetch }: any = useQuery(
    ["Tab_CustomerContact", customerCodeSys],
    async () => {
      if (customerCodeSys) {
        const resp: any = await api.Mst_CustomerContact_Search({
          CustomerCodeSys: customerCodeSys,
          FlagActive: 1,
          Ft_PageIndex: 0,
          Ft_PageSize: config.MAX_PAGE_ITEMS, // config.MAX_PAGE_ITEMS = 999999
        });

        if (resp?.isSuccess) {
          const col: any = await api.MdMetaColGroupSpec_Search(
            {},
            "SCRTCS.CTM.CONTACT.2023"
          );

          if (col?.isSuccess) {
            const list: any[] = resp?.DataList;

            const result = list?.map((item: any) => {
              const curJson: any[] =
                JSON.parse(item?.mcc_JsonCustomerInfo) ?? [];

              const fields = curJson?.reduce((prev: any, cur: any) => {
                return { ...prev, [cur?.ColCodeSys]: cur?.ColValue };
              }, {});

              const emailListJson =
                JSON.parse(item?.mcc_CustomerEmailJson) ?? [];
              const email =
                emailListJson?.find((item: any) => item?.FlagDefault == "1")
                  ?.CtmEmail ?? "";

              const phoneListJson =
                JSON.parse(item?.mcc_CustomerPhoneJson) ?? [];
              const phoneNo =
                phoneListJson?.find((item: any) => item?.FlagDefault == "1")
                  ?.CtmPhoneNo ?? "";

              return {
                ...item,
                CustomerName: item?.mcc_CustomerName,
                CustomerCode: item?.mcc_CustomerCode,
                CtmEmail: email,
                CtmPhoneNo: phoneNo,
                ...fields,
              };
            });

            const reusltValue = {
              ...resp,
              DataList: result,
            };

            return reusltValue;
          } else {
            showError({
              message: col._strErrCode,
              _strErrCode: col._strErrCode,
              _strTId: col._strTId,
              _strAppTId: col._strAppTId,
              _objTTime: col._objTTime,
              _strType: col._strType,
              _dicDebug: col._dicDebug,
              _dicExcs: col._dicExcs,
            });
          }

          return resp;
        } else {
          showError({
            message: resp._strErrCode,
            _strErrCode: resp._strErrCode,
            _strTId: resp._strTId,
            _strAppTId: resp._strAppTId,
            _objTTime: resp._objTTime,
            _strType: resp._strType,
            _dicDebug: resp._dicDebug,
            _dicExcs: resp._dicExcs,
          });
        }
      }

      return [];
    }
  );
  // Họ tên
  // Chức vụ
  // Điện thoại
  // Email
  // Địa chỉ
  // Ghi chú

  const handleRefetch = async () => {
    refetch();
  };

  // data content
  const { data: listCustomerType, isLoading: isLoadinglistCustomerType }: any =
    useQuery(["listCustomerType"], api.Mst_CustomerType_GetAllCustomerType);

  const { data: listCountry, isLoading: isLoadinglistCountry }: any = useQuery(
    ["ListCountry"],
    api.Mst_Country_GetAllActive
  );

  const { data: listCustomerGrp, isLoading: isLoadinglistCustomerGrp }: any =
    useQuery(["listCustomerGrp"], api.Mst_CustomerGroup_GetAllActive);

  const { data: listPartnerType, isLoading: isLoadinglistPartnerType }: any =
    useQuery(["listPartnerType"], api.Mst_PartnerType_GetAllActive);

  const {
    data: listCustomerCodeSysERP,
    isLoading: isLoadinglistCustomerCodeSysERP,
  }: any = useQuery(["listCustomerCodeSysERP"], async () => {
    const resp: any = await api.Mst_Customer_Search({
      FlagActive: 1,
      Ft_PageIndex: 0,
      Ft_PageSize: 1000,
      CustomerType: "TOCHUC",
    });

    return resp?.DataList ?? [];
  });

  const {
    data: listCustomerSource,
    isLoading: isLoadinglistCustomerSource,
  }: any = useQuery(["listCustomerSource"], async () => {
    const resp: any = await api.MdMetaColGroupSpec_Search(
      {},
      "ScrTplCodeSys.2023"
    );

    if (resp?.DataList && resp?.DataList?.length > 0) {
      const find = resp?.DataList?.find(
        (item: any) => item?.ColCodeSys == "C0K5"
      );

      if (find) {
        const data = JSON.parse(find?.JsonListOption ?? "[]");

        return data;
      }

      return [];
    }

    return [];
  });

  const handleOpen = () => {
    setVisiblePopup(true);
  };

  const handleClose = () => {
    setVisiblePopup(false);
  };

  const columns: any = useMst_CustomerContact_Column({
    refetch: handleRefetch,
  });

  const popupView = usePopupCustomerContract({
    refetchList: handleRefetch,
    listContact: data?.DataList ?? [],
    handleOpen: handleOpen,
    handleClose: handleClose,
    loadingApi: !(
      isLoadinglistCustomerType ||
      isLoadinglistCountry ||
      isLoadinglistCustomerGrp ||
      isLoadinglistPartnerType ||
      isLoadinglistCustomerCodeSysERP ||
      isLoadinglistCustomerSource
    ),
    data: {
      listCustomerType: listCustomerType,
      listCountry: listCountry,
      listCustomerGrp: listCustomerGrp,
      listPartnerType: listPartnerType,
      listCustomerCodeSysERP: listCustomerCodeSysERP,
      listCustomerSource: listCustomerSource,
    },
  });

  return (
    <div className="w-full relative">
      <LoadPanel
        visible={
          isLoading ||
          isLoadinglistCustomerType ||
          isLoadinglistCountry ||
          isLoadinglistCustomerGrp ||
          isLoadinglistPartnerType ||
          isLoadinglistCustomerCodeSysERP ||
          isLoadinglistCustomerSource
        }
      />
      <GridViewCustomize
        id={"tab_customer_contact"}
        isLoading={
          isLoading ||
          isLoadinglistCustomerType ||
          isLoadinglistCountry ||
          isLoadinglistCustomerGrp ||
          isLoadinglistPartnerType ||
          isLoadinglistCustomerCodeSysERP ||
          isLoadinglistCustomerSource
        }
        dataSource={data ? data.DataList : []}
        columns={columns}
        keyExpr={["CustomerName"]}
        popupSettings={{}}
        formSettings={{}}
        onReady={(ref) => {
          gridRef.current = ref;
        }}
        allowSelection={false}
        onSelectionChanged={() => {}}
        onSaveRow={() => {}}
        onEditorPreparing={() => {}}
        onEditRowChanges={() => {}}
        onDeleteRows={() => {}}
        toolbarItems={[]}
        isHiddenCheckBox={true}
        storeKey={"Tab_CustomerContact-columns"}
      />
      {popupView}
      <PopupViewComponent />
    </div>
  );
};

export default Tab_CustomerContract;
