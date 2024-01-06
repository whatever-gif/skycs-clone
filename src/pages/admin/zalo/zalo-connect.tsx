//import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { EticketLayout } from "@/packages/layouts/eticket-layout";
import RadioBox from "@/pages/Skycs/components/RadioBox";
import { Button, CheckBox, Switch, TextBox } from "devextreme-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

declare global {
    interface Window {
        setZaloCallbackData: any;
    }
}

export const ZaloConnect = () => {
    const zaloAppId = '';
    const codeChallenge = '';
    const domain = '';
    const codeVerify = '';
    const windowSize = useWindowSize();

    //    const url = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${zaloAppId}&code_challenge=${codeChallenge}&redirect_uri=${domain}/zalo/logincallback&state=${codeVerify}`;

    //    const url = 'https://oauth.zaloapp.com/v4/oa/permission?app_id=4395803384679347635&redirect_uri=https%3A%2F%2F596a-2405-4802-1bb4-12d0-d4c5-154b-ad-427b.ngrok-free.app%2Fzalo-login-callback';

    const url = '/zalo-login-callback?oa_id=1358767413636684272&code=4enaaSiAxtHekbYJX7tMJ4J9SfFMPSH80Ce7bzvRbainwmoPeLU4Q7MfCg-48PDm7uqaflPHttK-zNclqKNcVKBvK9wy0jPXUfz3XEGwwrOua3E_yJIBPXk7Jw2i4e0U28zhZQ4To4Wwe6RyjrBqIpwyGkwp7zWuEwTXoSL3-G0vnK-Jf6pWK060PkIQIfLj2A1Af9iR_rjssLYCzIoQVHFzCBwR2Aq3HT9UY_S-t4qItYppeK-4FLZ6FFQnU-yG1eP_gOfoIN1JyCBazKW0yIEFj3hR017WGA_N4gG70TzRcfCKWLaqyY_niI04tOkxx6OTK2UlTPJ3CuDC7FzLyEOvsaHbvGRCdKIhUdss5C67QyK19jDX_8mGhZ70RcS6w1_oUW';
    const popupwindow = function (url: any, title: any, w: number, h: number) {
        var left = (screen.width / 2) - (w / 2);
        var top = (screen.height / 2) - (h / 2);
        return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    }
    const openPopup = () => {
        return popupwindow(url, '', 500, windowSize.height - 200);

    }

    const auth= useAuth();

    useEffect(() => {
        //callApi.
       
        window.setZaloCallbackData = (code: any) => {


            //call api để save thông tin
            
        };
        return () => {
           
            window.setZaloCallbackData= undefined;
        };


    }, []);

    const [customApp, useCustomApp] = useState(false);
    return (
        <EticketLayout className={'eticket zalo'}>
            <EticketLayout.Slot name={'Header'}>
                <div className={'w-full flex flex-col'}>
                    <div className={'page-header w-full flex items-center p-2'}>
                        <div className={'before px-4 mr-auto'}>
                            <strong>Kết nối Zalo OA</strong>
                        </div>

                    </div>
                </div>
            </EticketLayout.Slot>


            <EticketLayout.Slot name={'Content'}>

                <div className={'w-full detail'}>
                    <div className="p-5">
                        <center>
                            <div style={{ width: 450, textAlign: 'left' }}>
                                <div className="w-full pt-2">
                                    <p>Nhập thông tin Zalo App để kết nối với OA của doanh nghiệp.</p>
                                    <p>Bạn cần đăng nhập tài khoản quản trị của OA để thực hiện tác vụ này.</p>
                                    <p>Chọn "Custom app" nếu dùng Zalo App riêng</p>
                                    <p>...</p>
                                </div>
                                <div className="flex mb-2 mt-3">
                                    <label>Custom app</label>
                                    <Switch switchedOnText="Custom App" className="ml-2"

                                        value={customApp}
                                        onValueChange={(e) => {
                                            useCustomApp((c) => { return !c; });
                                        }}
                                    />
                                </div>
                                {customApp && <>
                                    <span>Zalo App Id</span>
                                    <TextBox className="mb-3"></TextBox>
                                    <span>Zalo App secret</span>
                                    <TextBox mode="password" className="mb-3"></TextBox>
                                </>}
                                <Button text="Kết nối OA" onClick={openPopup} />
                            </div>
                        </center>
                    </div>

                </div>


            </EticketLayout.Slot>

        </EticketLayout >

    )
}