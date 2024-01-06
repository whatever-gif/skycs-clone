import { useCallback, useEffect, useState } from "react";
import './phone.scss';
import { ScrollView, SelectBox } from "devextreme-react";
import { CcCallingInfo } from "@/packages/types";
import { useClientgateApi } from "@/packages/api";
import { nanoid } from "nanoid";
import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";

interface CustomerInfo {
    CustomerCodeSys: string,
    Name: string,
    PhoneNo: string,
}
export const TabExternal = ({ callingInfo, onShowHistory }: { callingInfo: CcCallingInfo, onShowHistory: any }) => {

    const AutoNumber='Tự động';
    const [selectedNumber, setSelectedNumber] = useState(callingInfo.CalloutNumber ?? '');
    const api = useClientgateApi();
    const { auth } = useAuth();
    const onValueNumberChanged = useCallback((e: any) => {

        setSelectedNumber(e.value);
        var val= e.value;
        if(val == AutoNumber) val='';

        callApi.setCalloutNumber(auth.networkId, { number: val }).then(resp => {
            if (resp.Data) {

            }
        });


    }, []);
    const [cmtSearchList, setCtmSearchList] = useState<CustomerInfo[] | null>(null);

    const searchCustomer = async (keyword: string) => {


        if (keyword == '' || keyword.length < 3) return setCtmSearchList(null);
        var params: any = [{ CtmPhoneNo: keyword }];


        var resp = await api.GetByCtmPhoneNoLike(params);
        //console.log(resp);
        var list: CustomerInfo[] = [];
        if (resp.isSuccess && resp.Data && resp.Data.Lst_Mst_Customer && resp.Data.Lst_Mst_Customer.length > 0
            && resp.Data.Lst_Mst_CustomerPhone && resp.Data.Lst_Mst_CustomerPhone.length > 0) {
            var ctmList = resp.Data.Lst_Mst_Customer;
            var phoneNoList = resp.Data.Lst_Mst_CustomerPhone;

            phoneNoList.forEach((phone: any) => {

                var cus = ctmList.find((ii: any) => ii.CustomerCodeSys == phone.CustomerCodeSys);
                if (cus && list.filter(i => i.CustomerCodeSys == cus.CustomerCodeSys).length == 0) {
                    list.push({
                        CustomerCodeSys: cus.CustomerCodeSys,
                        PhoneNo: phone.CtmPhoneNo,
                        Name: cus.CustomerName,
                    });
                }

            });



        }

        setCtmSearchList(list);

    };


    const [number2Dial, setNumber2Dial] = useState('');

    const numberClick = (number: string) => {

        var newNum = number2Dial;
        if (number == '-') {

            if (newNum.length > 0) {
                newNum = newNum.substring(0, newNum.length - 1);
            }
        }
        else newNum += number;



        setNumber2Dial(newNum);
        searchCustomer(newNum);



    }

    const handleCallBtn = () => {
        window.Phone.dial(number2Dial);
    };



    useEffect(() => {
        if (callingInfo.CalloutNumbers && callingInfo.CalloutNumbers?.length > 0) {
            setSelectedNumber(callingInfo.CalloutNumber ?? callingInfo.CalloutNumbers[0]);
        }
    }, [callingInfo]);

    const CtmList = ({ list }: { list: CustomerInfo[] | null }) => {
        if (!list || list.length == 0) return <></>;

        return <>
            <div className="w-full p-2 ctm-search-list float-left">

                {list.map(ctm => {
                    return <div className="ctm-search-item" key={nanoid()} onClick={() => {
                        window.Phone.dial(ctm.PhoneNo);
                    }}>
                        <span className="float-left">{ctm.Name}</span>
                        <span className="float-right">{ctm.PhoneNo}</span>
                    </div>
                })
                }

            </div>
        </>;
    }

    return <>
        <div className="w-full pl-5 pr-5">
            <CtmList list={cmtSearchList} />
            <div className="w-full pl-5 pr-5">

                <input className="dial-text" value={number2Dial} onChange={(e: any) => {
                    setNumber2Dial(e.target.value)
                }}

                />
            </div>

        </div>
        <div className="dial-pad">
            <div className="w-full">
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

        <div className="w-full pl-5 pr-5">
            <div className="flex ml-5 pl-1">
                <span className="mr-3">Gọi từ</span>
                <SelectBox
                    style={{ width: 150, height: 25 }}
                    dataSource={[AutoNumber, ...callingInfo.CalloutNumbers??[]]}
                    value={selectedNumber}
                    onValueChanged={onValueNumberChanged}
                    placeholder={AutoNumber}
                ></SelectBox>

            </div>
        </div>
        <div className="w-full pl-5 pr-5 pb-5">
            <div className="flex ml-5 mt-2 pl-4">
                <button style={{ width: 40, height: 40 }} onClick={onShowHistory}><i className="dx-icon-bulletlist"></i></button>
                <button className="rounded-btn btn-green ml-5"
                    onClick={handleCallBtn}
                ><i className="dx-icon-tel"></i></button>

                <button className="ml-4"
                    style={{ width: 40, height: 40 }}
                    onClick={() => numberClick('-')}
                ><i className="icon-call-del-digit"></i></button>
            </div>

        </div>

    </>
}