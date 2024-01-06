import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import './phone.scss';
import { SelectBox } from "devextreme-react";
import { Item as TabItem } from 'devextreme-react/tabs';
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { CcCallingInfo } from "@/packages/types";

export const IncallKeypad = () => {

    const numberClick = (number: string) => {

        //const newNum = dtmf + number;
        setDtmf((val) => { return val + number; });

        const phone = window.Phone || {};

        phone.sendDTMF(number);

    }

  
    

    const [dtmf, setDtmf] = useState('');

    return <>

        <div className="dial-pad">
            <div className="w-full">
                <input className="dial-text mb-5" value={dtmf}
                 onChange={(e: any) => {
                    setDtmf(e.target.value)
                }}
                />
                <div className="flex">
                    <button className="rounded-btn" onClick={() => numberClick('1')}>1</button>
                    <button className="rounded-btn" onClick={() => numberClick('2')}>2</button>
                    <button className="rounded-btn" onClick={() => numberClick('3')}>3</button>
                </div>
            </div>
            <div className="w-full">
                <div className="flex">
                    <button className="rounded-btn" onClick={() => numberClick('4')}>4</button>
                    <button className="rounded-btn" onClick={() => numberClick('5')}>5</button>
                    <button className="rounded-btn" onClick={() => numberClick('6')}>6</button>
                </div>
            </div>
            <div className="w-full">
                <div className="flex">
                    <button className="rounded-btn" onClick={() => numberClick('7')}>7</button>
                    <button className="rounded-btn" onClick={() => numberClick('8')}>8</button>
                    <button className="rounded-btn" onClick={() => numberClick('9')}>9</button>
                </div>
            </div>
            <div className="w-full">
                <div className="flex">
                    <button className="rounded-btn" onClick={() => numberClick('*')}>*</button>
                    <button className="rounded-btn" onClick={() => numberClick('0')}>0</button>
                    <button className="rounded-btn" onClick={() => numberClick('#')} >#</button>
                </div>
            </div>
        </div>

    </>
}