import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import './phone.scss';
import { Button, ScrollView, Tabs, DropDownBox, List, SelectBox } from "devextreme-react";
import { Item as TabItem } from 'devextreme-react/tabs';
import { Height } from "devextreme-react/chart";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcCall, CcCallingInfo } from "@/packages/types";
import { CallState } from "./call-button";
import { IncallKeypad } from "./incall-keypad";
import { showErrorAtom } from "@/packages/store";
import { useClientgateApi } from "@/packages/api";
import { useNetworkNavigate } from "@/packages/hooks";

export function InternalHasCall({ callingInfo, callState }: { callingInfo: CcCallingInfo, callState: CallState }) {

    const { auth } = useAuth();

    const [callData, setCallData] = useState<CcCall | null>(null);
    const [tabIdx, setTabIdx] = useState(1);
    const api = useClientgateApi();
    const [minimized, setMimimized] = useState(false);

    const showCustomerInfo = async (phoneNo: string) => {

        var params = [{
            "CtmPhoneNo": phoneNo
        }];
        var resp = await api.Mst_Customer_GetByCtmPhoneNo(params);

        //console.log("Mst_Customer_GetByCtmPhoneNo", resp)
        if (resp.isSuccess && resp.Data && resp.Data.Lst_Mst_Customer && resp.Data.Lst_Mst_Customer.length > 0) {
            var customer = resp.Data.Lst_Mst_Customer[0];
            setCallData((old) => {
                return { ...old, Description: customer.CustomerName, CustomerId: customer.CustomerCodeSys };

            });
        }

    };

    useEffect(() => {

        setMimimized(false);

        if (callState.direction == 'outgoing') {
            var ext = callingInfo.OrgInfo?.AgentList.find(a =>
                a.Extension == callState.toNumber
                || a.Alias == callState.toNumber

            );

            if (!!ext) {

                setCallData({
                    RemoteNumber: ext.Alias,
                    Description: ext.Name,
                    Type: "internal"

                });
                setTabIdx(1);

            }
            else {

                var rn = callState.toNumber ?? "";


                if (rn.startsWith('spy')) {

                    var nx = rn.replaceAll('spy', '');

                    var extT = callingInfo.OrgInfo?.AgentList.find(a =>
                        a.Extension == nx

                    );
                    if (!extT) {
                        window.Phone.hangup();
                        rn = 'invalid call';
                    }
                    else rn = `Spying ${extT.Alias}`;

                }

                setCallData({
                    RemoteNumber: rn,
                    //Description: ext.Name,
                    Type: "outgoing"

                });

                showCustomerInfo(rn);
                setTabIdx(0);

            }
        }
        else {

            callApi.getMyLatestCall(auth.networkId).then((resp) => {
                //console.log("getMyLatestCall", resp);
                if (resp.Success && resp.Data) {
                    setCallData(resp.Data);


                    if (resp.Data.Type == 'internal') setTabIdx(1);
                    else if (resp.Data.Type == 'outgoing') setTabIdx(0);
                    else setTabIdx(2);

                    if (resp.Data.Type == 'incoming' && resp.Data.RemoteNumber && resp.Data.RemoteNumber != '')
                        showCustomerInfo(resp.Data.RemoteNumber);
                }
            });
        }


    }, [callingInfo])


    const canForward = useMemo(() => {
        if (callState.direction == 'outgoing') return false;
        return true;
    }, [callState]);

    const Ring = () => {
        return <>
            <div className={'w-full pb-5'}>
                <center>
                    <span>{"Cuộc gọi đến"}</span>
                    <br />
                    <br />
                    <strong
                        className="cursor-pointer"
                        onClick={showCustomerDetail}
                    >{!!callData && callData.Description}</strong>

                    <br />
                    <span>{!!callData && callData.RemoteNumber}</span>
                </center>
            </div>
            <div className={'w-full pb-5'}>

                <center>
                    <div className="dial-btn-group">

                        <p>
                            <button className="rounded-btn btn-green" onClick={() => { window.Phone.answer(); }}>
                                <i className="icon-accept"></i>
                            </button>
                        </p>
                        <p className="btn-text">Trả lời</p>

                    </div>
                    <div className="dial-btn-group">
                        <p>
                            <button className="rounded-btn btn-red" onClick={() => { window.Phone.hangup(); }}>
                                <i className="icon-reject"></i>
                            </button>
                        </p>
                        <p className="btn-text">từ chối</p>

                    </div>

                </center>



            </div >
        </>
    };

    const [showKeypad, setKeypadVisibility] = useState(false);
    const [callTime, setCallTime] = useState(0);

    const [isHeld, setIsHeld] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const navigate = useNetworkNavigate();

    const showCustomerDetail = () => {


        if (callData?.CustomerId) {
            navigate(`/customer/detail/${callData?.CustomerId}`);

        }
    }

    useEffect(() => {
        if (callState.state == "incall") {
            setCallTime(1);
            //console.log('start interval1');
            const interval1 = window.setInterval(() => {
                setCallTime((o) => {
                    return o + 1;
                });

            }, 1000);

            return () => {
                //console.log('clear interval1');
                clearInterval(interval1);
            }
        }

    }, [callState]);

    const callTimeDesc = useMemo(() => {



        let min = Math.floor(callTime / 60);
        let sec = callTime % 60;
        if (sec < 10) return `${min}:0${sec}`;
        return `${min}:${sec}`;

    }, [callTime]);
    const Incall = () => {






        if (!minimized)
            return <>

                <div className={'w-full pb-5'}>
                    <center>
                        {/* <span>{callState.direction == "incoming" ? "Cuộc gọi đến" : "Cuộc gọi đi"}</span>
                    <br /> */}

                        <h5 className="cursor-pointer"
                            onClick={showCustomerDetail}
                        >{!!callData && callData.Description}</h5>

                        <span>{!!callData && callData.RemoteNumber}</span>
                        <br />

                        <span className="countup mt-1 mb-2">{callTimeDesc}</span>

                    </center>


                </div>

                {showKeypad &&
                    <>
                        <IncallKeypad />
                    </>
                }
                {
                    !showKeypad &&
                    <>
                        <center>

                            {!isMuted &&
                                <div className="dial-btn-group">
                                    <p>
                                        <button className="rounded-btn" onClick={() => { window.Phone.mute(); setIsMuted(true); }}>
                                            <i className="icon-mute"></i>
                                        </button>
                                    </p>
                                    <p className="btn-text">tắt âm</p>
                                </div>
                            }
                            {isMuted &&
                                <div className="dial-btn-group">
                                    <p>
                                        <button className="rounded-btn" onClick={() => { window.Phone.unmute(); setIsMuted(false); }}>
                                            <i className="icon-mic"></i>
                                        </button>
                                    </p>
                                    <p className="btn-text">bật âm</p>
                                </div>
                            }


                            {!isHeld &&

                                <div className="dial-btn-group">
                                    <p>
                                        <button className="rounded-btn" onClick={() => { window.Phone.hold(); setIsHeld(true); }}>
                                            <i className="icon-pause"></i>
                                        </button>
                                    </p>
                                    <p className="btn-text">giữ cuộc gọi</p>

                                </div>

                            }
                            {isHeld &&

                                <div className="dial-btn-group">
                                    <p>
                                        <button className="rounded-btn" onClick={() => { window.Phone.unhold(); setIsHeld(false); }}>
                                            <i className="icon-play"></i>
                                        </button>
                                    </p>
                                    <p className="btn-text">bỏ giữ</p>

                                </div>
                            }


                            <div className="dial-btn-group">
                                <p>
                                    <button className="rounded-btn" onClick={() => { setKeypadVisibility(true); }}>
                                        <i className="icon-keyboard"></i>
                                    </button>
                                </p>
                                <p className="btn-text">bàn phím</p>

                            </div>

                        </center>

                        <center className="mt-1">
                            {canForward &&
                                <div className="dial-btn-group">
                                    <p>
                                        <button className="rounded-btn" onClick={() => { window.Phone.showForward(); }}>
                                            <i className="icon-forward"></i>
                                        </button>
                                    </p>
                                    <p className="btn-text">chuyển</p>

                                </div>
                            }
                            {!canForward &&
                                <div className="dial-btn-group disabled">
                                    <p>
                                        <button className="rounded-btn" disabled>
                                            <i className="icon-forward"></i>
                                        </button>
                                    </p>
                                    <p className="btn-text">chuyển</p>

                                </div>
                            }
                            <div className="dial-btn-group disabled">
                                <p>
                                    <button className="rounded-btn" disabled>
                                        <i className="dx-icon-group"></i>
                                    </button>
                                </p>
                                <p className="btn-text">gọi nhóm</p>

                            </div>

                            <div className="dial-btn-group disabled">
                                <p>
                                    <button className="rounded-btn" disabled>
                                        <i className="icon-ticket"></i>
                                    </button>
                                </p>
                                <p className="btn-text">eTicket</p>

                            </div>

                        </center>
                    </>
                }

                <div className={'w-full pb-5 mt-3 position-relative'}>

                    <center>
                        <button className="rounded-btn btn-red" onClick={() => { window.Phone.hangup(); }}>
                            <i className="icon-reject"></i>
                        </button>

                    </center>
                    {showKeypad &&
                        <div style={{ position: "absolute", top: 0, right: 90 }}>
                            <button style={{ width: 40, height: 40 }} onClick={() => { setKeypadVisibility(false); }}>Ẩn</button>
                        </div>
                    }

                </div >

            </>

        else return (
            <div className="w-full float-left bg-white">
                <div className="flex pl-5 pb-3 pt-2">
                    <span className="countup mr-3">{callTimeDesc}</span>
                    <strong className="number">{callData?.RemoteNumber}</strong>
                </div>
            </div>
        );
    }


    const Calling = () => {
        return <>

            <div className={'w-full pb-5'}>
                <center>
                    <span>{callState.direction == "incoming" ? "Cuộc gọi đến" : "Cuộc gọi đi"}</span>
                    <br />
                    <br />
                    <strong
                        className="cursor-pointer"
                        onClick={showCustomerDetail}
                    >{!!callData && callData.Description}</strong>

                    <br />
                    <span>{!!callData && callData.RemoteNumber}</span>
                </center>
            </div>
            <div className={'w-full pb-5'}>

                <center>
                    <div className="dial-btn-group">
                        <p>
                            <button className="rounded-btn btn-red" onClick={() => { window.Phone.hangup(); }}>
                                <i className="dx-icon-tel"></i>
                            </button>
                        </p>
                        <p className="btn-text">kết thúc</p>

                    </div>

                </center>



            </div >

        </>
    }


    if (!minimized || callState.state != 'incall')
        return (
            <div className="soft-phone">
                <div className={'w-full tab-ctn bg-white mb-2 position-relative'}>
                    <div className="flex">
                        <Tabs
                            width={250}
                            selectedIndex={tabIdx}
                        >
                            <TabItem
                                text="Gọi ra"
                                disabled={callData?.Type != 'outgoing'}

                            >
                            </TabItem>
                            <TabItem
                                disabled={callData?.Type != 'internal'}
                                text="Gọi nội bộ"
                            >
                            </TabItem>

                            <TabItem
                                disabled={callData?.Type != 'incoming'}
                                text="Gọi vào"
                            >
                            </TabItem>

                        </Tabs>
                        <button
                            onClick={() => {
                                setMimimized(true);
                            }}
                            className="float-right" style={{ position: 'absolute', right: 10, color: "#333", fontSize: 20, height: 40 }}>
                            <i className="dx-icon-expand"></i>
                        </button>
                    </div>
                </div>
                {callState.state == 'ringing' && <Ring />}
                {callState.state == 'incall' && <Incall />}
                {callState.state == 'calling' && <Calling />}



            </div >


        )
    else return <>
        <div className="soft-phone minimized">
            <div className={'w-full bg-white'} onClick={() => {
                setMimimized(false);
            }}>
                <div className="flex">

                    <Incall />
                    <button

                        className="float-right" style={{ position: 'absolute', right: 10, color: "#333", fontSize: 20, height: 40 }}>
                        <i className="dx-icon-collapse"></i>
                    </button>
                </div>
            </div>

        </div>
    </>
}