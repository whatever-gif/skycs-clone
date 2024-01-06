import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useEticket_api } from "@/packages/api/clientgate/Api_Eticket_Demo";
import { useHub } from "@/packages/hooks/useHub";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { showErrorAtom } from "@/packages/store";
import { EticketT } from "@/packages/types";
import { PartDetailInfo } from "@/pages/eticket/eticket/Components/Info/Detail/part-detail-info";
import { PartMessageList } from "@/pages/eticket/eticket/Components/Info/Detail/part-message-list";
import { LoadPanel, ScrollView } from "devextreme-react";
import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
export const Tab_Detail = ({
  data,
  listMedia,
  dataDynamicField,
}: {
  data: EticketT;
  listMedia: any[];
  dataDynamicField: any[];
}) => {
  const [loading, setLoading] = useState(false);
  const [valueGim, setValueGim] = useState<any[]>([]);
  const ticketApi = useEticket_api();
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const dataValue = useMemo(() => {
    return ticketApi.getDemoEticket();
  }, []);

  let dataRender = [];
  useEffect(() => {
    if (data?.Lst_ET_TicketMessagePin?.length) {
      dataRender = [data.Lst_ET_TicketMessagePin[0]].map((item: any) => {
        return {
          ...item,
          checkPin: true,
          dataPin: data.Lst_ET_TicketMessagePin,
        };
      });
      setValueGim([...dataRender, ...data.Lst_ET_TicketMessage]);
    } else {
      setValueGim(data.Lst_ET_TicketMessage);
    }
  }, []);

  const hub = useHub("global");
  useEffect(() => {
    hub.onReceiveMessage("ET_TicketMessage", (c) => {
      handleGim();
    });
  }, []);

  const handleGim = useCallback(async () => {
    setLoading(true);
    const responseCallMessage = await api.GetMessageByTicketID(
      data.Lst_ET_Ticket[0].TicketID
    );
    if (responseCallMessage.isSuccess) {
      const { Lst_ET_TicketMessagePin, Lst_ET_TicketMessage } =
        responseCallMessage.Data;

      if (Lst_ET_TicketMessagePin?.length) {
        dataRender = [Lst_ET_TicketMessagePin[0]].map((item: any) => {
          return {
            ...item,
            checkPin: true,
            dataPin: data.Lst_ET_TicketMessagePin,
          };
        });
        console.log("...dataRender, ...data.Lst_ET_TicketMessage ", [
          ...dataRender,
          ...data.Lst_ET_TicketMessage,
        ]);
        setValueGim([...dataRender, ...data.Lst_ET_TicketMessage]);
        setLoading(false);
      } else {
        setValueGim(Lst_ET_TicketMessage);
        setLoading(false);
      }
    } else {
      showError({
        message: responseCallMessage._strErrCode,
        _strErrCode: responseCallMessage._strErrCode,
        _strTId: responseCallMessage._strTId,
        _strAppTId: responseCallMessage._strAppTId,
        _objTTime: responseCallMessage._objTTime,
        _strType: responseCallMessage._strType,
        _dicDebug: responseCallMessage._dicDebug,
        _dicExcs: responseCallMessage._dicExcs,
      });
    }
  }, []);

  const windowSize = useWindowSize();
  const { t } = useI18n("Eticket_Detail");
  const scrollHeight = windowSize.height - 100;
  if (loading) {
    return <LoadPanel visible={loading} />;
  }
  return (
    <ResponsiveBox className={"w-full"}>
      <Row></Row>
      <Col ratio={3}></Col>
      <Col ratio={1}></Col>
      <Item>
        <Location row={0} col={0} />
        <ScrollView style={{ maxHeight: scrollHeight }}>
          <div className="w-full" style={{ background: "#F5F7F9" }}>
            {/* <PartReply
              dataValue={data}
              listMedia={listMedia}
              onReload={handleGim}
            /> */}
            <PartMessageList data={data} value={valueGim} onGim={handleGim} />
          </div>
        </ScrollView>
      </Item>
      <Item>
        <Location row={0} col={1} />
        <PartDetailInfo data={data} dataDynamicField={dataDynamicField} />
      </Item>
    </ResponsiveBox>
  );
};
