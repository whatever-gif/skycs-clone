import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";
import { useWindowSize } from "@/packages/hooks/useWindowSize";

import { showErrorAtom } from "@/packages/store";
import { Cpn_CampaignCustomerData, Cpn_Campaign, FlagActiveEnum, Mst_Customer } from "@/packages/types";
import { Button, DropDownBox, ScrollView, SelectBox, TextBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import "../styles.scss";


export const Cpn_CampaignInfo = ({ cpnCampainData, cpnCustomerData }: { cpnCampainData: Cpn_Campaign | undefined, cpnCustomerData: Cpn_CampaignCustomerData }) => {

    const { auth } = useAuth();
    const { t } = useI18n("Cpn_CampaignPerformPage");
    const api = useClientgateApi();

    const showError = useSetAtom(showErrorAtom);


    const [isExpand, setExpand] = useState(true);


    return <>{!!cpnCampainData && <>
        <div className="group-head w-full pl-1 pr-1">
            <span>Thông tin chiến dịch</span>
            <div className="float-right">

                {isExpand && <button
                    onClick={() => { setExpand(false) }}
                >
                    <i className="dx-icon-collapse" /> </button>}
                {!isExpand &&
                    <button onClick={() => { setExpand(true) }}>
                        <i className="dx-icon-expand" />
                    </button>
                }
            </div>

        </div>
        {isExpand &&
            <div className={`w-full`}>
                <div className="w-full p-2 pb-3">
                    <span className="text-gray float-left">Chiến dịch</span>
                    <span className="float-right">{cpnCampainData.CampaignName}</span>
                </div>
                <div className="w-full p-2 pb-3">
                    <span className="text-gray float-left">Khách hàng</span>
                    <span className="float-right">{cpnCustomerData.CustomerName}</span>
                </div>
                <div className="w-full p-2 pb-3">
                    <span className="text-gray float-left">SĐT</span>
                    <span className="float-right">{cpnCustomerData.CustomerPhoneNo1 ?? (cpnCustomerData.CustomerPhoneNo2 ?? cpnCustomerData.CustomerPhoneNo)}</span>
                </div>
            </div>
        }
    </>
    }
    </>



}