import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import { Form } from "devextreme-react";
import {
  GroupItem,
  Tab,
  TabPanelOptions,
  TabbedItem,
} from "devextreme-react/form";
import { useSetAtom } from "jotai";
import { ReactNode, useRef } from "react";
import { toast } from "react-toastify";
import Call_Channel from "../components/Call_Channel";
import Email_Channel from "../components/Email_Channel";
import SMS_Channel from "../components/SMS_Channel";
import Zalo_channel from "../components/Zalo_channel";
import { HeaderPart } from "../components/header-part";
import "./Omni_Chanel.scss";
interface tabInterface {
  title: string;
  component: ReactNode;
}
export default function OmiChanelPage() {
  const { t } = useI18n("OmiChanel");
  const formRef = useRef<any>();
  const {
    auth: { orgData },
  } = useAuth();
  const api = useClientgateApi();
  const { data: dataChanel, refetch } = useQuery(["dataChanel"], () =>
    api.Mst_Channel_GetByOrgID(orgData?.Id)
  );
  const zaloRef = useRef<any>(undefined);
  const EmailRef = useRef<any>(undefined);
  const ZaloAccessCodeRef = useRef<any>(undefined);
  const showError = useSetAtom(showErrorAtom);

  const tab = [
    {
      title: t("Email"),
      component: (
        <Email_Channel
          data={dataChanel?.Data?.Lst_Mst_ChannelEmail[0]}
          setFlagEmail={EmailRef}
        />
      ),
    },
    {
      title: t("Zalo"),
      component: (
        <Zalo_channel
          data={dataChanel?.Data?.Lst_Mst_ChannelZalo[0]}
          setFlagZalo={zaloRef}
          setAccessCodeZalo={ZaloAccessCodeRef}
        />
      ),
    },
    {
      title: t("SMS"),
      component: <SMS_Channel />,
    },
    {
      title: t("Call"),
      component: <Call_Channel />,
    },
  ];

  const handleSave = async () => {
    const dataZalo = [
      {
        // AppID: "1266699208786638596",
        // ZaloOAID: "1358767a413636684272",
        AccessCode: ZaloAccessCodeRef.current?.AccessCode
          ? ZaloAccessCodeRef.current?.AccessCode
          : "",
        FlagIsConnect: ZaloAccessCodeRef.current?.FlagIsConnect
          ? ZaloAccessCodeRef.current?.FlagIsConnect
          : dataChanel?.Data.Lst_Mst_ChannelZalo[0].moa_OAID ?? "0",
        FlagIsCustomApp: "0",
        FlagIsCreateET:
          zaloRef.current !== undefined
            ? zaloRef.current === true
              ? "1"
              : "0"
            : dataChanel?.Data.Lst_Mst_ChannelZalo[0]?.FlagIsCreateET,
      },
    ];

    const dataEmail = EmailRef.current.instance.option("formData");
    const dataSaveEmail = {
      ...dataEmail,
      MailFrom: "eticket@mg.qinvoice.vn",
      MailTo: "eticket@mg.qinvoice.vn",
    };

    const resp = await api.Mst_Channel_Save(dataZalo, [dataSaveEmail]);
    if (resp.isSuccess) {
      toast.success(t("Save Successfully"));
      // await refetch();
      return true;
    }
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
    throw new Error(resp._strErrCode);
  };
  return (
    <AdminContentLayout className={"SearchMST"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart onSave={handleSave} />
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <Form validationGroup="campaignForm" ref={formRef}>
          <GroupItem>
            <TabbedItem>
              <TabPanelOptions deferRendering={false} />
              {tab.map((item: tabInterface) => {
                return (
                  <Tab key={item.title} title={item.title}>
                    {item.component}
                  </Tab>
                );
              })}
            </TabbedItem>
          </GroupItem>
        </Form>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
}
