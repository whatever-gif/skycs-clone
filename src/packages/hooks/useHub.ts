import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/auth";

const base_signalr_url = import.meta.env.VITE_SIGNALR_BASE_URL;

interface HubEvent {
  //url: string,
  eventName: string;
  eventFunc: (data: any) => void;
  __id: string;
}

export const useHub = (url: string) => {
  const { auth } = useAuth();

  const [connection, setConnection] = useState<null | HubConnection>(null);
  const [retryVal, setRetry] = useState(new Date());
  const [connect, setConnect] = useState(false);

  const uuid: string = useMemo(() => {
    return nanoid();
  }, []);

  (<any>window).__hubEventList = (<any>window).__hubEventList || [];

  useEffect(() => {
    if (connect) {
      const connect = new HubConnectionBuilder()
        //.withUrl(`${base_signalr_url}/hub/global/?networkId=${auth.networkId}`, { accessTokenFactory: () => auth.token ?? "" })
        .withUrl(
          `${base_signalr_url}/hub/global/?networkId=${auth.networkId}&orgId=${auth.orgData?.Id}&userId=${auth.currentUser?.Id}&userEmail=${auth.currentUser?.Email}`,
          { accessTokenFactory: () => auth.token ?? "" }
        )
        //.withUrl(url)
        .withAutomaticReconnect()
        .build();

      setConnection(connect);
    }

    return () => {
      (<any>window).__hubEventList = (<any>window).__hubEventList.filter(
        (h: any) => h.__id != uuid
      );
      //console.log((<any>window).__hubEventList);
    };
  }, [connect]);

  useEffect(() => {
    if (connect && connection && connection?.state == "Disconnected") {
      connection
        .start()
        .then(() => {
          connection.on("ReceiveMessage", (message) => {
            // console.log("ReceiveMessage", message)
            const eventList1 = (<any>window).__hubEventList;
            eventList1.forEach((evt: HubEvent) => {
              if (evt.eventName == message.eventName) {
                evt.eventFunc(message.eventDetail);
              }
            });
          });

          if ((<any>window)._onHubConnected) (<any>window)._onHubConnected();
        })
        .catch((error) => {
          // console.log(error);
          window.setTimeout(function () {
            setRetry(new Date());
          }, 10000);
        });
    }
  }, [connection, retryVal]);

  //////////////////////

  const onReceiveMessage = (
    eventName: string,
    eventHandle: (data: any) => void
  ) => {
    (<any>window).__hubEventList.push({
      eventName: eventName,
      eventFunc: eventHandle,
      __id: uuid,
    });

    //console.log((<any>window).__hubEventList);
  };

  return {
    start: (onConnected: () => void) => {
      setConnect(true);

      (<any>window)._onHubConnected = onConnected;
    },

    onReceiveMessage: onReceiveMessage,
  };
};
