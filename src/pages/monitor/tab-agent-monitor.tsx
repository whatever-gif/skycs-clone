import PermissionContainer from "@/components/PermissionContainer";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { useHub } from "@/packages/hooks/useHub";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { CcAgent } from "@/packages/types";
import { DataGrid, ScrollView, Switch } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
export const Tab_AgentMonitor = () => {
  const [list, setList] = useState<CcAgent[]>([]);
  const { auth } = useAuth();

  const hub = useHub("global");

  const [reload, setReload] = useState(0);

  useEffect(() => {
    hub.onReceiveMessage("AgentState", (c) => {
      console.log("AgentState", c);
      setReload((r) => {
        return r + 1;
      });
    });
  }, []);

  useEffect(() => {
    callApi.getOrgAgentList(auth.networkId).then((resp) => {
      if (resp.Success && resp.Data) {
        setList(resp.Data);
      }
    });
  }, [reload]);

  const togglEgentCalloutStatus = (item: CcAgent) => {
    if (item.AllowCallout) item.AllowCallout = false;
    else item.AllowCallout = true;

    callApi
      .setExtAgentCalloutStatus(auth.networkId, {
        id: item.ExtId,
        status: item.AllowCallout,
      })
      .then((resp) => {});
  };

  const togglEgentIpphoneUsing = (item: CcAgent) => {
    if (item.UseIphone) item.UseIphone = false;
    else item.UseIphone = true;

    callApi
      .setExtAgentUseIpPhoneStatus(auth.networkId, {
        id: item.ExtId,
        useIpphone: item.UseIphone,
      })
      .then((resp) => {});
  };
  const togglEgentStatus = (item: CcAgent) => {
    if (item.AgentStatus == "On") item.AgentStatus = "Off";
    else item.AgentStatus = "On";

    callApi
      .setExtAgentStatus(auth.networkId, {
        id: item.ExtId,
        status: item.AgentStatus,
      })
      .then((resp) => {
        console.log(resp);
      });
  };
  const windowSize = useWindowSize();

  const AgentItem = ({ item, idx }: { item: CcAgent; idx: any }) => {
    return (
      <tr>
        <td>{idx + 1}</td>
        <td>{item.Name}</td>
        <td>{item.Alias}</td>
        <td>{item.Email}</td>
        <td>{item.PhoneNumber}</td>
        <PermissionContainer permission={"MNU_GIAMSAT_AGENT_RECEPTION"}>
          <td>
            <select
              value={item.UseIphone ? "true" : "false"}
              style={{
                height: 30,
                lineHeight: "20px",
                paddingTop: 0,
                paddingBottom: 0,
                fontSize: 12,
              }}
              className="p-0 m-0"
              onChange={() => {
                togglEgentIpphoneUsing(item);
              }}
            >
              <option value={"true"}>Ip Phone</option>
              <option value={"false"}>Web</option>
            </select>
          </td>
        </PermissionContainer>

        <td>
          <span
            className={`monitor-status ${item.DeviceState?.toLocaleLowerCase()}`}
          >
            {item.DeviceState}
          </span>
        </td>

        <PermissionContainer permission={"MNU_GIAMSAT_AGENT_ALLOWCALLOUT"}>
          <td>
            <Switch
              value={item.AllowCallout}
              onValueChange={(e) => {
                togglEgentCalloutStatus(item);
              }}
            />
          </td>
        </PermissionContainer>

        <PermissionContainer permission={"MNU_GIAMSAT_AGENT_FLAGACTIVE"}>
          <td>
            <Switch
              value={item.AgentStatus == "On"}
              onValueChange={(e) => {
                togglEgentStatus(item);
              }}
            />
          </td>
        </PermissionContainer>
      </tr>
    );
  };

  return (
    <>
      <div className={"w-full p-2"}>
        <ScrollView height={windowSize.height - 180}>
          <table className="w-full tb-list">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Agent</th>
                <th>Số máy lẻ</th>
                <th>Email</th>
                <th>Số di động</th>
                <PermissionContainer permission={"MNU_GIAMSAT_AGENT_RECEPTION"}>
                  <th>Nhận cuộc gọi vào</th>
                </PermissionContainer>
                <th>Trạng thái người dùng</th>
                <PermissionContainer
                  permission={"MNU_GIAMSAT_AGENT_ALLOWCALLOUT"}
                >
                  <th>Cho phép gọi ra</th>
                </PermissionContainer>
                <PermissionContainer
                  permission={"MNU_GIAMSAT_AGENT_FLAGACTIVE"}
                >
                  <th>Hoạt động</th>
                </PermissionContainer>
              </tr>
            </thead>
            <tbody>
              {list.map((item, idx) => {
                return <AgentItem item={item} idx={idx} key={nanoid()} />;
              })}
            </tbody>
          </table>
        </ScrollView>
      </div>
    </>
  );
};
