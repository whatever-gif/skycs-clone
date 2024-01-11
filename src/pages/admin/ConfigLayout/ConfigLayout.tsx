import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { DeleteSingleConfirmationBox } from "@/packages/ui/base-gridview/components";
import { normalGridDeleteSingleConfirmationBoxAtom } from "@/packages/ui/base-gridview/store/normal-grid-store";
import { useQuery } from "@tanstack/react-query";
import { Button, LoadPanel, SelectBox } from "devextreme-react";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import { ListGroupField } from "./components/ListGroupField";
import { handleSort } from "./components/handle";
import { listData, screenAtom } from "./components/store";
import { supportLayoutData } from "./components/support-data";

const ConfigLayout = () => {
  const { t } = useI18n("ConfigLayout");

  const { t: common } = useI18n("Common");

  const api = useClientgateApi();

  const [currentScreen, setCurrentScreen] = useAtom(screenAtom);

  const [currentListData, setCurrentListData] = useAtom(listData);

  const [currentData, setCurrentData] = useState<any>(undefined);

  const showError = useSetAtom(showErrorAtom);

  const setDeleteSingleConfirmBoxVisible = useSetAtom(
    normalGridDeleteSingleConfirmationBoxAtom
  );

  const { data: listLayout, isLoading: loadingListLayout } = useQuery(
    ["listLayout"],
    async () => {
      const resp: any = await api.MDMetaScreenTemplate_GetAllActive();

      return (
        resp?.DataList?.filter(
          (item: any) =>
            item?.ScrTplCodeSys != "SCRTPLCODESYS.MSTCUSTOMER.DTL.2023"
        )?.map((item: any) => {
          if (item?.ScrTplCodeSys == "SCRTPLCODESYS.2023") {
            item.ScrTplName = "Tạo mới khách hàng";
          }

          return item;
        }) ?? []
      );
    }
  );

  const { data: listGroup, isLoading: loadingListGroup } = useQuery(
    ["listGroupLayout", currentScreen],
    async () => {
      if (currentScreen) {
        const resp: any = await api.MdMetaColGroupApi_Search({
          ScrTplCodeSys: currentScreen,
        });

        if (resp?.isSuccess && resp?.DataList) {
          return resp?.DataList;
        }

        return [];
      } else {
        return [];
      }
    }
  );

  const {
    data: listGroupSpec,
    isLoading: loadingListGroupSpec,
    refetch: refetchListGroupSpec,
  } = useQuery(["listGroupSpecLayout", currentScreen], async () => {
    if (currentScreen) {
      const resp: any = await api.MdMetaColGroupSpec_Search({}, currentScreen);

      if (resp?.isSuccess && resp?.DataList) {
        // const arr = handleFillOrderIdx(resp?.DataList);

        console.log(resp);

        const sortedList: any = handleSort(resp?.DataList);

        setCurrentListData(sortedList);

        return sortedList;
      }

      return [];
    } else {
      return [];
    }
  });

  const handleCheckContact = () => {
    const checkContact = currentListData
      .filter((item: any) => item?.ColGrpCodeSys == "COLGRPCODESYS.2023.02")
      ?.map((item: any) => item.ColCodeSys)
      ?.reduce(
        (prev: any, current: any) => {
          if (current == "CountryCodeContact") {
            prev.CountryCodeContact += 1;
          }
          if (current == "ProvinceCodeContact") {
            prev.ProvinceCodeContact += 1;
          }
          if (current == "DistrictCodeContact") {
            prev.DistrictCodeContact += 1;
          }
          if (current == "WardCodeContact") {
            prev.WardCodeContact += 1;
          }
          if (String(current).includes("CountryCode")) {
            prev.CountryCode += 1;
          }
          if (String(current).includes("ProvinceCode")) {
            prev.ProvinceCode += 1;
          }
          if (String(current).includes("DistrictCode")) {
            prev.DistrictCode += 1;
          }
          if (String(current).includes("WardCode")) {
            prev.WardCode += 1;
          }

          return prev;
        },
        {
          CountryCodeContact: 0,
          ProvinceCodeContact: 0,
          DistrictCodeContact: 0,
          WardCodeContact: 0,
          CountryCode: 0,
          ProvinceCode: 0,
          DistrictCode: 0,
          WardCode: 0,
        }
      );

    const validContact =
      ((checkContact.CountryCode == 0 &&
        checkContact.ProvinceCode == 0 &&
        checkContact.DistrictCode == 0 &&
        checkContact.WardCode == 0) ||
        (checkContact.CountryCode == 1 &&
          checkContact.ProvinceCode == 1 &&
          checkContact.DistrictCode == 1 &&
          checkContact.WardCode == 1)) &&
      ((checkContact.CountryCodeContact == 0 &&
        checkContact.ProvinceCodeContact == 0 &&
        checkContact.DistrictCodeContact == 0 &&
        checkContact.WardCodeContact == 0) ||
        (checkContact.CountryCodeContact == 1 &&
          checkContact.ProvinceCodeContact == 1 &&
          checkContact.DistrictCodeContact == 1 &&
          checkContact.WardCodeContact == 1));

    return validContact;
  };

  const handleCheckDelivery = () => {
    const checkDelivery = currentListData
      .filter((item: any) => item?.ColGrpCodeSys == "COLGRPCODESYS.2023.04")
      ?.map((item: any) => item.ColCodeSys)
      ?.reduce(
        (prev: any, current: any) => {
          if (current == "CountryCodeDelivery") {
            prev.CountryCodeDelivery += 1;
          }
          if (current == "ProvinceCodeDelivery") {
            prev.ProvinceCodeDelivery += 1;
          }
          if (current == "DistrictCodeDelivery") {
            prev.DistrictCodeDelivery += 1;
          }
          if (current == "WardCodeDelivery") {
            prev.WardCodeDelivery += 1;
          }
          if (String(current).includes("CountryCode")) {
            prev.CountryCode += 1;
          }
          if (String(current).includes("ProvinceCode")) {
            prev.ProvinceCode += 1;
          }
          if (String(current).includes("DistrictCode")) {
            prev.DistrictCode += 1;
          }
          if (String(current).includes("WardCode")) {
            prev.WardCode += 1;
          }

          return prev;
        },
        {
          CountryCodeDelivery: 0,
          ProvinceCodeDelivery: 0,
          DistrictCodeDelivery: 0,
          WardCodeDelivery: 0,
          CountryCode: 0,
          ProvinceCode: 0,
          DistrictCode: 0,
          WardCode: 0,
        }
      );

    const validDelivery =
      ((checkDelivery.CountryCode == 0 &&
        checkDelivery.ProvinceCode == 0 &&
        checkDelivery.DistrictCode == 0 &&
        checkDelivery.WardCode == 0) ||
        (checkDelivery.CountryCode == 1 &&
          checkDelivery.ProvinceCode == 1 &&
          checkDelivery.DistrictCode == 1 &&
          checkDelivery.WardCode == 1)) &&
      ((checkDelivery.CountryCodeDelivery == 0 &&
        checkDelivery.ProvinceCodeDelivery == 0 &&
        checkDelivery.DistrictCodeDelivery == 0 &&
        checkDelivery.WardCodeDelivery == 0) ||
        (checkDelivery.CountryCodeDelivery == 1 &&
          checkDelivery.ProvinceCodeDelivery == 1 &&
          checkDelivery.DistrictCodeDelivery == 1 &&
          checkDelivery.WardCodeDelivery == 1));

    return validDelivery;
  };

  const handleCheckInvoice = () => {
    const checkInvoice = currentListData
      .filter((item: any) => item?.ColGrpCodeSys == "COLGRPCODESYS.2023.03")
      ?.map((item: any) => item.ColCodeSys)
      ?.reduce(
        (prev: any, current: any) => {
          if (current == "CountryCodeInvoice") {
            prev.CountryCodeInvoice += 1;
          }
          if (current == "ProvinceCodeInvoice") {
            prev.ProvinceCodeInvoice += 1;
          }
          if (current == "DistrictCodeInvoice") {
            prev.DistrictCodeInvoice += 1;
          }
          if (current == "WardCodeInvoice") {
            prev.WardCodeInvoice += 1;
          }
          if (String(current).includes("CountryCode")) {
            prev.CountryCode += 1;
          }
          if (String(current).includes("ProvinceCode")) {
            prev.ProvinceCode += 1;
          }
          if (String(current).includes("DistrictCode")) {
            prev.DistrictCode += 1;
          }
          if (String(current).includes("WardCode")) {
            prev.WardCode += 1;
          }

          return prev;
        },
        {
          CountryCodeInvoice: 0,
          ProvinceCodeInvoice: 0,
          DistrictCodeInvoice: 0,
          WardCodeInvoice: 0,
          CountryCode: 0,
          ProvinceCode: 0,
          DistrictCode: 0,
          WardCode: 0,
        }
      );

    const validInvoice =
      ((checkInvoice.CountryCode == 0 &&
        checkInvoice.ProvinceCode == 0 &&
        checkInvoice.DistrictCode == 0 &&
        checkInvoice.WardCode == 0) ||
        (checkInvoice.CountryCode == 1 &&
          checkInvoice.ProvinceCode == 1 &&
          checkInvoice.DistrictCode == 1 &&
          checkInvoice.WardCode == 1)) &&
      ((checkInvoice.CountryCodeInvoice == 0 &&
        checkInvoice.ProvinceCodeInvoice == 0 &&
        checkInvoice.DistrictCodeInvoice == 0 &&
        checkInvoice.WardCodeInvoice == 0) ||
        (checkInvoice.CountryCodeInvoice == 1 &&
          checkInvoice.ProvinceCodeInvoice == 1 &&
          checkInvoice.DistrictCodeInvoice == 1 &&
          checkInvoice.WardCodeInvoice == 1));

    return validInvoice;
  };

  const handleSave = async () => {
    if (!currentScreen) {
      return;
    }

    const checkContact = handleCheckContact();
    const checkDelivery = handleCheckDelivery();
    const checkInvoice = handleCheckInvoice();

    if (!checkContact || !checkDelivery || !checkInvoice) {
      toast.error(
        "Vui lòng thêm đầy đủ thông tin: Quốc gia, Tinh/Thành, Quận/Huyện, Xã/Phường!"
      );
      return;
    }

    const sorted = handleSort(currentListData);

    const result = sorted?.map((item: any) => {
      return {
        ...item,
        FlagIsNotNull: item.FlagIsNotNull == true ? "1" : "0",
        FlagIsCheckDuplicate: item.FlagIsCheckDuplicate == true ? "1" : "0",
        FlagActive: item.FlagActive == true ? "1" : "0",
      };
    });

    const resp: any = await api.MDMetaColGroupSpec_Save({
      screen: currentScreen,
      data: supportLayoutData.TaoMoiKH,
    });

    if (resp?.isSuccess) {
      toast.success(common("Update successfully!"));
      refetchListGroupSpec();
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
  };

  const onDelete = async (data: any) => {
    setDeleteSingleConfirmBoxVisible(true);
    setCurrentData(data);
  };

  const onDeleteSingle = async () => {
    const resp: any = await api.MDMetaColGroupSpec_Delete(currentData);
    if (resp.isSuccess) {
      toast.success(common("Delete successfully!"));
      setDeleteSingleConfirmBoxVisible(false);
      await refetchListGroupSpec();
    } else {
      setDeleteSingleConfirmBoxVisible(false);

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
  };

  const onCancelDelete = () => {
    setDeleteSingleConfirmBoxVisible(false);
  };

  return (
    <div>
      <div className="py-2 px-2 flex items-center justify-between">
        <div className="font-semibold">{t("ConfigLayout")}</div>
        {currentScreen && (
          <PermissionContainer permission={"BTN_CONFIGLAYOUT_SAVE"}>
            <Button
              style={{ padding: 10, background: "#00703c", color: "white" }}
              onClick={handleSave}
            >
              {common("Save")}
            </Button>
          </PermissionContainer>
        )}
      </div>
      <div className="separator"></div>
      <div className="px-2 py-2 flex gap-1 items-center">
        <div>{t("Select layout:")}</div>
        <SelectBox
          dataSource={listLayout ?? []}
          valueExpr="ScrTplCodeSys"
          displayExpr="ScrTplName"
          width={300}
          value={currentScreen}
          onValueChanged={(e: any) => setCurrentScreen(e.value)}
        ></SelectBox>
      </div>

      {currentScreen && listGroup && listGroupSpec && (
        <ListGroupField
          listColGroups={listGroup ?? []}
          onSaved={refetchListGroupSpec}
          onDelete={onDelete}
        />
      )}

      <LoadPanel
        visible={loadingListLayout || loadingListGroupSpec || loadingListGroup}
      />

      <DeleteSingleConfirmationBox
        title={common("Delecommone")}
        message={common("DeleteSingleItemConfirmationMessage")}
        onYesClick={onDeleteSingle}
        onNoClick={onCancelDelete}
      />
    </div>
  );
};

export default ConfigLayout;
