import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import React, { useEffect, useState } from "react";
import InputSearch from "./InputSearch";
import "../list/SearchMST.scss";

import { useClientgateApi } from "@/packages/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { nanoid } from "nanoid";
import { LoadPanel } from "devextreme-react";
import { useAtomValue } from "jotai";
import { authAtom } from "@/packages/store";

export default function SearchHistory() {
  const { t } = useI18n("SearchMST");
  const api = useClientgateApi();
  const auth = useAtomValue(authAtom);
  const { pathname, search } = useLocation();
  const tabResults = pathname.split("/").pop();
  const { data, isLoading, refetch } = useQuery(
    ["Search_Manager_History", tabResults],
    () => api.KB_PostData_SearchMore()
  );
  const queryClient = useQueryClient();
  const handleLastView = async (item: any) => {
    const resp = await api.KB_Post_UpdateLastView({
      KB_Post: {
        PostCode: item,
        OrgID: auth.orgId,
      },
    });
    queryClient.invalidateQueries({
      queryKey: ["Search_Manager_History", tabResults],
    });
  };

  useEffect(() => {
    if (tabResults === "History" || "SearchInformation") {
      refetch();
    }
  }, []);
  return (
    <div>
      <LoadPanel
        container={".dx-viewport"}
        position={"center"}
        visible={isLoading}
        showIndicator={true}
        showPane={true}
      />
      {data?.Data?.Lst_KB_PostLastView?.map((item: any, index: any) => {
        return (
          <NavNetworkLink
            to={`/search/SearchInformation/Detail/${item.PostCode}`}
          >
            <div
              className="m-auto w-[853px] hover:bg-[#EAF9F2] cursor-pointer search_history-bg"
              key={nanoid()}
              onClick={() => handleLastView(item.PostCode)}
            >
              <div className="w-[740px] border-b m-auto border-[#E3EBF1] py-[16px]">
                <div className="flex justify-center gap-2 ">
                  <div className="h-[15px]">
                    <img
                      src={`/images/icons/${
                        item.ShareType === "PRIVATE"
                          ? "lock.png"
                          : item.ShareType === "NETWORK"
                          ? "ORGANIZATION.png"
                          : item.ShareType === "ORGANIZATION"
                          ? "public.png"
                          : ""
                      }`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[14px] w-[711px] search_history-title font-bold line-clamp-2">
                      {item.Title}
                    </div>

                    <div className="flex justify-between mt-[12px]">
                      <div>
                        {item.kbc_CategoryName ? item.kbc_CategoryName : null}
                      </div>
                      <div className="flex items-center">
                        <div className="mr-1">{t(`Cập nhật:`)}</div>
                        <div>
                          {item.LogLUDTimeUTC ? item.LogLUDTimeUTC : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NavNetworkLink>
        );
      })}
    </div>
  );
}
