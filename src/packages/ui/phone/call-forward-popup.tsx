import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import './phone.scss';
import { Button, ScrollView, Tabs, DropDownBox, List, SelectBox, Popup, TextBox } from "devextreme-react";
import { Item as TabItem } from 'devextreme-react/tabs';
import { Height } from "devextreme-react/chart";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcAgent, CcCallingInfo } from "@/packages/types";
import { nanoid } from "nanoid";

export function CallFowardPopup() {

    const { auth } = useAuth();

    const [list, setList] = useState<CcAgent[]>([]);

    const [isShowCallforwadPop, showCallforwadPopup] = useState(false);
    const [callId2Forward, setCallId2Forward] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);
    const [fNumber, setFNumber] = useState('');
    const onTabClick = (e: any) => {
        setCurrentTab(e.itemIndex);
    };
    const onNoClick = () => {
        showCallforwadPopup(false);

    };

    useEffect(() => {

        const phone = window.Phone || {};
        phone.onShowforward(function (cid: any) {
            if (!cid) cid = 0;
            setCallId2Forward(cid);
            showCallforwadPopup(true);
        });

    }, []);

    useEffect(() => {

        if (isShowCallforwadPop)
            callApi.getOrgAgentList(auth.networkId).then((resp) => {

                if (resp.Success && resp.Data) {
                    setList(resp.Data);
                }
            });

    }, [isShowCallforwadPop]);

    const [number2Dial, setNumber2Dial] = useState('');

    const doForward = (number?: string) => {

        if (!number) return;


        callApi.redirect(auth.networkId, { callId: callId2Forward, target: number }).then((resp) => {

            //console.log(resp);
            if (resp.Success && resp.Data) {
                showCallforwadPopup(false);
            }
            else alert(resp.ErrorMessage)
        });



    }

    const AgentItem = ({ item, idx }: { item: CcAgent, idx: any }) => {
        return <tr>
            <td>{idx + 1}</td>
            <td>
                {item.Name}
            </td>
            <td>{item.Alias}</td>

            <td><span className={`monitor-status ${item.DeviceState?.toLocaleLowerCase()}`}> {item.DeviceState}</span></td>
            <td>
                <Button text="Chuyển" onClick={() => { doForward(item.Extension); }}></Button>
            </td>

        </tr>
    }

    return <>
        <Popup
            visible={isShowCallforwadPop}
            showTitle={true}
            title={"Chuyển cuộc gọi"}
            showCloseButton={true}
            height={"auto"}
            onHiding={onNoClick}
            width={600}

            wrapperAttr={{
                class: "simple-popup",
            }}


        >

            <div className={'w-full flex flex-col pt-0 sep-bottom-3 tab-ctn-1'}>
                <Tabs

                    onItemClick={onTabClick}
                    selectedIndex={currentTab}
                >
                    <TabItem text="Agent"></TabItem>
                    <TabItem text="Điện thoại"></TabItem>

                </Tabs>
            </div>

            {currentTab == 0 && <ScrollView height={350} className="pt-2">
                <table className="w-full simple-tb-list">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>
                                Tên Agent
                            </th>
                            <th>Số máy lẻ</th>

                            <th>Trạng thái người dùng</th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.map((item, idx) => {
                                return <AgentItem item={item} idx={idx} key={nanoid()} />
                            })
                        }

                    </tbody>
                </table>
            </ScrollView>
            }
            {currentTab == 1 && <div className="w-full p-5">
                <div className="flex">
                    <TextBox width={'60%'} className="mr-2" value={fNumber} onValueChanged={(e) => { setFNumber(e.value) }}></TextBox>
                    <Button text="Chuyển" onClick={() => { doForward(fNumber); }}></Button>
                </div>
            </div>}
        </Popup >
    </>
}