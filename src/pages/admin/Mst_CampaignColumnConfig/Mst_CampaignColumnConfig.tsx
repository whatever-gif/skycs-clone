import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import { Button } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useState } from "react";

const Setupcampaign = () => {
  const { t } = useI18n("SetUpCampaign");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const [formValue] = useState({});
  // get type api
  const {
    data: getListType,
    isLoading: isLoadingListType,
    refetch: refetchListType,
  } = useQuery({
    queryKey: ["ListType"],
    queryFn: async () => {
      const response = await api.MDMetaColumnOperatorType_GetAllActive();
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
        return [];
      }
    },
  });

  const {
    data: listData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Mst_CampaignColumnConfig_Search"],
    queryFn: async () => {
      const response = await api.Mst_CampaignColumnConfig_Search();
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
    },
  });

  // console.log("getListType ", getListType, "listData ", listData);

  const handleSave = () => {};

  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header d-flex justify-space-between">
          <div className="breakcrumb">
            <p>{t("MstCampaignColumnConfig")}</p>
          </div>
          <div className="list-button">
            <Button onClick={handleSave}>{t("Update")}</Button>
            <Button>{t("Cancel")}</Button>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        {/* <Accordion multiple={true} dataSource={listData?.DataList} /> */}
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Setupcampaign;
