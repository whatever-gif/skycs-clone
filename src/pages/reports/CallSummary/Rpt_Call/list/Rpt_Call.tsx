import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import "./Rpt_Call.scss";
import { Item as TabItem } from "devextreme-react/tabs";
import { Tabs } from "devextreme-react";
import { EticketLayout } from "@/packages/layouts/eticket-layout";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import Tab_Call from "../components/Tabs_RptCall/Tab_Call/Tab_Call";
import { Tab_CallHistory } from "../components/Tabs_RptCall/Tab_CallHistory/Tab_CallHistory";
import { Tab_CallHistoryToAgent } from "../components/Tabs_RptCall/Tab_CallHistoryToAgent/Tab_CallHistoryToAgent";
import "./Rpt_Call.scss";
export const Report_CallPage = () => {
  const { t } = useI18n("Rpt_Call");
  const [currentTab, setCurrentTab] = useState(0);
  // const [dataCallSummary, setDataCallSummary] = useState(null);
  // const [dataCallHistory, setDataCallHistory] = useState<any>(null);
  const [getListOrg, setGetListOrg] = useState(null);

  const ListTab = [
    {
      id: 0,
      component: <Tab_Call getListOrg={getListOrg} />,
    },
    {
      id: 1,
      component: <Tab_CallHistory getListOrg={getListOrg} />,
    },
    {
      id: 2,
      component: <Tab_CallHistoryToAgent getListOrg={getListOrg} />,
    },
  ];
  const outlet = ListTab?.filter((item: any) => {
    if (item?.id === currentTab) {
      return item?.component;
    }
  })[0]?.component;
  const onItemClick = (e: any) => {
    setCurrentTab(e.itemIndex);
  };
  const { auth } = useAuth();
  useEffect(() => {
    callApi.getOrgInfo(auth.networkId).then((resp) => {
      if (resp.Success) {
        const customize = resp.Data;
        customize.AgentList = [
          // {
          //   Name: "All",
          // },
          ...customize.AgentList,
        ];
        customize.Numbers = [...customize.Numbers];

        setGetListOrg(customize);
      }
    });
  }, []);

  return (
    <div className="w-full h-full report-call">
      <EticketLayout className={""}>
        <EticketLayout.Slot name={"Header"}>
          <div className={"w-full flex flex-col"}>
            <div className={"page-header w-full flex items-center p-2"}>
              <div className={"before px-4 mr-auto"}>
                <strong>{t("Report Call")}</strong>
              </div>
            </div>
          </div>
        </EticketLayout.Slot>
        <EticketLayout.Slot name={"Content"}>
          <div className={"w-full h-full detail flex flex-column"}>
            {/* <div className={"w-full flex flex-col pt-0 sep-bottom-1 tab-ctn-1"}> */}
            {getListOrg && (
              <>
                <Tabs
                  width={490}
                  onItemClick={onItemClick}
                  selectedIndex={currentTab}
                >
                  <TabItem text={t("Call")}></TabItem>
                  <TabItem text={t("Call history")}></TabItem>
                  <TabItem text={t("Call history to Agent")}></TabItem>
                </Tabs>
                <div className={"w-full flex flex-col flex-1"}>{outlet}</div>
              </>
            )}
            {/* </div> */}
          </div>
        </EticketLayout.Slot>
      </EticketLayout>
    </div>
  );
};
