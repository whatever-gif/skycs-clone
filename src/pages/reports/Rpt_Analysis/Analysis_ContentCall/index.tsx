import { useI18n } from "@/i18n/useI18n";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { ContentSearchPanelLayout } from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { Form } from "devextreme-react";
import { SimpleItem } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import { useMemo, useRef, useState } from "react";
import HeaderPart from "./header";
import { useColumn } from "./useColumn";
import useSearchColumn from "./useSearchColumn";

const Analysis_ContentCall = () => {
  const { auth: authent } = useAuth();
  const { networkId } = authent;
  let gridRef = useRef(null);
  const showError = useSetAtom(showErrorAtom);
  const { t } = useI18n("Analysis_ContentCall");
  const [searchCondition, setSearchCondition] = useState({});
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Analysis_ContentCall"],
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
            "Số cuộc gọi": 1,
            "tỉ lệ cuộc gọi": "100%",
            "Số cuộc gọi không phù hợp": 2,
            "tỉ lệ cuộc gọi không phù hợp": "100%",
          },
          {
            Agent: "AgentName 1",
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
            "Số cuộc gọi": 15,
            "tỉ lệ cuộc gọi": "100%",
            "Số cuộc gọi không phù hợp": 52,
            "tỉ lệ cuộc gọi không phù hợp": "100%",
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
            "Số cuộc gọi": 31,
            "tỉ lệ cuộc gọi": "100%",
            "Số cuộc gọi không phù hợp": 24,
            "tỉ lệ cuộc gọi không phù hợp": "100%",
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
            "Số cuộc gọi": 41,
            "tỉ lệ cuộc gọi": "100%",
            "Số cuộc gọi không phù hợp": 88,
            "tỉ lệ cuộc gọi không phù hợp": "100%",
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

  const [formData, setFormData] = useState({
    Agent: "",
  });

  // const { data: dataUser, isLoading: isLoadingUser } = useQuery({
  //   queryKey: ["dataUser"],
  //   queryFn: async () => {},
  // });

  // const {} = useQuery({
  //   queryKey: ["useQuery"],
  //   queryFn: async () => {},
  // });

  const toolBar: GridCustomerToolBarItem[] = useMemo(() => {
    return [
      {
        text: "",
        // permissionCode: "BTN_ADMIN_BLACKLIST_ADD",
        shouldShow: (ref: any) => {
          return true;
        },
        onClick: () => {},
        widget: "customize",
        customize: (ref: any) => {
          return (
            <div className="flex align-items-center">
              <div className="label">Bộ tiêu chí phân tích</div>
              <Form formData={formData} labelMode="hidden">
                <SimpleItem
                  dataField="Agent"
                  editorType="dxSelectBox"
                  editorOptions={{
                    displayExpr: "label",
                    valueExpr: "value",
                    dataSource: [
                      {
                        label: "Clear",
                        value: "Clear",
                      },
                      {
                        label: "AgentName",
                        value: "AgentName",
                      },
                      {
                        label: "AgentName 1",
                        value: "AgentName 1",
                      },
                      {
                        label: "AgentName 2",
                        value: "AgentName 2",
                      },
                    ],
                    onValueChanged: (data: any) => {
                      if (data.value === "Clear") {
                        ref._instance.clearFilter();
                      } else {
                        ref._instance.filter((item: any) => {
                          return item.Agent === data.value;
                        });
                      }
                    },
                  }}
                ></SimpleItem>
              </Form>
            </div>
          );
        },
      },
    ];
  }, []);

  const columns = useColumn();

  const handleSearch = () => {};
  const columnSearch = useSearchColumn();
  return (
    <AdminContentLayout className={"Analysis_ContentCall"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart />
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              conditionFields={columnSearch}
              storeKey="Mst_Eticket_Search"
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
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
              storeKey={"Analysis_ContentCall"}
              toolbarItems={[]}
              isHiddenCheckBox={true}
              customToolbarItems={toolBar}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Analysis_ContentCall;
