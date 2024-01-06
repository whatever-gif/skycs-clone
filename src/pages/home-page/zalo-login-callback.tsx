import { Button } from "devextreme-react";
import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";



export const ZaloLoginCallback = () => {


    const [searchParams, _] = useSearchParams()

    const sendCode = (code: any) => {
        // window.parent.postMessage({
        //     source: 'zalo-callback',
        //     code: code,
        // }, '*');

        window.opener.setZaloCallbackData(code);
    }

    useEffect(() => {
        const code = searchParams.get('code');
        sendCode(code);
        window.close();
    }, []);

    return (
        <div className="p-5">
            kk
        </div>
    )
}