import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import './phone.scss';
import { Button, ScrollView, Tabs, DropDownBox, List, SelectBox } from "devextreme-react";
import { Item as TabItem } from 'devextreme-react/tabs';
import { Height } from "devextreme-react/chart";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcCall, CcCallingInfo } from "@/packages/types";
import { useClientgateApi } from "@/packages/api";

export function CallHistory({ onHide }: { onHide: any }) {

    const { auth } = useAuth();

    const [list, setList] = useState<CcCall[]>([]);

    const api = useClientgateApi();

    const showCustomerInfo = async (items: any[]) => {


        var params: any = [];

        items.forEach(item => {
            if (item.RemoteNumber && item.RemoteNumber.length > 9 && params.filter((p: any) => p.CtmPhoneNo == item.RemoteNumber).length == 0)
                params.push({
                    "CtmPhoneNo": item.RemoteNumber
                });
        });
        var resp = await api.Mst_Customer_GetByCtmPhoneNo(params);


        if (resp.isSuccess && resp.Data && resp.Data.Lst_Mst_Customer && resp.Data.Lst_Mst_Customer.length > 0
            && resp.Data.Lst_Mst_CustomerPhone && resp.Data.Lst_Mst_CustomerPhone.length > 0) {
            var ctmList = resp.Data.Lst_Mst_Customer;
            var phoneNoList = resp.Data.Lst_Mst_CustomerPhone;

            items.forEach(item => {
                if (item.RemoteNumber)

                    var phone = phoneNoList.find((ii: any) => ii.CtmPhoneNo == item.RemoteNumber);

                if (phone) {
                    var cus = ctmList.find((ii: any) => ii.CustomerCodeSys == phone.CustomerCodeSys);
                    if (cus)
                        item.CustomerDesc = cus.CustomerName;
                }

            });



        }

        setList(items);

    };


    useEffect(() => {

        callApi.getMyCallHistory(auth.networkId).then((resp) => {


            if (resp.Success && resp.Data) {
                showCustomerInfo(resp.Data);
            }
        });

    }, []);

    const CallItem = ({ item }: { item: CcCall }) => {

        const icon = useMemo(() => {
            if (item.Type == 'incoming') {
                return item.Status != 'Complete' ? 'icon-call-missed' : 'icon-call-in';
            }
            else {
                return item.Status != 'Complete' ? 'icon-call-noanswer' : 'icon-call-out';
            }
        }, [item]);

        return <div className="his-item w-full p-2 mb-1 position-relative">
            <div className="flex w-full">
                <i className={`${icon} type missed mr-1 mt-1`} />
                <span>{item.RemoteNumber}
                    <br />
                    <span className="text-small">{item.CustomerDesc}{item.AgentDesc}</span>
                </span>


            </div>
            <span className="time position-absolute text-small">{item.Date}<br />{item.Time}

            </span>

            <button className="btn-call" onClick={() => {
                window.Phone.dial(item.RemoteNumber);

            }}><i className="dx-icon-tel"></i></button>


        </div>
    }

    return (
        <div className="soft-phone">
            <div className="w-full pb-2">
                <div className={'w-full mb-2 block-head'}>
                    <span>Cuộc gọi gần đây</span>
                </div>
                <div className="history p-2 mb-2">
                    {list.map((item, idx) => { return <CallItem item={item} key={item.Id} /> })}
                </div>
            </div>
            <div className="w-full pl-5 pr-5 pb-5">
                <div className="flex ml-4 mt-2 pl-5">
                    <button style={{ width: 40, height: 40 }} onClick={onHide}><i className="dx-icon-bulletlist"></i></button>
                    <button className="rounded-btn btn-green ml-5" onClick={onHide}
                    ><i className="icon-keyboard"></i></button>

                </div>

            </div>
        </div>
    )
}