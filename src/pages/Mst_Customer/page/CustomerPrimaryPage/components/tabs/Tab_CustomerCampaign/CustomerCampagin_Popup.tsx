import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { Form, LoadPanel } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useCallback, useEffect, useRef } from "react";

import { encodeFileType, revertEncodeFileType } from "@/components/ulti";
import { useClientgateApi } from "@/packages/api";
import { convertDate } from "@/packages/common";
import { useAuth } from "@/packages/contexts/auth";
import { useNetworkNavigate } from "@/packages/hooks";
import { showErrorAtom } from "@/packages/store";
import {
  currentInfo,
  flagSelectorAtom,
  listCampaignAtom,
} from "@/pages/admin/Cpn_Campaign/components/store";
import { useQuery } from "@tanstack/react-query";
import DataGrid from "devextreme-react/data-grid";
import {
  GroupItem,
  Tab,
  TabPanelOptions,
  TabbedItem,
} from "devextreme-react/form";
import { toast } from "react-toastify";
import Cpn_Campaign_Info_Common from "./components/Cpn_Campaign_Info_Common";
import Cpn_Campaign_List_Customer from "./components/Cpn_Campaign_List_Customer";

interface tabInterface {
  title: string;
  component: ReactNode;
}

interface buttonItem {
  button: string;
  buttonComponent: ReactNode;
}

const CustomerCampaign_Popup = ({ CampaignCode }: any) => {
  // console.log(CampaignCode);

  const { t } = useI18n("Cpn_Campaign_Info");
  const formRef: any = useRef(null);
  const currentItemData = useAtomValue(currentInfo);
  const setCurrentItemData = useSetAtom(currentInfo);
  const flagSelector = useAtomValue(flagSelectorAtom);
  const navigate = useNetworkNavigate();
  const listCampaign = useAtomValue(listCampaignAtom);
  const setListCampaign = useSetAtom(listCampaignAtom);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const { auth } = useAuth();
  const commonRef = useRef<Form>(null);
  const listCustomerRef = useRef<DataGrid>(null);

  const tabs = [
    {
      title: t("Common Info"),
      component: (
        <Cpn_Campaign_Info_Common
          ref={commonRef}
          listCustomerRef={listCustomerRef}
        />
      ),
    },
    {
      title: t("List Customer"),
      component: (
        <Cpn_Campaign_List_Customer
          commonRef={commonRef}
          ref={listCustomerRef}
        />
      ),
    },
  ];
  const {
    data: dataGetByCode,
    isLoading: isLoadingGetByCode,
    refetch: refetchGetByCode,
  } = useQuery({
    queryKey: ["CampaignData"],
    queryFn: async () => {
      if (CampaignCode) {
        const response = await api.Cpn_Campaign_GetByCode(
          CampaignCode,
          auth.orgData?.Id ?? ""
        );

        const item: any = response.Data?.Lst_Cpn_Campaign?.[0];
        if (response.isSuccess) {
          const listAgent = response?.Data?.Lst_Cpn_CampaignAgent?.map(
            (item) => item.AgentCode ?? ""
          );
          const listUpload = response?.Data?.Lst_Cpn_CampaignAttachFile ?? [];
          const newUpdateLoading = listUpload.map((item) => {
            return {
              ...item,
              FileFullName: item.FileName,
              FileType: encodeFileType(item.FileType),
              FileUrlLocal: item.FilePath,
            };
          });
          setCurrentItemData({
            ...item,
            CampaignAgent: listAgent,
            uploadFiles: newUpdateLoading ?? [],
          });
          let customizeCampaignCustomer =
            response.Data?.Lst_Cpn_CampaignCustomer ?? [];
          setListCampaign(customizeCampaignCustomer);
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
      } else {
        return {};
      }
    },
  });

  useEffect(() => {
    refetchGetByCode();
  }, [CampaignCode]);

  const handleCancel = useCallback((): void => {
    navigate("/campaign/Cpn_CampaignPage");
  }, []);

  const onDelete = async () => {
    const obj = {
      Cpn_Campaign: {
        CampaignCode: currentItemData.CampaignCode,
        OrgID: auth.orgData?.Id,
      },
      Lst_Cpn_CampaignAttachFile: [],
      Lst_Cpn_CampaignCustomer: [],
      Lst_Cpn_CampaignAgent: [],
    };

    const response = await api.Cpn_Campaign_Delete(obj);
    if (response.isSuccess) {
      handleCancel();
      navigate("/campaign/Cpn_CampaignPage");
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

  const executeState = useCallback(
    async (url: string) => {
      const obj = {
        OrgID: auth.orgData?.Id ?? "",
        CampaignCode: currentItemData?.CampaignCode,
      };
      const response = await api.Cpn_Campaign_ExecuteState(obj, url);
      if (response.isSuccess) {
        toast.success(t(`${url} successfully`));
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
    [currentItemData]
  );

  const onSave = async () => {
    const { isValid } = formRef.current.instance.validate();
    if (!isValid) {
      toast.error(t("Please Input field required"));
    } else {
      const listCap =
        (listCustomerRef?.current?.props.dataSource as any[]) ?? [];
      if (listCap.length) {
        const obj: any = {
          Cpn_Campaign: {
            OrgID: auth.orgData?.Id,
            NetworkID: auth.networkId,
            ...currentItemData,
            DTimeStart: convertDate(currentItemData.DTimeStart),
            DTimeEnd: convertDate(currentItemData.DTimeEnd),
            CallRate: 1,
          },
          Lst_Cpn_CampaignAttachFile: currentItemData.uploadFiles.map(
            (item: any, index: any) => {
              return {
                Idx: index,
                FileName: item.FileFullName ?? "",
                FilePath: item.FileUrlLocal ?? "",
                FileType: revertEncodeFileType(item.FileType),
              };
            }
          ),
          Lst_Cpn_CampaignAgent: [
            ...currentItemData.CampaignAgent.map((item: any) => {
              return {
                AgentCode: item,
              };
            }),
          ],
          Lst_Cpn_CampaignCustomer: [],
        };
        delete obj.Cpn_Campaign.uploadFiles;
        // case add
        listCustomerRef?.current?.instance.saveEditData();
        const listCustomers =
          (listCustomerRef?.current?.instance.option("dataSource") as any[]) ??
          [];
        if (listCap.length === 0) {
          const response = await api.Cpn_Campaign_Update(obj, CampaignCode);
          if (response.isSuccess) {
            toast.success(t("Campaign successfully created"));
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
          const checkAgent = listCap.every((item) => item.AgentCode);
          if (checkAgent) {
            const Lst_Cpn_CampaignCustomer = listCap.map((item, index) => {
              return {
                CustomerCodeSys: item.CustomerCodeSys,
                Idx: index,
                AgentCode: item.AgentCode,
                CustomerName: item.CustomerName,
                CustomerPhoneNo1: item.CustomerPhoneNo1,
                CustomerPhoneNo2: item.CustomerPhoneNo2,
                CustomerEmail: item.CustomerEmail,
                CustomerCompany: item.CustomerCompany,
                CustomerJsonInfo: item.CustomerJsonInfo,
              };
            });
            obj.Lst_Cpn_CampaignCustomer = Lst_Cpn_CampaignCustomer;
            const response = await api.Cpn_Campaign_Update(obj, CampaignCode);
            if (response.isSuccess) {
              toast.success(t("Campaign successfully created"));
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
            toast.error(t("Please Distribution Agent To Customer !"));
          }
        }
      } else {
        toast.error(t("Please Select Customer !"));
      }
    }
  };

  // const listCampaignAgentValue = useAtomValue(listCampaignAgentAtom);
  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        {!dataGetByCode && <LoadPanel />}
        {!!dataGetByCode && (
          <Form validationGroup="campaignForm" ref={formRef} readOnly>
            <GroupItem>
              <TabbedItem>
                <TabPanelOptions
                  deferRendering={false}
                  onSelectionChanged={(e: any) => {
                    // listCustomerRef.current?.instance.saveEditData();
                    // listCustomerRef.current?.instance.refresh();
                  }}
                />
                {tabs.map((item: tabInterface) => {
                  return (
                    <Tab key={item.title} title={item.title}>
                      {item.component}
                    </Tab>
                  );
                })}
              </TabbedItem>
            </GroupItem>
          </Form>
        )}
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default CustomerCampaign_Popup;
