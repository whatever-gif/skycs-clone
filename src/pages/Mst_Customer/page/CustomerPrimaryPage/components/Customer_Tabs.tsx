import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import "@skycs-pages/eticket/eticket.scss";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel, Tabs } from "devextreme-react";
import { Item } from "devextreme-react/tab-panel";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./tab.scss";
import Tab_All from "./tabs/Tab_All/Tab_All";
import Tab_CustomerCampaign from "./tabs/Tab_CustomerCampaign/Tab_CustomerCampaign";
import Tab_CustomerContract from "./tabs/Tab_CustomerContact/Tab_CustomerContract";
import Tab_CustomerDetail from "./tabs/Tab_CustomerDetail/Tab_CustomerDetail";
import Tab_CustomerEticket from "./tabs/Tab_CustomerEticket/Tab_CustomerEticket";
import Tab_CustomerHist from "./tabs/Tab_CustomerHist/Tab_CustomerHist";
import Tab_CustomerHistCall from "./tabs/Tab_CustomerHistCall/Tab_CustomerHistCall";

export const bagde = (number: number) => {
  return (
    <div className="bg-red-600 w-[20px] h-[20px] text-white flex items-center justify-center rounded-[50%]">
      {number}
    </div>
  );
};

export const Text_All = () => {
  return (
    <div className="flex gap-1 items-center">
      <div>Tất cả</div>
    </div>
  );
};

export const Text_HistCall = () => {
  return (
    <div className="flex gap-1 items-center">
      <div>Lịch sử cuộc gọi</div>
    </div>
  );
};

export const Text_eTicket = () => {
  const countTab = useAtomValue(countTabAtom);
  return (
    <div className="flex gap-1 items-center">
      <div>eTicket</div>
      {countTab.eTicket > 0 && <div>{bagde(countTab.eTicket)}</div>}
    </div>
  );
};

export const Text_Campagin = () => {
  const countTab = useAtomValue(countTabAtom);

  return (
    <div className="flex gap-1 items-center">
      <div>Chiến dịch</div>
      {countTab.Campaign > 0 && <div>{bagde(countTab.Campaign)}</div>}
    </div>
  );
};

export const countTabAtom = atom<any>({
  eTicket: 0,
  Campaign: 0,
});

export const currentIndexAtom = atom(0);

const Customer_Tabs = () => {
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const { t } = useI18n("Customer_Tabs");
  const { CustomerCodeSys }: any = useParams();
  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const { auth } = useAuth();
  const setCountTab = useSetAtom(countTabAtom);

  const { data, isLoading, refetch } = useQuery(["countAll"], async () => {
    const resp: any = await api.Mst_Customer_GetAllByCustomerCodeSys(
      CustomerCodeSys
    );

    if (resp.isSuccess) {
      console.log("resp ", resp);

      const { Lst_Cpn_CampaignCustomer, Lst_ET_Ticket } = resp?.Data;

      const countEticket = Lst_ET_Ticket?.reduce((prev: any, current: any) => {
        return (prev += current?.TicketStatus != "CLOSED" ? 1 : 0);
      }, 0);

      setCountTab({
        eTicket: countEticket ?? 0,
        Campaign: Lst_Cpn_CampaignCustomer?.length ?? 0,
      });

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
  });

  useEffect(() => {
    setCountTab({
      eTicket: 0,
      Campaign: 0,
    });
  }, []);

  const dataSource = [
    {
      id: 0,
      text: <Text_All />,
      component: <Tab_All />,
    },
    {
      id: 1,
      text: <Text_HistCall />,
      component: <Tab_CustomerHistCall />,
    },
    {
      id: 2,
      text: <Text_eTicket />,
      component: <Tab_CustomerEticket />,
    },
    {
      id: 3,
      text: <Text_Campagin />,
      component: <Tab_CustomerCampaign />,
    },
    {
      id: 4,
      text: "Chi tiết khách hàng",
      component: (
        <>
          <Tab_CustomerDetail />
        </>
      ),
    },
    {
      id: 5,
      text: "Danh sách liên hệ",
      component: (
        <>
          <Tab_CustomerContract />
        </>
      ),
    },
    {
      id: 6,
      text: "Lịch sử thay đổi",
      component: (
        <>
          <Tab_CustomerHist />
        </>
      ),
    },
  ];

  const customizeDataSource = dataSource
    .filter((item) => {
      if (auth.networkId !== 7341700000) {
        return item;
      } else {
        return ![3].includes(item.id);
      }
    })
    .map((item, index) => {
      return {
        ...item,
        id: index,
      };
    });

  useEffect(() => {
    refetch();
  }, []);

  const currentComponent = customizeDataSource.find(
    (item: any) => item.id === currentIndex
  )?.component;

  return (
    <div className="customer-detail custom-tabs">
      <Tabs
        // customizeDataSource={customizeDataSource}
        selectedIndex={currentIndex}
        onItemClick={(value: any) => {
          setCurrentIndex(value.itemIndex);
        }}
      >
        {customizeDataSource?.map((item: any) => {
          return (
            <Item key={nanoid()}>
              <div className="normal-case">{item?.text}</div>
            </Item>
          );
        })}
      </Tabs>
      <div className="detail-content-customer">{currentComponent}</div>

      <LoadPanel
        container={".dx-viewport"}
        shadingColor="rgba(0,0,0,0.4)"
        position={"center"}
        visible={isLoading}
        showIndicator={true}
        showPane={true}
      />
    </div>
  );
};

export default Customer_Tabs;
