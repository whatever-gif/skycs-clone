import NavNetworkLink from "@/components/Navigate";
import { checkMenuPermision } from "@/components/PermissionContainer";
import { useNetworkNavigate } from "@/components/useNavigate";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { LoadPanel, TextBox } from "devextreme-react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchHistory from "./SearchHistory";
import { dataSearchAtom, keySearchAtom, loadpaineAtom } from "./store";
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export default function InputSearch(hidenInput: any) {
  const { t } = useI18n("SearchMST");
  const [searchVoice, setSearchVoice] = useState("inActive");
  const { pathname, search } = useLocation();
  const tabResults = pathname.split("/").pop();
  const [searchTerm, setSearchTerm] = useState("");
  const [dataSearch, setDataSearch] = useAtom(dataSearchAtom);
  const [loadPaine, setLoadPaine] = useAtom(loadpaineAtom);
  const [searchQuery, setKeySearch] = useAtom(keySearchAtom);
  const navigate = useNetworkNavigate();
  const api = useClientgateApi();
  const [select, setSelect] = useState(
    t(`Say 'Lookup igoss' to start a voice search`)
  );

  const handleSpeechRecognition = async () => {
    setSearchVoice("Active");
    const recognition = new ((window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition)();
    // recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;

      setKeySearch(transcript);
      if (transcript) {
        const response = await api.KB_PostData_SearchKeyWord(transcript);
        if (response.isSuccess) {
          setDataSearch(response?.Data);
          navigate("search/SearchInformation/Results");
          return response.Data;
        }
      }
    };

    recognition.onend = () => {
      recognition.stop();
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setSelect(t(`Không nhận dạng được giọng nói! Vui lòng thử lại...!`));
    };
  };

  const [nav, setMapItems] = useState([
    {
      id: 2,
      title: t("History"),
      key: "History",
      icon: "/images/icons/search.svg",
      pathName: "/search/SearchInformation",
      active: tabResults === "SearchInformation" ? true : false,
      permisionCode: "MNU_SEARCH_INFORMATION",
    },
    {
      id: 3,
      title: t("Category"),
      key: "Category",
      icon: "/images/icons/search.svg",
      pathName: "/search/SearchInformation/Category",
      active: false,
      permisionCode: "MNU_SEARCH_INFORMATION",
    },
  ]);

  const handleItemClick = (itemId: any) => {
    const updatedMapItems = nav.map((item) => {
      if (item.title === itemId.split("/").pop()) {
        return { ...item, active: true };
      }

      return { ...item, active: false };
    });
    setMapItems(updatedMapItems);
  };
  useEffect(() => {
    if (tabResults === "Results") {
      const updatedMapItems = nav.map((item) => {
        return { ...item, active: false };
      });
      setMapItems(updatedMapItems);
    }
  }, [tabResults]);

  const handleKeyPress = async (e: any) => {
    const keySearch = e.event.target.value;
    if (keySearch !== "") {
      setSearchTerm(keySearch);
      if (keySearch) {
        setLoadPaine(true);
      }
      const resp = await api.KB_PostData_SearchKeyWord(keySearch);
      if (resp.isSuccess) {
        setLoadPaine(false);
        setDataSearch(resp?.Data);
        navigate("search/SearchInformation/Results");
      }
      setKeySearch(keySearch);
    }
  };
  const handleSearch = (event: any) => {};

  useEffect(() => {
    if (searchVoice === "Active") {
      // console.log(searchVoice);
      setSelect(t(`Please say`));
    }
    if (searchQuery !== "" && tabResults === "Results") {
      setSelect(t(`Looking for: "${searchQuery}"`));
    }
  }, [searchVoice, tabResults]);
  const checkPermision = checkMenuPermision("MNU_SEARCH_INFORMATION");

  return (
    <>
      <LoadPanel
        container={".dx-viewport"}
        position={"center"}
        visible={loadPaine}
        showIndicator={true}
        showPane={true}
      />
      <div className="flex justify-center ">
        <div>
          <div
            className={`${
              tabResults === "Results" ? "hidden" : ""
            } w-[250px] m-auto`}
          >
            <img
              src="https://igoss.ecore.vn/Content/images/myigoss_bg.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className={` ${
              tabResults === "Results" ? "mt-3" : ""
            }  border h-[44px] w-[600px] m-auto rounded-lg shadow-md`}
          >
            <div className={`flex items-center justify-between px-[12px]`}>
              <div
                className={`flex  ${
                  hidenInput ? "" : "hidden"
                } items-center h-[43px]`}
              >
                <div className="h-[15px] w-[15px] ">
                  <img
                    src="/images/icons/search.svg"
                    alt=""
                    className="h-full w-full"
                  />
                </div>
                <TextBox
                  width={520}
                  className="ml-2 outline-none InputSearch"
                  onChange={handleSearch}
                  onEnterKey={handleKeyPress}
                  defaultValue={tabResults === "Results" ? searchQuery : ""}
                  placeholder={t("Search")}
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
          <div className="text-center py-3">{select}</div>
          <div className="flex items-center justify-center gap-3 mb-[30px]">
            {tabResults === "Results" ? (
              <NavNetworkLink to={"/search/SearchInformation/Results"}>
                <div
                  className={`${
                    tabResults === "Results"
                      ? `bg-[#EAF9F2] text-[#63be95] border-[#a4e6c8]`
                      : ""
                  } hover:bg-[#EAF9F2] hover:border-[#a4e6c8] hover:text-[#63be95] flex items-center border-[2px] rounded-md gap-1 px-2 py-[7px] cursor-pointer`}
                >
                  <div className="h-[15px] w-[15px]">
                    <img
                      src={"/images/icons/search.svg"}
                      alt=""
                      className="h-full w-full"
                    />
                  </div>
                  <div>{t("Search Results")}</div>
                </div>
              </NavNetworkLink>
            ) : (
              ""
            )}
            {nav.map((item) => {
              const check = checkMenuPermision(item?.permisionCode);
              return (
                <>
                  {check && (
                    <NavNetworkLink to={item.pathName}>
                      <div
                        onClick={() => handleItemClick(item.pathName)}
                        key={item.id}
                        className={`${
                          item.active || tabResults === item.key
                            ? "bg-[#EAF9F2] text-[#63be95] border-[#a4e6c8]"
                            : ""
                        } hover:bg-[#EAF9F2] flex items-center border-[2px] hover:text-[#63be95] rounded-md gap-1 px-2 py-[7px] cursor-pointer hover:border-[#a4e6c8]`}
                      >
                        <div className="h-[15px] w-[15px]">
                          <img
                            src={item.icon}
                            alt=""
                            className="h-full w-full"
                          />
                        </div>
                        <div>{item.title}</div>
                      </div>
                    </NavNetworkLink>
                  )}
                </>
              );
            })}
          </div>
          {tabResults === "SearchInformation"
            ? checkPermision && <SearchHistory />
            : ""}
        </div>
      </div>
    </>
  );
}
