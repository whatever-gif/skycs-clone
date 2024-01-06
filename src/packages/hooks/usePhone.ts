import { useEffect, useMemo } from "react";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "../contexts/auth";
export const usePhone = () => {

    const { auth } = useAuth();
    
    const phone = useMemo(() => {
        return window.Phone || {};
    }, []);
    return {
        call: (phoneNumber: any, funcOK?: any) => {

//            phoneNumber='0983712383';

            if (funcOK) {
                //console.log("getMyLatestCall");

                phone.dial(phoneNumber, function () {

                    callApi.getMyLatestCall(auth.networkId).then((resp) => {
                        //console.log("getMyLatestCall", resp);
                        if (resp.Success && resp.Data) {
                            funcOK(resp.Data);
                            
                        }
                    });

                    
                });
            }
            else 
            {
                //console.log('nogetMyLatestCall');
                phone.dial(phoneNumber);    
            }
            

        },
        showFowardCall: (call: any) => {
            phone.showForward(call && call.Id ? call.Id : 0);
        },
        status: phone.phoneStatus,
    };
}