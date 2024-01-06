import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import './phone.scss';
import { Button, ScrollView, SelectBox, TextBox } from "devextreme-react";
import { Item as TabItem } from 'devextreme-react/tabs';
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcAgent, CcCallingInfo, CcOrgInfo } from "@/packages/types";
import { Height } from "devextreme-react/chart";
import { ar } from "date-fns/locale";
import { select } from "ts-pattern/dist/patterns";
import { nanoid } from "nanoid";

const AgentItem = ({ data, idx }: { data: CcAgent, idx: number }) => {

    const [selectedNumber, setSelectedNumber] = useState('');


    const onValueNumberChanged = useCallback((e: any) => {
        setSelectedNumber(e.value);
    }, []);

    const dataSource = useMemo(() => {

        let arr = [];

        if (data.Alias) arr.push(data.Alias);
        if (data.PhoneNumber) arr.push(data.PhoneNumber);
        if (arr.length > 0) setSelectedNumber(arr[0]);

        return arr;

    }, [data]);
    const handleCallBtn = () => {
        //alert(selectedNumber)
        window.Phone.dial(selectedNumber);
    };

    const color = useMemo(() => {
        if (data.DeviceState == 'Online') return '#009900';
        else if (data.DeviceState == 'Busy') return '#f0952d';

        return '#999';
    }, [data]);

    return <tr>
        <td>{idx + 1}</td>

        <td>
            <i className="dx-icon-isnotblank" style={{ color: color, fontSize: 8, marginRight: 10 }}></i>
            <span>
                {data.Name}
            </span></td>
        <td>

            <SelectBox
                style={{ height: 25 }}
                dataSource={dataSource}

                value={selectedNumber}
                onValueChanged={onValueNumberChanged}

            >
            </SelectBox>


        </td>
        <td><Button icon="tel" className="bg-green" onClick={handleCallBtn}></Button>

        </td>
    </tr>

}
export const TabInternal = ({ callingInfo, reloadIdx }: { callingInfo: CcCallingInfo, reloadIdx: number }) => {
    const { auth } = useAuth();

    const [data, setData] = useState<CcOrgInfo | null>(null);

    const [agentList, setAgentList] = useState<CcAgent[]>([]);

    const [filterOrg, setFilterOrg] = useState(auth.orgData?.Id ? Number(auth.orgData?.Id) : 0);

    const [keyword, setKeyword] = useState('');


    useEffect(() => {

        callApi.getOrgInfo(auth.networkId).then((resp) => {
            if (resp.Success && resp.Data) {

                setData(resp.Data);
            }
        });

        

    }, [reloadIdx]);

    useEffect(() => {

        var list = data?.AgentList.filter(a => {
            if (a.UserId == auth.currentUser?.Id) return false;
            if (filterOrg != 0)
                if (a.OrgId != filterOrg) return false;

            if (keyword != '') {
                if (!!a.Name && a.Name?.toLowerCase().indexOf(keyword) >= 0) return true;
                if (!!a.Alias && a.Alias?.indexOf(keyword) >= 0) return true;
                if (!!a.PhoneNumber && a.PhoneNumber?.indexOf(keyword) >= 0) return true;


                return false;
            }

            else return true;


        });

        if (!!list) setAgentList(list);
        else setAgentList([]);

    }, [data, keyword, filterOrg]);


    return <div className="w-full p-3">
        <SelectBox className="mb-2"

            dataSource={data?.OrgList}
            searchEnabled={true}
            displayExpr="Name"
            valueExpr="Id"
            placeholder="Chi nhánh"
            value={filterOrg}
            onValueChange={(v) => {

                setFilterOrg(v);
            }}
        ></SelectBox>
        <TextBox className="mb-2" placeholder="Nhập tên agent, SĐT, số máy lẻ..."
            value={keyword}
            onKeyUp={(e) => {
                var t: any = e.event?.currentTarget;
                setKeyword(t.value.toLowerCase())
            }}
        //onValueChange={(v) => setKeyword(v)}
        ></TextBox>
        <ScrollView style={{ maxHeight: 200 }}>
            <table className="tb-list w-full">
                <thead>
                    <tr>
                        <th style={{ width: 30 }}>STT</th>
                        <th>Agent</th>
                        <th style={{ width: 110 }}>Liên hệ</th>
                        <th style={{ width: 30 }}></th>
                    </tr>
                </thead>
                <tbody>
                    {agentList.length > 0 && agentList.map((item, idx) => {
                        return <AgentItem key={nanoid()} data={item} idx={idx}></AgentItem>

                    })}
                    {agentList.length == 0 && <tr>
                        <td colSpan={99}>Không tìm thấy agent</td>
                    </tr>}
                </tbody>
            </table>

        </ScrollView>
    </div >
}