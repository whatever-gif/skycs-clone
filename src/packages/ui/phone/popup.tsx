import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import './phone.scss';
import { Button, ScrollView, Tabs, DropDownBox, List, SelectBox } from "devextreme-react";
import { Item as TabItem } from 'devextreme-react/tabs';
import { Height } from "devextreme-react/chart";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcCallingInfo } from "@/packages/types";
import { TabExternal } from "./tab_external";
import { TabInternal } from "./tab_internal";
import { CallState } from "./call-button";
import { InternalHasCall } from "./internal_has_call";
import { IncallInternal } from "./incall_internal";
import { CallHistory } from "./call-history";

export function PhonePopup({ callingInfo, callState }: { callingInfo: CcCallingInfo, callState: CallState }) {

    const [currentTab, setCurrentTab] = useState(0);
    const [reloadAgent, setReloadAgent] = useState(0);
    const [showHistory, setShowHistory] = useState(false);

    const onItemClick = (e: any) => {

        if (e.itemIndex == 1) {
            setReloadAgent(o => { return o + 1 });
        }
        setCurrentTab(e.itemIndex);
    }

    useEffect(() => {

        if (!!callState.state && callState.state != 'ended')
            setShowHistory(false);

    }, [callState]);

    return (
        <>
            {!showHistory

                &&
                <>
                    {

                        (!callState.state || callState.state == 'ended') && <div className="soft-phone">
                            <div className={'w-full tab-ctn bg-white mb-2 position-relative'}>
                                <div className="flex">
                                    <Tabs
                                        width={250}
                                        onItemClick={onItemClick}
                                        selectedIndex={currentTab}
                                    >
                                        <TabItem
                                            text="Gọi ra"
                                        >
                                        </TabItem>
                                        <TabItem
                                            text="Gọi nội bộ"
                                        >
                                        </TabItem>

                                        {/* <TabItem
                                    disabled={true}
                                    text="Gọi vào"
                                >
                                </TabItem> */}

                                    </Tabs>
                                    {/* <button className="float-right" style={{ position: 'absolute', right: 10, color: "#333", fontSize: 20, height: 40 }}>
                                <i className="dx-icon-expand"></i>
                            </button> */}
                                </div>
                            </div>

                            {currentTab == 0 && <TabExternal callingInfo={callingInfo} onShowHistory={() => {
                                setShowHistory(true);
                            }} />}
                            {currentTab == 1 && <TabInternal callingInfo={callingInfo} reloadIdx={reloadAgent} />}


                        </div>
                    }

                    {!!callState.state && callState.state != 'ended' && <InternalHasCall callState={callState} callingInfo={callingInfo} />}
                </>
            }
            {showHistory && <>

                <CallHistory onHide={() => {
                    setShowHistory(false);
                }} />
            </>}
        </>
    )
}