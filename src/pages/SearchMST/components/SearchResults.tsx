import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect } from "react";
import { dataSearchAtom, keySearchAtom, loadpaineAtom } from "./store";
import { useClientgateApi } from "@/packages/api";
import { authAtom } from "@/packages/store";
import { formatText } from "@/pages/Post_Manager/components/components/FormatCategory";
import { LoadPanel, ScrollView } from "devextreme-react";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { useLocation, useNavigate } from "react-router-dom";
import { useNetworkNavigate } from "@/packages/hooks";
import { useQueryClient } from "@tanstack/react-query";
import {
  findOccurrences,
  generateOutputWithOccurrences,
} from "./HighLightText";

export default function SearchResults() {
  const { t } = useI18n("SearchMST");
  const { pathname, search } = useLocation();
  const tabResults = pathname.split("/").pop();
  const auth = useAtomValue(authAtom);
  const keySearch = useAtomValue(keySearchAtom);
  const dataSearch = useAtomValue(dataSearchAtom);
  const [loadPaine, setLoadPaine] = useAtom(loadpaineAtom);
  const api = useClientgateApi();
  const queryClient = useQueryClient();
  const handleLastView = async (item: any) => {
    const resp = await api.KB_Post_UpdateLastView({
      KB_Post: {
        PostCode: item,
        OrgID: auth.orgId,
      },
    });
    queryClient.refetchQueries({
      queryKey: ["Post_Manager_History", tabResults],
      exact: true,
    });
  };
  const navigate = useNetworkNavigate();
  useEffect(() => {
    if (dataSearch === null) {
      navigate("/search/SearchInformation");
    }
  }, [dataSearch]);

  return (
    <div>
      {keySearch !== "" ? (
        <>
          <div className="font-bold border-b pb-3 px-4 text-[15px]">
            {t(`Kết quả tìm kiếm cho từ khóa: "${keySearch ?? keySearch}"`)}
          </div>
          <div>
            {dataSearch?.Lst_KB_Post?.length === 0 ? (
              <div className="mt-[145px] text-center">
                {t("Không có dữ liệu")}
              </div>
            ) : (
              dataSearch?.Lst_KB_Post?.map((item: any, index: any) => {
                return (
                  <div
                    key={index}
                    className=" hover:bg-[#EAF9F2] px-6 cursor-pointer search_history-bg"
                    onClick={() => handleLastView(item?.PostCode)}
                  >
                    <div className="py-[16px]">
                      <div className=" ">
                        <div>
                          <NavNetworkLink
                            to={`/search/SearchInformation/Detail/${item.PostCode}`}
                          >
                            <div className="text-[14px] search_history-title font-bold line-clamp-2">
                              {item.Title}
                            </div>
                            <div className="flex justify-between mt-[12px]">
                              <div
                                className="line-clamp-2 text-[14px] text-black"
                                dangerouslySetInnerHTML={{
                                  __html: generateOutputWithOccurrences(
                                    item?.Detail,
                                    findOccurrences(item?.Detail, keySearch),
                                    50,
                                    keySearch
                                  ),
                                }}
                              ></div>
                            </div>
                          </NavNetworkLink>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <p>{t("Không có dữ liệu để hiển thị")}</p>
          <p className="mt-1">{t("Vui lòng nhập từ khóa.")}</p>
        </div>
      )}
    </div>
  );
}
