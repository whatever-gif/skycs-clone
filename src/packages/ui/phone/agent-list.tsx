import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import './phone.scss';
import { Button, ScrollView, Tabs, DropDownBox, List, SelectBox } from "devextreme-react";
import { Item as TabItem } from 'devextreme-react/tabs';
import { Height } from "devextreme-react/chart";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcCallingInfo } from "@/packages/types";

export function AgentList() {

    const { auth } = useAuth();

    const [callingInfo, setCallingInfo] = useState<CcCallingInfo>({});
    const [show, setShow] = useState(false);




    useEffect(() => {

        callApi.getOrgInfo(auth.networkId).then((resp) => {
            //console.log(resp);

            if (resp.Success && resp.Data) {

            }
        });

    }, []);

    const [number2Dial, setNumber2Dial] = useState('');

    const numberClick = (number: string) => {

        const newNum = number2Dial + number;
        setNumber2Dial(newNum);

    }

    return (
        <>
           
        </>
    )
}