import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import './phone.scss';
import { Button, ScrollView, Tabs, DropDownBox, List, SelectBox } from "devextreme-react";
import { Item as TabItem } from 'devextreme-react/tabs';
import { Height } from "devextreme-react/chart";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcCallingInfo } from "@/packages/types";
import { TabInternal } from "./tab_internal";
import { CallState } from "./call-button";

export function IncallInternal({ callingInfo, callState }: { callingInfo: CcCallingInfo, callState: CallState }) {

    return (
        <div className="soft-phone">
            <div className={'w-full tab-ctn bg-white mb-2 position-relative'}>
                <div className="flex">
                    <Tabs
                        width={250}
                        selectedIndex={1}
                    >
                        <TabItem
                            text="Gọi ra"
                            disabled={true}
                        >
                        </TabItem>
                        <TabItem
                            text="Gọi nội bộ"
                        >
                        </TabItem>

                        <TabItem
                            disabled={true}
                            text="Gọi vào"
                        >
                        </TabItem>

                    </Tabs>
                    <button className="float-right" style={{ position: 'absolute', right: 10, color: "#333", fontSize: 20, height: 40 }}>
                        <i className="dx-icon-expand"></i>
                    </button>
                </div>
            </div>

            <div className={'w-full tab-ctn bg-white mb-2 position-relative'}>
               
                <Button icon="close"
                    onClick={() => {

                        window.Phone.hangup();

                    }}
                ></Button>
            </div>


        </div >


    )
}