import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  BaseGridView,
  ColumnOptions,
  GridViewPopup,
} from "@packages/ui/base-gridview";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useI18n } from "@/i18n/useI18n";

import SearchHistory from "../components/SearchHistory";
import SearchCategory from "../components/SearchCategory";
import SearchDetail from "../components/SearchDetail";
import NavNetworkLink from "@/components/Navigate";
import InputSearch from "../components/InputSearch";
import "./SearchMST.scss";
import { Outlet, useLocation } from "react-router-dom";
import { useNetworkNavigate } from "@/packages/hooks";
import { useAtom, useSetAtom } from "jotai";
import { dataSearchAtom, keySearchAtom } from "../components/store";
import { useClientgateApi } from "@/packages/api";
import { ScrollView } from "devextreme-react";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { PageHeaderLayout } from "@/packages/layouts/page-header-layout";
import PopupEdit from "../components/popupEdit";

const isSpeechRecognitionSupported = () =>
  "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

interface Window {
  webkitSpeechRecognition: any;
}

export const SearchMSTPage = () => {
  const { t } = useI18n("SearchMST");
  const setKeySearch = useSetAtom(keySearchAtom);
  const navigate = useNetworkNavigate();
  const windowSize = useWindowSize();
  const [searchVoice, setSearchVoice] = useState("inActive");
  const [searchTerm, setSearchTerm] = useState<any>("");
  const [searchQuery, setSearchQuery] = useState<any>(undefined);
  const [dataSearch, setDataSearch] = useAtom(dataSearchAtom);
  const api = useClientgateApi();

  const handleSpeechRecognition = () => {
    setSearchVoice("Active");
    const recognition = new ((window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition)();
    // recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setKeySearch(transcript);
    };

    recognition.onend = () => {
      recognition.stop();
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };
  };
  const handleKeyPress = async (event: any) => {
    if (event.key === "Enter") {
      setKeySearch(searchTerm);
      const resp = await api.KB_PostData_SearchMore(searchTerm);
      if (resp.isSuccess) {
        setDataSearch(resp?.Data);
        navigate("search/SearchInformation/Results");
      }
    }
  };
  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const [hidenInput, setHidenInput] = useState(true);

  const handleScroll = (e: any) => {
    // console.log(84, e);
    // if (e.scrollOffset.top >= 100) {
    //   setHidenInput(false);
    // } else if (e.scrollOffset.top === 0) {
    //   setHidenInput(true);
    // }
  };

  return (
    <AdminContentLayout className={"SearchMST"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderLayout>
          <PageHeaderLayout.Slot name={"Before"}>
            <div className="font-bold h-[44px] leading-[44px] dx-font-m">
              {t("Search Information")}
            </div>
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"Center"}>
            <div
              className={`border h-[44px] ${
                hidenInput ? "hidden" : ""
              } w-[600px] m-auto rounded-lg shadow-md my-1 translate-x-[-110px]`}
            >
              <div className="flex items-center justify-between px-[12px]">
                <div className="flex items-center h-[43px]">
                  <div className="h-[15px] w-[15px] ">
                    <img
                      src="/images/icons/search.svg"
                      alt=""
                      className="h-full w-full"
                    />
                  </div>
                  <input
                    onChange={handleSearch}
                    onKeyPress={handleKeyPress}
                    defaultValue={searchQuery}
                    type="text"
                    placeholder={t("Search")}
                    className="w-[530px] SearchMST-input border-none focus:rounded-xl outline-none "
                  />
                </div>
                <div
                  className="h-[20px] w-[15px] cursor-pointer"
                  onClick={handleSpeechRecognition}
                >
                  <img
                    src="/images/icons/micro.png"
                    alt=""
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"After"}></PageHeaderLayout.Slot>
        </PageHeaderLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ScrollView height={windowSize.height} onScroll={handleScroll}>
          <InputSearch hidenInput={hidenInput} />
          <div>
            <Outlet />
          </div>
        </ScrollView>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
