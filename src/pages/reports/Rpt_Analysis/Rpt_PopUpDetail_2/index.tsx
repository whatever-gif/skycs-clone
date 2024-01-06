import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useEffect, useRef } from "react";

import { showErrorAtom } from "@packages/store";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import { Button, DataGrid } from "devextreme-react";
import { useColumn } from "./useColumn";

import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { usePermissions } from "@/packages/contexts/permission";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import Detail_Ci from "./popup/detail_ci";
import Detail_Di from "./popup/detail_di";
import { showVisibleCIAtom, showVisibleDiAtom } from "./popup/store";

export const Rpt_PopUpDetail_2 = () => {
  const { t } = useI18n("Rpt_PopUpDetail_2");
  let gridRef: any = useRef<DataGrid | null>(null);
  const showError = useSetAtom(showErrorAtom);
  const { auth: authent } = useAuth();
  const { networkId } = authent;
  const { hasButtonPermission } = usePermissions();
  const setVisibleCi = useSetAtom(showVisibleCIAtom);
  const setVisibleDi = useSetAtom(showVisibleDiAtom);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Rpt_PopUpDetail_2"],
    queryFn: async () => {
      const response: any = await callApi.getBlackList(networkId, {});
      if (response.Success) {
        const result = {
          ...response,
          DataList: response.Data ?? [],
        };

        const respone = [
          {
            Agent: "AgentName",
            "Số máy lẻ": "Số máy lẻ",
            "Mã cuộc gọi": "AgentName",
            "Thời điểm gọi": "AgentName",
            "Mã KH": "AgentName",
            "Tên KH": "AgentName",
            "SĐT khách hàng": "AgentName",
            "File ghi âm": "AgentName",
            "Kính ngữ": "AgentName",
            "Từ ngữ không phù hợp": "AgentName",
            "Loại cuộc gọi": "AgentName",
            "Nghiệp vụ liên quan": "AgentName",
            "Mã nghiệp vụ liên quan": "AgentName",
          },
          {
            Agent: "AgentName 1 ",
            "Số máy lẻ": "Số máy lẻ 1 ",
            "Mã cuộc gọi": "AgentName 1 ",
            "Thời điểm gọi": "AgentName 1 ",
            "Mã KH": "AgentName 1 ",
            "Tên KH": "AgentName 1 ",
            "SĐT khách hàng": "AgentName 1 ",
            "File ghi âm": "AgentName 1 ",
            "Kính ngữ": "AgentName 1 ",
            "Từ ngữ không phù hợp": "AgentName 1 ",
            "Loại cuộc gọi": "AgentName 1 ",
            "Nghiệp vụ liên quan": "AgentName 1 ",
            "Mã nghiệp vụ liên quan": "AgentName 1 ",
          },
          {
            Agent: "AgentName 2",
            "Số máy lẻ": "AgentName 2",
            "Mã cuộc gọi": "AgentName 2",
            "Thời điểm gọi": "AgentName 2",
            "Mã KH": "AgentName 2",
            "Tên KH": "AgentName 2",
            "SĐT khách hàng": "AgentName 2",
            "File ghi âm": "AgentName 2",
            "Kính ngữ": "AgentName 2",
            "Từ ngữ không phù hợp": "AgentName 2",
            "Loại cuộc gọi": "AgentName 2",
            "Nghiệp vụ liên quan": "AgentName 2",
            "Mã nghiệp vụ liên quan": "AgentName 2",
          },
          {
            Agent: "AgentName 3",
            "Số máy lẻ": "AgentName 3",
            "Mã cuộc gọi": "AgentName 3",
            "Thời điểm gọi": "AgentName 3",
            "Mã KH": "AgentName 3",
            "Tên KH": "AgentName 3",
            "SĐT khách hàng": "AgentName 3",
            "File ghi âm": "AgentName 3",
            "Kính ngữ": "AgentName 3",
            "Từ ngữ không phù hợp": "AgentName 3",
            "Loại cuộc gọi": "AgentName 3",
            "Nghiệp vụ liên quan": "AgentName 3",
            "Mã nghiệp vụ liên quan": "AgentName 3",
          },
        ];
        return respone;
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

  const handleCloseCi = () => {
    setVisibleCi(false);
  };

  const handleOpenCi = (data: any) => {
    setVisibleCi(true);
  };

  const handleOpenDi = (data: any) => {
    setVisibleDi(true);
  };

  const handleCloseDi = () => {
    setVisibleDi(false);
  };

  const columns = useColumn({
    handleOpenCi: handleOpenCi,
    handleOpenDi: handleOpenDi,
  });

  useEffect(() => {
    if (!isLoading) {
      refetch();
    }
  }, []);

  const onExport = () => {};

  return (
    <AdminContentLayout className={"Rpt_PopUpDetail_2"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="text-header font-bold dx-font-m p-2 ">
          {t(
            "Chi tiết danh sách cuộc gọi nghi ngờ không đáp ứng chất lượng dịch vụ"
          )}
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        {/* const output = input.filter(item => item.UserCode !== null || item.UserName !== null); */}
        <GridViewCustomize
          isSingleSelection={false}
          isLoading={isLoading}
          // fetchData={refetchData}
          dataSource={data ? data ?? [] : []}
          columns={columns}
          keyExpr={["Agent"]}
          onReady={(ref) => {
            gridRef = ref;
          }}
          allowSelection={true}
          onSelectionChanged={() => {}}
          hidenTick={true}
          onSaveRow={() => {}}
          onEditorPreparing={() => {}}
          onEditRowChanges={() => {}}
          onDeleteRows={() => {}}
          storeKey={"Rpt_PopUpDetail_2"}
          toolbarItems={[
            {
              location: "before",
              render: () => {
                return (
                  <Button
                    visible={true}
                    stylingMode={"contained"}
                    type={"default"}
                    text={t("Export Excel")}
                    onClick={() => {
                      onExport();
                    }}
                  />
                );
              },
            },
          ]}
        />

        <Detail_Ci handleClose={handleCloseCi} />
        <Detail_Di handleClose={handleCloseDi} />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
